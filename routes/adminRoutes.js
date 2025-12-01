const express = require("express");
const router = express.Router();
const { getAllUsers, deleteUser, getDashboardStats } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// All routes here need Login (protect) AND Admin Role (admin)
router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);
router.get("/stats", protect, admin, getDashboardStats);

module.exports = router;