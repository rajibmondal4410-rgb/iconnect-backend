const express = require("express");
const router = express.Router();
// Import the new function here 👇
const { createBooking, getMyBookings, updateBookingStatus } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.get("/", protect, getMyBookings);

// NEW: Route to update status (requires ID)
router.put("/:id", protect, updateBookingStatus);

module.exports = router; 
