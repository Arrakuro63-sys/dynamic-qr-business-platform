import { Router } from "express";
import { prisma } from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import QRCode from "qrcode";
import crypto from "crypto";

export const qrRouter = Router();

qrRouter.use(authMiddleware);

qrRouter.get("/", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.businessId) {
      return res.status(400).json({ message: "İşletme bulunamadı" });
    }
    const qrs = await prisma.qrCode.findMany({
      where: { businessId: req.user.businessId },
      include: { scans: true }
    });
    res.json(qrs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

qrRouter.post("/", async (req: AuthRequest, res) => {
  try {
    if (!req.user?.businessId) {
      return res.status(400).json({ message: "İşletme bulunamadı" });
    }

    const business = await prisma.business.findUnique({
      where: { id: req.user.businessId },
      include: { qrs: true }
    });
    if (!business) {
      return res.status(400).json({ message: "İşletme bulunamadı" });
    }

    if (business.plan === "FREE" && business.qrs.length >= 1) {
      return res.status(403).json({ message: "Ücretsiz planda en fazla 1 QR oluşturabilirsiniz" });
    }

    const { title, type, config, color, logoUrl } = req.body;

    const uuid = crypto.randomUUID();
    const targetUrl = `${process.env.PUBLIC_QR_BASE_URL || "http://localhost:3000"}/q/${uuid}`;

    const svgData = await QRCode.toString(targetUrl, {
      type: "svg",
      color: { dark: color || "#000000", light: "#ffffff" }
    });

    const pngData = await QRCode.toDataURL(targetUrl, {
      color: { dark: color || "#000000", light: "#ffffff" }
    });

    const qr = await prisma.qrCode.create({
      data: {
        uuid,
        title,
        type,
        config: JSON.stringify(config ?? {}),
        color,
        logoUrl,
        svgData,
        pngData,
        businessId: business.id
      }
    });

    res.status(201).json(qr);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

qrRouter.put("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    if (!req.user?.businessId) {
      return res.status(400).json({ message: "İşletme bulunamadı" });
    }

    const qr = await prisma.qrCode.findFirst({
      where: { id: Number(id), businessId: req.user.businessId }
    });
    if (!qr) {
      return res.status(404).json({ message: "QR bulunamadı" });
    }

    const business = await prisma.business.findUnique({
      where: { id: req.user.businessId }
    });

    const { title, config, color, logoUrl } = req.body;

    // Ücretsiz planda dinamik içerik ve analytics kapalı, ama basit title/config değişikliğini de kapatmak istiyorsak:
    if (business?.plan === "FREE") {
      return res
        .status(403)
        .json({ message: "İçerik düzenleme için PRO plana geçmeniz gerekir" });
    }

    const updated = await prisma.qrCode.update({
      where: { id: qr.id },
      data: {
        title: title ?? qr.title,
        config: config ? JSON.stringify(config) : qr.config,
        color: color ?? qr.color,
        logoUrl: logoUrl ?? qr.logoUrl
      }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

qrRouter.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    if (!req.user?.businessId) {
      return res.status(400).json({ message: "İşletme bulunamadı" });
    }
    const qr = await prisma.qrCode.findFirst({
      where: { id: Number(id), businessId: req.user.businessId }
    });
    if (!qr) {
      return res.status(404).json({ message: "QR bulunamadı" });
    }
    await prisma.scanEvent.deleteMany({ where: { qrId: qr.id } });
    await prisma.qrCode.delete({ where: { id: qr.id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});


