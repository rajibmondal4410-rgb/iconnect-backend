const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // 1. Who is writing the review? (Customer)
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 2. Who is being rated? (Worker)
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 3. Which service is this for? (Optional but good)
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    // 4. Star Rating (1 to 5)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // 5. Written Comment
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);