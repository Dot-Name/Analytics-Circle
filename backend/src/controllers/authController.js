import User from "../models/User.js";
import Otp from "../models/Otp.js";
import otpGenerator from "otp-generator";
import { sendOtpEmail } from "../services/emailService.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import Session from "../models/Session.js";
import { hashToken } from "../utils/hashToken.js";

// Via Password Signup: POST /api/v1/auth/signup
export const signup = async (req, res) => {
  try {
    const { fullName, email, phone, age, password, deviceId } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "Device ID is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Existing user check
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 🔄 FIX: Create user with complete, secure profile structure default initialization layers
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      phone,
      age,
      password: hashedPassword,
      isVerified: true,
      role: "STUDENT",
      status: "ACTIVE",
      enrolledCourses: [],
      profile: {
        bio: "",
        headline: "",
        location: { city: "", country: "" },
        socials: { linkedin: "", github: "", twitter: "", website: "" }
      },
      authProviders: {
        password: true,
        otp: false,
        google: false
      },
    });

    // Generate Tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
    });

    // Store Refresh Token Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      accessToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create account",
    });
  }
};

// Via Password Login route: POST /api/v1/auth/login
export const login = async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: "Device ID is required",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if password login is enabled
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account does not have a password. Use OTP or Google Login.",
      });
    }

    // Compare Password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate Tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
    });

    const sessions = await Session.find({ user: user._id }).sort({ createdAt: 1 });

    if (sessions.length >= 2) {
      await Session.findByIdAndDelete(sessions[0]._id);
    }

    const tokenHash = hashToken(refreshToken);

    await Session.deleteOne({ user: user._id, deviceId });

    await Session.create({
      user: user._id,
      tokenHash,
      deviceId,
      deviceName: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    // Set Refresh Token Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/**
 * POST /api/v1/auth/send-otp
 */
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Generate 6 digit OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const normalizedEmail = email.trim().toLowerCase();
    
    // Remove old OTP if exists
    await Otp.deleteMany({ email: normalizedEmail });

    // Save OTP
    await Otp.create({
      email: normalizedEmail,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 mins
    });

    try {
      await sendOtpEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error("Email Error:", emailError);
      await Otp.deleteMany({ email: normalizedEmail });
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

/**
 * POST /api/v1/auth/verify-otp
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, deviceId } = req.body;

    if (!email || !otp || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and Device ID are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpRecord = await Otp.findOne({ email: normalizedEmail });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Find user
    let user = await User.findOne({ email: normalizedEmail });

    // 🔄 FIX: Create user with complete, nested profile defaults if they don't exist
    if (!user) {
      user = await User.create({
        email: normalizedEmail,
        isVerified: true,
        role: "STUDENT",
        status: "ACTIVE",
        enrolledCourses: [],
        profile: {
          bio: "",
          headline: "",
          location: { city: "", country: "" },
          socials: { linkedin: "", github: "", twitter: "", website: "" }
        },
        authProviders: {
          password: false,
          otp: true,
          google: false
        }
      });
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Generate Tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
    });

    const sessions = await Session.find({ user: user._id }).sort({ createdAt: 1 });

    if (sessions.length >= 2) {
      await Session.findByIdAndDelete(sessions[0]._id);
    }

    await Session.deleteOne({ user: user._id, deviceId });

    await Session.create({
      user: user._id,
      tokenHash: hashToken(refreshToken),
      deviceId,
      deviceName: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    // Remove OTP after successful verification
    await Otp.deleteMany({ email: normalizedEmail });

    // Store Refresh Token in Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

/**
 * POST /api/v1/auth/google
 */
export const googleLogin = async (req, res) => {
  try {
    // To be implemented using google-auth-library
    return res.status(200).json({
      success: true,
      message: "Google login endpoint",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const session = await Session.findOne({
      tokenHash: hashToken(refreshToken),
    });

    if (session) {
      session.lastSeen = new Date();
      await session.save();
    }

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await Session.deleteOne({
        tokenHash: hashToken(refreshToken),
      });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await Otp.deleteMany({ email: normalizedEmail });

    await Otp.create({
      email: normalizedEmail,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOtpEmail(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send reset OTP",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find OTP
    const otpRecord = await Otp.findOne({ email: normalizedEmail });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // Check expiry
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    user.password = hashedPassword;
    
    // Explicitly update dynamic auth provider tracker tag state safely
    user.set("authProviders.password", true);

    await user.save();

    // Delete used OTP
    await Otp.deleteMany({ email: normalizedEmail });

    // Logout from all devices
    await Session.deleteMany({ user: user._id });

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login again.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};