const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const TouristPlace = require("../Models/TouristPlaceModel");

// 1. Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configure Multer Storage for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Unique filename: place-timestamp-random.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "place-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPG, JPEG, PNG, and WEBP image formats are supported"));
  },
});

// ==========================================
// CRUD API ENDPOINTS
// ==========================================

// 1. GET ALL TOURIST PLACES (Home page & Admin Table)
// Endpoint: GET /api/tourist-places
router.get("/", async (req, res) => {
  try {
    const places = await TouristPlace.find().sort({ createdAt: -1 });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET A SINGLE TOURIST PLACE BY ID
// Endpoint: GET /api/tourist-places/:id
router.get("/:id", async (req, res) => {
  try {
    const place = await TouristPlace.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Tourist place not found" });
    }
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. CREATE NEW TOURIST PLACE (With Image Upload)
// Endpoint: POST /api/tourist-places
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, location, category, duration, price, description, status } =
      req.body;

    // Image path setting: local file or default
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image && typeof req.body.image === "string") {
      imagePath = req.body.image;
    }

    const newPlace = new TouristPlace({
      name,
      location,
      category,
      duration,
      price: Number(price),
      description,
      status: status || "Active",
      image: imagePath,
    });

    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. UPDATE TOURIST PLACE (Optional New Image)
// Endpoint: PUT /api/tourist-places/:id
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }

    // New image upload cheythittundengil path update cheyyuka
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedPlace = await TouristPlace.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: "Tourist place not found" });
    }

    res.status(200).json(updatedPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. DELETE TOURIST PLACE
// Endpoint: DELETE /api/tourist-places/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedPlace = await TouristPlace.findByIdAndDelete(req.params.id);

    if (!deletedPlace) {
      return res.status(404).json({ message: "Tourist place not found" });
    }

    res.status(200).json({ message: "Tourist place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;