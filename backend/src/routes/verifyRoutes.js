import express from "express";
import { verifyCertificatePublicly } from "../controllers/verificationController.js";

const router = express.Router();

// Public route to lookup a certificate by serial number
router.get("/verify/:serialNumber", verifyCertificatePublicly);

export default router;