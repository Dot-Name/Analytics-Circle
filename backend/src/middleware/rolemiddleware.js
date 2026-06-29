import { verifyAccessToken } from "../utils/jwt.js";

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // 1. Check the fresh database user attached by authMiddleware
            if (req.user && allowedRoles.includes(req.user.role)) {
                return next();
            }

            // 2. Fallback: Double check the token directly from the authorization header
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1];
                const decoded = verifyAccessToken(token);
                
                if (decoded && allowedRoles.includes(decoded.role)) {
                    return next();
                }
            }

            // 3. If neither matches, reject the request
            return res.status(403).json({
                success: false,
                message: `Forbidden: Access denied. This endpoint requires one of these roles: [${allowedRoles.join(", ")}]`
            });
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized token verification breakdown."
            });
        }
    };
};

export default authorizeRoles;