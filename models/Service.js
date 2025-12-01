const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    // 1. Who is providing this service? (Link to User)
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 2. What is the service?
    title: {
      type: String, // e.g., "Expert Plumber"
      required: true,
      trim: true,
    },

    // 3. Category (for filtering)
    category: {
      type: String, // e.g., "Plumbing", "Electrical", "Teaching"
      required: true,
      enum: ["Plumbing", "Electrical", "Cleaning", "Teaching", "Beauty", "Repair", "Other"], 
    },

    // 4. Details
    description: {
      type: String,
      required: true,
    },

    // 5. Cost
    price: {
      type: Number,
      required: true,
    },

    // 6. Location (City)
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt time
  }
);

module.exports = mongoose.model("Service", serviceSchema);