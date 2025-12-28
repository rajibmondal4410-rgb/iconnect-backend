const Booking = require("../models/Booking");
const Service = require("../models/Service");

// 1. Create a New Booking (Customer orders a service)
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, scheduledDate, address } = req.body;

    console.log("📅 Creating booking...");
    console.log("Service ID:", serviceId);
    console.log("Customer ID:", req.user._id);

    // A. Find the service details to know who the Provider is
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    console.log("✅ Service found:", service.title);
    console.log("👷 Provider ID:", service.provider);

    // B. Create the Booking
    const newBooking = await Booking.create({
      customer: req.user._id, // Logged-in user is the customer
      provider: service.provider, // The worker who owns the service
      service: serviceId,
      scheduledDate,
      address,
      status: "pending",
    });

    console.log("✅ Booking created successfully:", newBooking._id);

    res.status(201).json({
      message: "Booking request sent successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// 2. Get My Bookings (Customer sees their history)
exports.getMyBookings = async (req, res) => {
  try {
    console.log("🔍 Fetching bookings for customer:", req.user._id);

    // Find bookings where I am the customer OR the provider
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate("service", "title price category") // Show service details
      .populate("customer", "name email") // Show customer details
      .populate("provider", "name email phone") // Show worker details
      .sort({ createdAt: -1 }); // Newest first

    console.log(`✅ Found ${bookings.length} bookings`);

    res.json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// 3. Get Worker Bookings (Worker sees incoming job requests)
exports.getWorkerBookings = async (req, res) => {
  try {
    console.log("🔍 Fetching bookings for worker:", req.user._id);

    // Find bookings where I am the PROVIDER (service owner)
    const bookings = await Booking.find({
      provider: req.user._id,
    })
      .populate("service", "title price category") // Show service details
      .populate("customer", "name email phone") // Show customer details
      .sort({ createdAt: -1 }); // Newest first

    console.log(`✅ Found ${bookings.length} worker bookings`);

    res.json(bookings);
  } catch (error) {
    console.error("❌ Error fetching worker bookings:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// 4. Update Booking Status (Accept, Reject, Complete)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // e.g., "accepted", "completed", "cancelled"

    console.log("🔄 Updating booking status to:", status);

    // Find the booking by ID (passed in the URL)
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ Booking found");

    // Security Check: strictly ensuring only the relevant people can change status
    // (In a real app, we check if req.user.id matches provider or customer)
    const isProvider = booking.provider.toString() === req.user._id.toString();
    const isCustomer = booking.customer.toString() === req.user._id.toString();

    if (!isProvider && !isCustomer) {
      return res.status(403).json({
        message: "You are not authorized to update this booking",
      });
    }

    booking.status = status;
    await booking.save();

    console.log("✅ Booking status updated");

    res.json({
      message: `Booking updated to ${status}`,
      booking,
    });
  } catch (error) {
    console.error("❌ Error updating booking:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};