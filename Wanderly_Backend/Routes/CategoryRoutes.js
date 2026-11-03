const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Category = require("../Models/CategoryModel");

// 1. Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configure Multer Storage for Category Images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "category-" + uniqueSuffix + path.extname(file.originalname));
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
// CRUD API ENDPOINTS FOR CATEGORIES
// ==========================================

// 1. GET ALL CATEGORIES
// Endpoint: GET /api/categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET SINGLE CATEGORY BY ID
// Endpoint: GET /api/categories/:id
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. CREATE NEW CATEGORY (Optional Image)
// Endpoint: POST /api/categories
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if category already exists (case-insensitive)
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image && typeof req.body.image === "string") {
      imagePath = req.body.image;
    }

    const newCategory = new Category({
      name: name.trim(),
      image: imagePath,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. UPDATE CATEGORY (Optional New Image)
// Endpoint: PUT /api/categories/:id
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = {};
    if (req.body.name) {
      updateData.name = req.body.name.trim();

      // Check duplicate name excluding current category
      const existing = await Category.findOne({
        _id: { $ne: req.params.id },
        name: { $regex: new RegExp(`^${updateData.name}$`, "i") },
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Another category with this name already exists" });
      }
    }

    // New image file uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image !== undefined) {
      updateData.image = req.body.image;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. DELETE CATEGORY
// Endpoint: DELETE /api/categories/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
