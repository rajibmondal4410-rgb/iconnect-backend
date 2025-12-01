const express = require("express");
const router = express.Router();
// Ensure updateProfile is included here
const { registerUser, loginUser, updateProfile } = require("../controllers/authController"); 
const { protect } = require("../middleware/authMiddleware");

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

router.put("/profile", protect, updateProfile);

module.exports = router;