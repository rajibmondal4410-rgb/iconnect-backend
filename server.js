require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // Changed!

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// CRITICAL: Load models BEFORE routes
console.log("📦 Loading models...");
require("./models/user");
require("./models/Service");
require("./models/Booking");
console.log("✅ Models loaded!");

// Connect to MongoDB directly (no separate db.js file)
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// 1. Basic Test Route
app.get("/", (req, res) => {
  res.send("ICONNECT Backend is running...");
});

// --- ROUTES ---

// 2. Auth Routes
const authRoutes = require("./routes/authRoutes.js");
app.use("/api/auth", authRoutes);

// 3. Service Routes
const serviceRoutes = require("./routes/serviceRoutes.js");
app.use("/api/services", serviceRoutes);

// 4. Booking Routes
const bookingRoutes = require("./routes/bookingRoutes.js");
app.use("/api/bookings", bookingRoutes);

// 5. Review Routes
const reviewRoutes = require("./routes/reviewRoutes.js");
app.use("/api/reviews", reviewRoutes);

// 6. Admin Routes
const adminRoutes = require("./routes/adminRoutes.js");
app.use("/api/admin", adminRoutes);

// Test route
app.post("/test-direct", (req, res) => {
  res.send("DIRECT SERVER POST IS WORKING");
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});