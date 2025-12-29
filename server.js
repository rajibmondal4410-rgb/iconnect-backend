require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 1. FIRST: Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    
    // 2. SECOND: Load models AFTER MongoDB connects
    console.log("📦 Loading models...");
    require("./models/user");
    require("./models/Service");
    require("./models/Booking");
    console.log("✅ Models loaded!");
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

// 3. THIRD: Routes (after models are loaded)
app.get("/", (req, res) => {
  res.send("ICONNECT Backend is running...");
});

// Auth Routes
const authRoutes = require("./routes/authRoutes.js");
app.use("/api/auth", authRoutes);

// Service Routes
const serviceRoutes = require("./routes/serviceRoutes.js");
app.use("/api/services", serviceRoutes);

// Booking Routes
const bookingRoutes = require("./routes/bookingRoutes.js");
app.use("/api/bookings", bookingRoutes);

// Review Routes
const reviewRoutes = require("./routes/reviewRoutes.js");
app.use("/api/reviews", reviewRoutes);

// Admin Routes
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