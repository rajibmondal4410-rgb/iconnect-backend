const Review = require("../models/Review");

// 1. Write a Review
exports.createReview = async (req, res) => {
  try {
    const { providerId, serviceId, rating, comment } = req.body;

    // Security: You cannot review yourself
    if (providerId === req.user.id) {
      return res.status(400).json({ message: "You cannot review yourself!" });
    }

    // Create the Review
    const newReview = await Review.create({
      customer: req.user.id, // Logged in user
      provider: providerId,
      service: serviceId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. Get Reviews for a Provider (Public)
// Example URL: GET /api/reviews/provider/USER_ID_HERE
exports.getReviewsByProvider = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate("customer", "name") // Show customer name
      .populate("service", "title"); // Show service name

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};