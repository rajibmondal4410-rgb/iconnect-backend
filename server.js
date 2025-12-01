require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db2.js"); // Using db2.js as per your setup

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 1. Basic Test Route (GET)
app.get("/", (req, res) => {
  res.send("ICONNECT Backend is running...");
});

// Connect Database
connectDB();

// --- ROUTES ---

// 2. Auth Routes (Register, Login, User Profile)
const authRoutes = require("./routes/authRoutes.js");
app.use("/api/auth", authRoutes);

// 3. Service Routes (Create Service, Get All Services)
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

// 6. Direct Test Route (POST) - Kept for testing if needed
app.post("/test-direct", (req, res) => {
  res.send("DIRECT SERVER POST IS WORKING");
});

// Start Server on Port 5001
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});