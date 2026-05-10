import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import coverLetterRoutes from "./routes/coverLetterRoutes.js";
import passport from "passport";
import "./config/passport.js";

const app = express();


// Connect Database
connectDB();


// Security Middleware
app.use(helmet());


// CORS
app.use(cors({
  origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, "http://localhost:5173"] : "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Logging
app.use(morgan("dev"));


// JSON Parser
app.use(express.json({ limit: "10mb" }));


// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use(limiter);


// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Job Tracker API running",
  });
});


// Routes Placeholder
app.use(passport.initialize());
app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use(
  "/api/cover-letters",
  coverLetterRoutes
);

// Error Middleware (MUST BE LAST)
app.use(errorMiddleware);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});