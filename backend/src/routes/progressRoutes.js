import express from "express";
import { 
  syncVideoProgress, 
  getStudentDashboardOverview // 👈 1. ADD THIS IMPORT HERE
} from "../controllers/progressController.js";
import authMiddleware from "../middleware/authMiddelware.js"; 
import checkSubscription from "../middleware/checkSubscription.js"; 
import { downloadCourseCertificate } from "../controllers/certificateController.js";

const router = express.Router();

// Existing Video Sync Route
router.post(
  "/sync-video/:courseId", 
  authMiddleware, 
  checkSubscription, 
  syncVideoProgress
);

// 🎓 NEW: Student Dashboard Overview Aggregator Route
router.get(
  "/dashboard/:courseId", // 👈 2. ADD THIS ROUTE ENTRY HERE
  authMiddleware, 
  checkSubscription, 
  getStudentDashboardOverview
);

router.get(
  "/certificates/download/:courseId", 
  authMiddleware, 
  checkSubscription, 
  downloadCourseCertificate
);
export default router;