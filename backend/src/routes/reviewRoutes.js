import express from "express";
import authMiddleware from "../middleware/authMiddelware.js"; // ✅ FIX: Pointing to the correct file path
import checkSubscription from "../middleware/checkSubscription.js";
import {
  upsertCourseReview,
  getCourseReviewsCatalog,
  deleteMyReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.route("/:courseId")
  .get(getCourseReviewsCatalog) // 🌐 Public visibility layer for storefront indexing
  .post(authMiddleware, checkSubscription, upsertCourseReview) // 🔒 Enforces verification and purchase constraints
  .delete(authMiddleware, deleteMyReview); // 🔒 FIX: Added authMiddleware here so req.userId exists!

export default router;