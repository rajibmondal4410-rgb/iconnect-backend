const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // 1. Who is the customer?
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 2. Who is the Provider? (The Worker)
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 3. Which Service was booked?
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    // 4. Current Status of the Job
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending", // Starts as pending until worker accepts
    },

    // 5. When is the job scheduled for?
    scheduledDate: {
      type: Date,
      required: true,
    },

    // 6. Address for the service
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);