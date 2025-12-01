const User = require("../models/user");
const Booking = require("../models/Booking");

// 1. Get All Users (See who is on your platform)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Don't show passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. Delete a User (Ban bad people)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 3. Get All Stats (Optional - Total Bookings count)
exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    res.json({
      totalUsers: userCount,
      totalBookings: bookingCount
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};