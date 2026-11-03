const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const TouristPackage = require("../Models/TouristPackageModel");

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
    // Unique filename: package-timestamp-random.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "package-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPG, JPEG, PNG, and WEBP image formats are supported"));
  },
});

// ==========================================
// CRUD API ENDPOINTS FOR TOURIST PACKAGES
// ==========================================

// 1. GET ALL PACKAGES (Admin Table & Home Featured Tours)
// Endpoint: GET /api/tourist-packages
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.isFeatured) {
      filter.isFeatured = req.query.isFeatured === "true";
    }

    const packages = await TouristPackage.find(filter).sort({ createdAt: -1 });
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET SINGLE PACKAGE BY ID (View Modal / Details Page)
// Endpoint: GET /api/tourist-packages/:id
router.get("/:id", async (req, res) => {
  try {
    const singlePackage = await TouristPackage.findById(req.params.id);
    if (!singlePackage) {
      return res.status(404).json({ message: "Tourist package not found" });
    }
    res.status(200).json(singlePackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. CREATE NEW TOURIST PACKAGE (With Image Upload)
// Endpoint: POST /api/tourist-packages
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      destination,
      category,
      duration,
      price,
      discountPrice,
      groupSize,
      description,
      status,
      isFeatured,
    } = req.body;

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image && typeof req.body.image === "string") {
      imagePath = req.body.image;
    }

    const newPackage = new TouristPackage({
      title,
      destination,
      category: category || "Family",
      duration,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      groupSize: groupSize || "1-10 Persons",
      description: description || "",
      status: status || "Active",
      isFeatured: isFeatured === "true" || isFeatured === true,
      image: imagePath,
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. UPDATE TOURIST PACKAGE (Optional New Image)
// Endpoint: PUT /api/tourist-packages/:id
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.discountPrice !== undefined) {
      updateData.discountPrice = Number(updateData.discountPrice);
    }
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured =
        updateData.isFeatured === "true" || updateData.isFeatured === true;
    }

    // New image file upload cheythittundengil path update cheyyuka
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedPackage = await TouristPackage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: "Tourist package not found" });
    }

    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. DELETE TOURIST PACKAGE
// Endpoint: DELETE /api/tourist-packages/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedPackage = await TouristPackage.findByIdAndDelete(
      req.params.id
    );

    if (!deletedPackage) {
      return res.status(404).json({ message: "Tourist package not found" });
    }

    res.status(200).json({ message: "Tourist package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
