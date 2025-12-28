const express = require("express");
const router = express.Router();

// Import the new functions here
const {
  createBooking,
  getMyBookings,
  getWorkerBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

// Create a booking (Customer books a service)
router.post("/", protect, createBooking);

// Get customer's bookings (shows bookings made by the logged-in customer)
router.get("/my-bookings", protect, getMyBookings);

// Get worker's bookings (shows bookings for services provided by the worker)
router.get("/worker-bookings", protect, getWorkerBookings);

// Update booking status (Worker accepts/rejects, or marks completed)
router.put("/:id", protect, updateBookingStatus);

module.exports = router;