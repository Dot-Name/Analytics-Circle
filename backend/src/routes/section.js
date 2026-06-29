import express from "express";
import {
  getSectionsByCourse,
  createSection,
  reorderSections,
  updateSection,
  deleteSection
} from "../controllers/sectionController.js";

import authMiddleware from "../middleware/authMiddelware.js";
import authorizeRoles from "../middleware/rolemiddleware.js";
import checkSubscription from "../middleware/checkSubscription.js";

const router = express.Router();

// 👑 Admin Configuration Panel Workspace Hook
// Handles: GET /api/v1/sections?courseId=...
router.get("/", authMiddleware, authorizeRoles("ADMIN"), getSectionsByCourse);

// 🔒 Protected Student/Admin Curriculum View (Subscription Checked)
// Handles: GET /api/v1/sections/course/:courseId
router.get("/course/:courseId", authMiddleware, checkSubscription, getSectionsByCourse);

// 🛠️ Admin-Only Management Paths
router.post("/", authMiddleware, authorizeRoles("ADMIN"), createSection);
router.post("/reorder", authMiddleware, authorizeRoles("ADMIN"), reorderSections);

// 💡 Updated parameter from :sectionId to :id to match your controller syntax fallback flawlessly
router.put("/:id", authMiddleware, authorizeRoles("ADMIN"), updateSection);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN"), deleteSection);

export default router;