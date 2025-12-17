const Service = require("../models/Service");

// 1. Create a New Service (Worker posts a job)
exports.createService = async (req, res) => {
  try {
    const { title, category, description, price, location } = req.body;

    // Validate required fields
    if (!title || !category || !description || !price) {
      return res.status(400).json({
        message: "Please provide all required fields: title, category, description, price"
      });
    }

    // Validate price is a positive number
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        message: "Price must be a positive number"
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "User not authenticated. Please login again."
      });
    }

    console.log("✅ Creating service for user:", req.user._id);

    // Create new service
    const newService = await Service.create({
      provider: req.user._id,  // FIXED: Using _id instead of id
      title: title.trim(),
      category,
      description: description.trim(),
      price: Number(price),
      location: location || "",
    });

    console.log("✅ Service created successfully:", newService._id);

    res.status(201).json({
      message: "Service created successfully",
      service: newService,
    });

  } catch (error) {
    console.error("❌ Error creating service:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

// 2. Get All Services (With Smart Search & Filters)
exports.getAllServices = async (req, res) => {
  try {
    // A. Get values from URL (?category=Plumber&search=ABC&location=Kolkata)
    const { category, location, search, sort } = req.query;

    // B. Build a "filter" object dynamically
    let filter = {};

    // C. If category is selected, add it to filter
    if (category) {
      filter.category = category;
    }

    // D. If location is typed, search for it (Case Insensitive)
    // "kolkata", "Kolkata", "KOLKATA" -> all work
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // E. If search keyword is typed, look in Title OR Description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    console.log("🔍 Fetching services with filter:", filter);

    // F. Find services matching the filter
    let query = Service.find(filter).populate("provider", "name email phone");

    // G. Sorting (optional)
    if (sort === "price_low") {
      query = query.sort({ price: 1 }); // Ascending
    } else if (sort === "price_high") {
      query = query.sort({ price: -1 }); // Descending
    } else {
      query = query.sort({ createdAt: -1 }); // Newest first (default)
    }

    const services = await query;

    console.log(`✅ Found ${services.length} services`);

    res.json(services);

  } catch (error) {
    console.error("❌ Error fetching services:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

// 3. Get Single Service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Fetching service with ID:", id);

    const service = await Service.findById(id).populate(
      "provider",
      "name email phone"
    );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    console.log("✅ Service found:", service.title);

    res.json(service);

  } catch (error) {
    console.error("❌ Error fetching service:", error);
    
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        message: "Invalid service ID"
      });
    }

    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

// 4. Update Service (Only owner can update)
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, price, location } = req.body;

    console.log("🔄 Updating service:", id);

    // Find the service
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    // Check if user is the owner
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this service"
      });
    }

    // Update fields if provided
    if (title) service.title = title.trim();
    if (category) service.category = category;
    if (description) service.description = description.trim();
    if (price) service.price = Number(price);
    if (location) service.location = location;

    await service.save();

    console.log("✅ Service updated successfully");

    res.json({
      message: "Service updated successfully",
      service
    });

  } catch (error) {
    console.error("❌ Error updating service:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

// 5. Delete Service (Only owner can delete)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑️ Deleting service:", id);

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    // Check if user is the owner
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this service"
      });
    }

    await Service.findByIdAndDelete(id);

    console.log("✅ Service deleted successfully");

    res.json({
      message: "Service deleted successfully"
    });

  } catch (error) {
    console.error("❌ Error deleting service:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

// 6. Get Services by Provider (Worker's own services)
exports.getMyServices = async (req, res) => {
  try {
    console.log("🔍 Fetching services for user:", req.user._id);

    const services = await Service.find({ provider: req.user._id }).sort({
      createdAt: -1
    });

    console.log(`✅ Found ${services.length} services`);

    res.json(services);

  } catch (error) {
    console.error("❌ Error fetching user services:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};