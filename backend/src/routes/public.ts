import { Router } from "express";
import { prisma } from "../prisma";

export const publicRouter = Router();

publicRouter.get("/qr/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;
    const qr = await prisma.qrCode.findUnique({ where: { uuid } });
    if (!qr) {
      return res.status(404).json({ message: "QR bulunamadı" });
    }
    let config: any = {};
    try {
      config = JSON.parse(qr.config);
    } catch {
      config = {};
    }
    res.json({
      title: qr.title,
      type: qr.type,
      config,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});


