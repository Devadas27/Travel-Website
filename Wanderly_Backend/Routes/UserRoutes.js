const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../Models/UserModel"); // Adjust path if your model file name differs
const { authMiddleware, generateToken } = require("../middleware/authMiddleware");

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage for User Profile Avatars
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error("Only image formats (JPG, PNG, WEBP) are supported"));
    },
});

const handleAvatarUpload = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

// ==========================================
// 1. REGISTER ROUTE (Sign Up)
// Endpoint: POST /api/user-registration/register
// ==========================================
router.post("/register", async (req, res) => {
    try {
        const { name, email, mobileNumber, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user instance
        const newUser = new User({
            name,
            email,
            mobileNumber,
            password: hashedPassword,
        });

        // Save to database
        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
});

// ==========================================
// 2. LOGIN ROUTE
// Endpoint: POST /api/user-registration/login
// ==========================================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Compare submitted password with hashed database password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Update online status and last active timestamp
        user.isOnline = true;
        user.lastActive = new Date();
        await user.save();

        // Generate JWT Token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                isOnline: user.isOnline,
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
});

// ==========================================
// 3. LOGOUT ROUTE
// Endpoint: POST /api/user-registration/logout
// ==========================================
router.post("/logout", async (req, res) => {
    try {
        const { userId, email } = req.body;
        if (userId) {
            await User.findByIdAndUpdate(userId, { isOnline: false, lastActive: new Date() });
        } else if (email) {
            await User.findOneAndUpdate({ email }, { isOnline: false, lastActive: new Date() });
        }
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ success: false, message: "Server error during logout" });
    }
});

// ==========================================
// 4. GET PROFILE ROUTE (Protected)
// Endpoint: GET /api/user-registration/profile
// ==========================================
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        // Find user by ID stored in the token (req.user.id), exclude password field
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ==========================================
// 5. UPDATE PROFILE ROUTE (User Self Edit)
// Endpoint: PUT /api/user-registration/profile
// ==========================================
router.put("/profile", authMiddleware, handleAvatarUpload, async (req, res) => {
    try {
        const { name, mobileNumber, dob, gender, address, country, image } = req.body;
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber;
        if (dob !== undefined) updateData.dob = dob;
        if (gender !== undefined) updateData.gender = gender;
        if (address !== undefined) updateData.address = address;
        if (country !== undefined) updateData.country = country;

        // If file uploaded via Multer
        if (req.file) {
            const host = req.get("host") || "localhost:5000";
            const protocol = req.protocol || "http";
            updateData.image = `${protocol}://${host}/uploads/${req.file.filename}`;
        } else if (image !== undefined) {
            updateData.image = image;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ success: false, message: "Server error updating profile" });
    }
});

// ==========================================
// 6. ADMIN: GET ALL USERS
// Endpoint: GET /api/user-registration/users
// ==========================================
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        console.error("Fetch Users Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
});

// Also alias /all for convenience
router.get("/all", async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        console.error("Fetch Users Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
});

// ==========================================
// 7. ADMIN: GET SINGLE USER BY ID
// Endpoint: GET /api/user-registration/users/:id
// ==========================================
router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Fetch User Details Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch user details" });
    }
});

// ==========================================
// 8. ADMIN: DELETE USER
// Endpoint: DELETE /api/user-registration/users/:id
// ==========================================
router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully", id: req.params.id });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete user" });
    }
});

// ==========================================
// 9. ADMIN: UPDATE USER STATUS (Online/Offline)
// Endpoint: PUT /api/user-registration/users/:id/status
// ==========================================
router.put("/users/:id/status", async (req, res) => {
    try {
        const { isOnline } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { isOnline: Boolean(isOnline), lastActive: new Date() },
            { new: true }
        ).select("-password");

        if (!updated) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Status updated successfully", user: updated });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
});

module.exports = router;