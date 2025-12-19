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
      provider: req.user._id,
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

// 2. Get All Services (With Smart Search & Filters) - FIXED VERSION
exports.getAllServices = async (req, res) => {
  try {
    const { category, location, search, sort } = req.query;

    console.log("🔍 Fetching all services...");
    console.log("Query params:", { category, location, search, sort });

    // Build filter object
    let filter = {};

    if (category) {
      filter.category = category;
      console.log("📂 Filtering by category:", category);
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
      console.log("📍 Filtering by location:", location);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
      console.log("🔎 Searching for:", search);
    }

    console.log("🔍 Applied filter:", JSON.stringify(filter));

    // Find services
    let services;
    
    try {
      // Try to populate provider info
      let query = Service.find(filter);

      // Apply sorting
      if (sort === "price_low") {
        query = query.sort({ price: 1 });
        console.log("💰 Sorting: Price Low to High");
      } else if (sort === "price_high") {
        query = query.sort({ price: -1 });
        console.log("💰 Sorting: Price High to Low");
      } else {
        query = query.sort({ createdAt: -1 });
        console.log("🕐 Sorting: Newest First");
      }

      // Populate provider information
      query = query.populate("provider", "name email phone");

      services = await query;

      console.log(`✅ Successfully fetched ${services.length} services`);

    } catch (populateError) {
      console.log("⚠️ Populate failed, fetching without provider info");
      console.error("Populate error:", populateError.message);
      
      // Fallback: Fetch without populate
      let query = Service.find(filter);

      if (sort === "price_low") {
        query = query.sort({ price: 1 });
      } else if (sort === "price_high") {
        query = query.sort({ price: -1 });
      } else {
        query = query.sort({ createdAt: -1 });
      }

      services = await query;
      
      console.log(`✅ Fetched ${services.length} services (without provider info)`);
    }

    res.status(200).json(services);

  } catch (error) {
    console.error("❌ Critical error fetching services:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
      hint: "Check backend logs for details"
    });
  }
};

// 3. Get Single Service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Fetching service with ID:", id);

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid service ID format"
      });
    }

    const service = await Service.findById(id).populate(
      "provider",
      "name email phone"
    );

    if (!service) {
      console.log("❌ Service not found");
      return res.status(404).json({
        message: "Service not found"
      });
    }

    console.log("✅ Service found:", service.title);

    res.status(200).json(service);

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
    if (location !== undefined) service.location = location;

    await service.save();

    console.log("✅ Service updated successfully");

    res.status(200).json({
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

    res.status(200).json({
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

    console.log(`✅ Found ${services.length} services for this user`);

    res.status(200).json(services);

  } catch (error) {
    console.error("❌ Error fetching user services:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};