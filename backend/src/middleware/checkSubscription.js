import User from "../models/User.js";

/**
 * Hardened multi-layer security guard gatekeeper middleware.
 * Validates account status, active course enrollment presence, and 1-year timeline lifecycles.
 */
const checkSubscription = async (req, res, next) => {
  try {
    // 1. Resolve course context dynamically from path parameter segments or the request body
    const courseId = req.params.courseId || req.body.courseId;
    
    // Resolve user identity attached by your auth authentication middleware
    const userId = req.userId || (req.user && req.user.id) || (req.user && req.user._id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: Unresolved user security identity context."
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Targeting Error: Missing required course identifier parameter boundaries."
      });
    }

    // 2. Fetch the target user profile from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Access Denied: Student profile record could not be found."
      });
    }

    // =========================================================================
    // 🛑 GATE 1: GLOBAL STATUS SUSPENSION CHECK
    // =========================================================================
    if (user.status === "BLOCKED") {
      return res.status(403).json({
        success: false,
        message: "Access Suspended: Your student profile has been administratively blocked. Please contact support."
      });
    }

    // =========================================================================
    // 🛑 GATE 2: ENROLLMENT SUBSCRIPTION EXISTENCE CHECK
    // =========================================================================
    const enrollment = user.enrolledCourses.find(
      (item) => item.courseId.toString() === courseId.toString()
    );

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: You are not enrolled in this course or your payment record was not found."
      });
    }

    // =========================================================================
    // 🛑 GATE 3: 1-YEAR TIME EXPIRATION CHECK
    // =========================================================================
    const currentTime = new Date();
    const expirationTime = new Date(enrollment.expiresAt);

    if (currentTime > expirationTime) {
      return res.status(403).json({
        success: false,
        isExpired: true,
        message: "Access Expired: Your 1-year course access period has ended. Please purchase the course again to regain access."
      });
    }

    // ✅ ALL GATES CLEARED: Forward request execution context safely to the controller layer
    next();

  } catch (error) {
    console.error("Subscription Validation Middleware Exception:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error executing security subscription verifications."
    });
  }
};

export default checkSubscription;