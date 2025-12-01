const express = require("express");
const router = express.Router();
const { createReview, getReviewsByProvider } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// 1. Add a Review (Protected - Must be logged in)
router.post("/", protect, createReview);

// 2. Get Reviews for a Provider (Public - Anyone can see)
router.get("/provider/:providerId", getReviewsByProvider);

module.exports = router;