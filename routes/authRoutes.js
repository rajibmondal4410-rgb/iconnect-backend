const express = require("express");
const router = express.Router();

// 1. Import register, login, AND updateProfile
const { registerUser, loginUser, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware"); 

console.log("🔥 AUTH ROUTES LOADED 🔥");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔒 Protected Route (Get User Profile)
router.get("/me", protect, (req, res) => {
  res.json({
    message: "You are accessing a protected route!",
    user: req.user,
  });
});

// 🔒 Update Profile Route (Change Name, Phone, Password)
router.put("/profile", protect, updateProfile);

module.exports = router;