import { Router } from "express";
import { prisma } from "../prisma";
import { AuthRequest, authMiddleware } from "../middleware/auth";

export const analyticsRouter = Router();

analyticsRouter.get(
  "/qr/:uuid",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { uuid } = req.params;
      if (!req.user?.businessId) {
        return res.status(400).json({ message: "İşletme bulunamadı" });
      }

      const business = await prisma.business.findUnique({
        where: { id: req.user.businessId }
      });

      if (!business || business.plan !== "PRO") {
        return res
          .status(403)
          .json({ message: "Analytics sadece PRO plan için aktiftir" });
      }

      const qr = await prisma.qrCode.findFirst({
        where: { uuid, businessId: req.user.businessId }
      });

      if (!qr) {
        return res.status(404).json({ message: "QR bulunamadı" });
      }

      const total = await prisma.scanEvent.count({ where: { qrId: qr.id } });

      const daily = await prisma.$queryRaw<
        { day: string; count: number }[]
      >`SELECT strftime('%Y-%m-%d', "createdAt") as day, COUNT(*) as count FROM "ScanEvent" WHERE "qrId" = ${qr.id} GROUP BY day ORDER BY day DESC LIMIT 30`;

      const byDevice = await prisma.scanEvent.groupBy({
        by: ["device"],
        where: { qrId: qr.id },
        _count: { device: true }
      });

      res.json({
        total,
        daily,
        byDevice
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }
);

// Public scan endpoint - Next.js public sayfası bu endpoint'i tetikleyebilir
analyticsRouter.post("/scan/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;
    const userAgent = req.headers["user-agent"] || "";
    const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
    const device = isMobile ? "MOBILE" : "DESKTOP";

    const qr = await prisma.qrCode.findUnique({ where: { uuid } });
    if (!qr) {
      return res.status(404).json({ message: "QR bulunamadı" });
    }

    await prisma.scanEvent.create({
      data: {
        qrId: qr.id,
        device,
        userAgent
      }
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});


