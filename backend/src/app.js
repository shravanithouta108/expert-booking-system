const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const expertRoutes = require("./routes/expertRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ── Security & Logging ────────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ── Body Parser ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ success: true, message: "Expert Booking API is running 🚀" })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/experts", expertRoutes);
app.use("/api/bookings", bookingRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
