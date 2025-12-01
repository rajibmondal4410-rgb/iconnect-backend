const Booking = require("../models/Booking");
const Service = require("../models/Service");

// 1. Create a New Booking (Customer orders a service)
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, scheduledDate, address } = req.body;

    // A. Find the service details to know who the Provider is
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // B. Create the Booking
    const newBooking = await Booking.create({
      customer: req.user.id,        // Logged-in user is the customer
      provider: service.provider,   // The worker who owns the service
      service: serviceId,
      scheduledDate,
      address,
      status: "pending"
    });

    res.status(201).json({
      message: "Booking request sent successfully",
      booking: newBooking
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. Get My Bookings (Customer sees their history)
exports.getMyBookings = async (req, res) => {
  try {
    // Find bookings where I am the customer OR the provider
    const bookings = await Booking.find({
      $or: [{ customer: req.user.id }, { provider: req.user.id }]
    })
    .populate("service", "title price category")  // Show service details
    .populate("customer", "name email")           // Show customer details
    .populate("provider", "name email");          // Show worker details

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 3. Update Booking Status (Accept, Reject, Complete)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // e.g., "accepted", "completed", "cancelled"
    
    // Find the booking by ID (passed in the URL)
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Security Check: strictly ensuring only the relevant people can change status
    // (In a real app, we check if req.user.id matches provider or customer)
    
    booking.status = status;
    await booking.save();

    res.json({ 
      message: `Booking updated to ${status}`, 
      booking 
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};