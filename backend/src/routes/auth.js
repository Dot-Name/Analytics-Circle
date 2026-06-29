import express from "express";
import {
  sendOTP,
  verifyOTP,
  googleLogin,
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google", googleLogin);
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


export default router;