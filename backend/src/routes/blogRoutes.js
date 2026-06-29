import express from "express";
import multer from "multer";
import { createBlog, updateBlog, deleteBlog, getAllBlogs, getBlogBySlug } from "../controllers/blogController.js";
import authMiddleware from "../middleware/authMiddelware.js";

// Configure Multer to intercept image file streams in memory buffers
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Public Retrieval Routes
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);

// Admin Management Routes - Supporting Image Uploads via coverImage field
router.post("/", authMiddleware, upload.single("coverImage"), createBlog);
router.put("/:id", authMiddleware, upload.single("coverImage"), updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);

export default router;