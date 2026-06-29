import express from "express";
import multer from "multer";
import { 
  getLecturesBySection, // 💡 Updated to explicitly read query filters (sectionId)
  getLectureById, 
  createLecture, 
  updateLecture, 
  deleteLecture 
} from "../controllers/lectureController.js";

const router = express.Router();

// Configure Multer to store memory buffers temporarily before streaming to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } 
});

// ==========================================
// 🛠️ CURRICULUM MANAGEMENT ROUTES LAYER
// ==========================================

// Fetch filtered section matrices & spin up fresh lectures with binary file intercepts
router.route("/")
  .get(getLecturesBySection) // ◄─ Frontend relies on this to fetch lectures by sectionId query parameters
  .post(upload.single("zipResource"), createLecture); 

// Dynamic single-entity tracking updates & deletions
router.route("/:id")
  .get(getLectureById)
  .put(upload.single("zipResource"), updateLecture)   
  .delete(deleteLecture);

export default router;