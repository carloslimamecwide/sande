import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./lib/env";
import { errorHandler } from "./middlewares/errorHandler";

// Routes
import authRoutes from "./routes/auth";
import carsRoutes from "./routes/cars";
import imagesRoutes from "./routes/images";
import adminRoutes from "./routes/admin";

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/admin", adminRoutes);

// Error handler (deve ser o último middleware)
app.use(errorHandler);

export default app;
