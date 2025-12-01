const express = require("express");
const router = express.Router();
const { createService, getAllServices } = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

// 1. Create Service (Only Logged-in users can do this)
// We add 'protect' as a security guard here
router.post("/", protect, createService);

// 2. Get All Services (Public - anyone can see)
router.get("/", getAllServices);

module.exports = router;