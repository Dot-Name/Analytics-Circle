// routes/userRoutes.js
import express from "express";
import { updateProfileInfo } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddelware.js";

const router = express.Router();

// Both routes can use the exact same controller since it handles empty bodies perfectly!
router.get("/profile", authMiddleware, updateProfileInfo); 
router.put("/profile", authMiddleware, updateProfileInfo);

export default router;