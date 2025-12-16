import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password, businessName } = req.body;
    if (!email || !password || !businessName) {
      return res.status(400).json({ message: "Eksik alanlar" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Bu email zaten kayıtlı" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: "BUSINESS",
        business: {
          create: {
            name: businessName,
            plan: "FREE"
          }
        }
      },
      include: { business: true }
    });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        businessId: user.business?.id ?? null
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    return res.json({ token, user: { id: user.id, email: user.email, role: user.role, business: user.business } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Eksik alanlar" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { business: true }
    });
    if (!user) {
      return res.status(401).json({ message: "Geçersiz bilgiler" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Geçersiz bilgiler" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        businessId: user.business?.id ?? null
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    return res.json({ token, user: { id: user.id, email: user.email, role: user.role, business: user.business } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
});


