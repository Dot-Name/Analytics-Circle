export const adminMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Admin check failed",
    });
  }
};