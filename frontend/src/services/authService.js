import API from "../api/axiosInstance.js";

/**
 * 1. SIGNUP REQUEST
 * POST /api/v1/auth/signup
 */
export const registerUser = async ({ fullName, email, phone, age, password, deviceId }) => {
  // ✅ Fixed: Changed from "/signup" to "/auth/signup"
  const response = await API.post("/auth/signup", {
    fullName,
    email,
    phone,
    age: Number(age), 
    password,
    deviceId, 
  });
  return response.data; 
};

/**
 * 2. LOGIN REQUEST
 * POST /api/v1/auth/login
 */
export const loginUser = async ({ email, password, deviceId }) => {
  // ✅ Fixed: Changed from "/login" to "/auth/login"
  const response = await API.post("/auth/login", {
    email,
    password,
    deviceId,
  });
  return response.data;
};

/**
 * 3. SEND OTP REQUEST
 * POST /api/v1/auth/send-otp
 */
export const sendOTP = async (email) => {
  // ✅ Fixed: Changed from "/send-otp" to "/auth/send-otp"
  const response = await API.post("/auth/send-otp", { email });
  return response.data;
};

/**
 * 4. VERIFY OTP REQUEST
 * POST /api/v1/auth/verify-otp
 */
export const verifyOTP = async ({ email, otp, deviceId }) => {
  // ✅ Fixed: Changed from "/verify-otp" to "/auth/verify-otp"
  const response = await API.post("/auth/verify-otp", {
    email,
    otp,
    deviceId
  });
  return response.data;
};

/**
 * 5. FORGOT PASSWORD REQUEST
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (email) => {
  // ✅ Fixed: Changed from "/forgot-password" to "/auth/forgot-password"
  const response = await API.post("/auth/forgot-password", { email });
  return response.data;
};

/**
 * 6. RESET PASSWORD REQUEST
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = async ({ email, otp, newPassword }) => {
  // ✅ Fixed: Changed from "/reset-password" to "/auth/reset-password"
  const response = await API.post("/auth/reset-password", {
    email,
    otp,
    newPassword
  });
  return response.data;
};

/**
 * 7. REFRESH TOKEN ACCESS
 * POST /api/v1/auth/refresh
 */
export const refreshAccessToken = async () => {
  // ✅ Fixed: Changed from "/refresh" to "/auth/refresh"
  const response = await API.post("/auth/refresh");
  return response.data;
};

/**
 * 8. LOGOUT REQUEST
 * POST /api/v1/auth/logout
 */
export const logoutUser = async () => {
  // ✅ Fixed: Changed from "/logout" to "/auth/logout"
  const response = await API.post("/auth/logout");
  return response.data;
};