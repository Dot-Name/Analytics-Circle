import express from "express";
import {
  getPresignedUploadUrl,
  createSectionResource,
  deleteSectionResource,
} from "../controllers/storageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All resource upload modifications are protected for Admin use
router.use(authMiddleware, authorizeRoles("ADMIN"));

router.post("/presigned-url", getPresignedUploadUrl);
router.post("/resources", createSectionResource);
router.delete("/resources/:resourceId", deleteSectionResource);

export default router;