const express = require("express");
const router = express.Router();
const { createService, getAllServices, getServiceById, updateService, deleteService, getMyServices } = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");

// 1. Create Service (Only Logged-in users can do this)
// We add 'protect' as a security guard here
router.post("/", protect, createService);

// 2. Get All Services (Public - anyone can see)
router.get("/", getAllServices);

// 3. Get Single Service by ID (Public)
router.get("/:id", getServiceById);

// 4. Update Service (Only owner can update)
router.put("/:id", protect, updateService);

// 5. Delete Service (Only owner can delete)
router.delete("/:id", protect, deleteService);

// 6. Get My Services (Worker's own services)
router.get("/my/services", protect, getMyServices);

module.exports = router;