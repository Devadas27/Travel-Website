const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if authorization header exists and starts with Bearer
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];

        // Verify token (uses secret from .env or fallback)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret_key");

        req.user = decoded; // Attach user id to request object
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || "your_jwt_secret_key", {
        expiresIn: "7d", // Token valid for 7 days
    });
};

module.exports = { authMiddleware, generateToken };