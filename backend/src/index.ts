import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { authRouter } from "./routes/auth";
import { qrRouter } from "./routes/qr";
import { analyticsRouter } from "./routes/analytics";
import { publicRouter } from "./routes/public";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/qr", qrRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/public", publicRouter);

const PORT = process.env.PORT || 4000;
// Render free plan uses PORT env var, defaults to 10000

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});


