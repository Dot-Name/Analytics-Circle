import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/course.js";
import sectionRoutes from "./routes/section.js";
import lectureRoutes from "./routes/lecture.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import verifyRoutes from "./routes/verifyRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Security
app.use(helmet());

// Compression
app.use(compression());

// Parsing
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Logging
app.use(morgan("dev"));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Base Route
app.get("/", (req, res) => {
  res.json({
    message: "LMS Backend API",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/sections", sectionRoutes);
app.use("/api/v1/lectures", lectureRoutes);
app.use("/api/v1/quizzes", quizRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1", verifyRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/users", userRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


export default app;