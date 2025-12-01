const Service = require("../models/Service");

// 1. Create a New Service (Worker posts a job)
exports.createService = async (req, res) => {
  try {
    const { title, category, description, price, location } = req.body;

    // We get the 'provider' ID automatically from the logged-in user (req.user.id)
    // This works because we will use the 'protect' middleware!
    const newService = await Service.create({
      provider: req.user.id,
      title,
      category,
      description,
      price,
      location,
    });

    res.status(201).json({
      message: "Service created successfully",
      service: newService,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. Get All Services (With Smart Search & Filters)
exports.getAllServices = async (req, res) => {
  try {
    // A. Get values from the URL (?category=Plumbing&search=AC&location=Kolkata)
    const { category, location, search } = req.query;

    // B. Build a "Filter Object" dynamically
    let filter = {};

    // If category is selected, add it to filter
    if (category) {
      filter.category = category;
    }

    // If location is typed, search for it (Case Insensitive)
    // "kolkata", "Kolkata", "KOLKATA" -> all work
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // If search keyword is typed, look in Title OR Description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // C. Find services matching the filter
    const services = await Service.find(filter).populate("provider", "name email");

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};