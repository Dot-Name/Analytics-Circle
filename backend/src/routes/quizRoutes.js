import express from "express";
import multer from "multer";
import { 
  createOrUpdateQuiz, 
  getQuizBySection, 
  startQuizAttempt, 
  submitQuizAttempt,
  getAdminQuizBySection,
  deleteQuiz // 👈 1. IMPORTED: Added your new delete controller function
} from "../controllers/quizController.js";
import authMiddleware from "../middleware/authMiddelware.js"; 
import authorizeRoles from "../middleware/rolemiddleware.js";
import checkSubscription from "../middleware/checkSubscription.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ==========================================
// 🛠️ ADMIN ROUTES
// ==========================================

/**
 * Manage whole quiz structures with multipart form-data image streaming
 * Access: Private (ADMIN Only)
 */
router.post(
  "/", 
  authMiddleware, 
  authorizeRoles("ADMIN"), 
  upload.any(), 
  createOrUpdateQuiz
);

/**
 * Fetch ALL Quiz units matching a targeted structural Section Node
 * Access: Private (ADMIN Only)
 */
router.get(
  "/admin/section/:sectionId",
  authMiddleware,
  authorizeRoles("ADMIN"),
  getAdminQuizBySection
);

/**
 * 🌟 2. ADDED: DELETE AN ENTIRE QUIZ NODE & ASSOCIATED CLOUDINARY IMAGES
 * Path: DELETE /api/v1/quizzes/:quizId
 * Access: Private (ADMIN Only)
 */
router.delete(
  "/:quizId",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteQuiz
);

// ==========================================
// 🎓 STUDENT ROUTES
// ==========================================

/**
 * ⏱️ START TIMED QUIZ SESSION (Initializes countdown window)
 * Path: POST /api/v1/quizzes/start
 * Access: Private (STUDENT & ADMIN)
 */
router.post(
  "/start", 
  authMiddleware, 
  checkSubscription,
  startQuizAttempt
);

/**
 * FETCH QUIZ STRUCTURE BY SECTION (Hides correct answers completely)
 * Path: GET /api/v1/quizzes/section/:courseId/:sectionId
 * Access: Private (Subscribed Students Only)
 */
router.get(
  "/section/:courseId/:sectionId", 
  authMiddleware, 
  checkSubscription, 
  getQuizBySection
);

/**
 * SUBMIT MCQ ANSWERS & COMPUTE GRADE METRICS (Handles Timeout Auto-Submissions)
 * Path: POST /api/v1/quizzes/submit/:courseId/:quizId
 * Access: Private (Subscribed Students Only)
 */
router.post(
  "/submit/:courseId/:quizId", 
  authMiddleware, 
  checkSubscription, 
  submitQuizAttempt
);

export default router;