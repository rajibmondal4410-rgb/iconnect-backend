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
      type: String,
      required: true,
      trim: true,
    },

    // 3. Category (for filtering)
    category: {
      type: String,
      required: true,
      enum: [
        "Plumber",
        "Electrician",
        "Carpenter",
        "Tutor",        // ← ADDED THIS
        "Cleaner",
        "Painter",
        "Other"
      ],
    },

    // 4. Description
    description: {
      type: String,
      required: true,
    },

    // 5. Cost
    price: {
      type: Number,
      required: true,
    },

    // 6. Location (City) - OPTIONAL
    location: {
      type: String,
      required: false,  // ← CHANGED FROM true TO false
    },

    // 7. Service Image (Optional)
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);