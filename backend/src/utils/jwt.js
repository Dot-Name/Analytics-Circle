import jwt from "jsonwebtoken";

/**
 * Generate Access Token
 * Expiry: 15 minutes
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );
};
 
/**
 * Generate Refresh Token
 * Expiry: 30 days
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.REFRESH_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.REFRESH_SECRET
  );
};