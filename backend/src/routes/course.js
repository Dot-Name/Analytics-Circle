import express from "express";
import multer from "multer"; // 👈 1. Import Multer
import {
    createCourse,
    getAllCourses,
    getCourseBySlug,
    updateCourse,
    softDeleteCourse,
    togglePublishStatus,
    getAdminAllCourses
} from "../controllers/courseController.js";
import authMiddleware from "../middleware/authMiddelware.js";
import authorizeRoles from "../middleware/rolemiddleware.js";

// 2. Configure Multer to parse image binaries into memory buffers
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Public Routes
router.get("/", getAllCourses);
router.get("/:slug", getCourseBySlug);

// Admin-Only Routes (Injected with upload.single middleware mapping to "thumbnail")
router.post("/", authMiddleware, authorizeRoles("ADMIN"), upload.single("thumbnail"), createCourse);
router.put("/:courseId", authMiddleware, authorizeRoles("ADMIN"), upload.single("thumbnail"), updateCourse);
router.delete("/:courseId", authMiddleware, authorizeRoles("ADMIN"), softDeleteCourse);
router.patch("/:courseId/publish", authMiddleware, authorizeRoles("ADMIN"), togglePublishStatus);
router.get("/admin/all", authMiddleware, authorizeRoles("ADMIN"), getAdminAllCourses);

export default router;