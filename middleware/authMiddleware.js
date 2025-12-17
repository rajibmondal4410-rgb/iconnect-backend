const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Function
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if authorization header exists and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If no token found
    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({
        message: "Not authorized, no token provided"
      });
    }

    console.log("🔑 Token received, verifying...");

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY_123");

    console.log("✅ Token verified for user ID:", decoded.id);

    // Get user from token (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      console.log("❌ User not found");
      return res.status(401).json({
        message: "User not found"
      });
    }

    console.log("✅ User authenticated:", req.user.email);

    next();

  } catch (error) {
    console.error("❌ Token verification failed:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token"
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired, please login again"
      });
    }

    res.status(401).json({
      message: "Not authorized, token failed"
    });
  }
};

// 🛡️ NEW: Admin Guard
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    console.log("✅ Admin access granted");
    next();
  } else {
    console.log("❌ Admin access denied");
    res.status(403).json({
      message: "Not authorized as an admin"
    });
  }
};

module.exports = { protect, admin };