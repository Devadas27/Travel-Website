const express = require("express");
const router = express.Router();
const Notification = require("../Models/NotificationModel");

// ==========================================
// 1. GET NOTIFICATIONS FOR CURRENT USER
// Endpoint: GET /api/notifications?email=...&phone=...
// ==========================================
router.get("/", async (req, res) => {
  try {
    const { email, phone } = req.query;

    if (!email && !phone) {
      return res.status(200).json([]);
    }

    const conditions = [];
    if (email) {
      conditions.push({ recipientEmail: email.toLowerCase().trim() });
    }
    if (phone) {
      conditions.push({ recipientPhone: String(phone).trim() });
    }

    const query = conditions.length > 1 ? { $or: conditions } : conditions[0];

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Fetch Notifications Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 2. CREATE A NEW NOTIFICATION
// Endpoint: POST /api/notifications
// ==========================================
router.post("/", async (req, res) => {
  try {
    const { recipientEmail, recipientPhone, title, message, type, bookingType, bookingId } = req.body;

    if (!recipientEmail || !title || !message) {
      return res.status(400).json({ message: "recipientEmail, title, and message are required." });
    }

    const newNotification = new Notification({
      recipientEmail: recipientEmail.toLowerCase().trim(),
      recipientPhone: recipientPhone ? String(recipientPhone).trim() : "",
      title,
      message,
      type: type || "general",
      bookingType: bookingType || "Other",
      bookingId: bookingId || "",
      isRead: false,
    });

    const saved = await newNotification.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Create Notification Error:", error);
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// 3. MARK SINGLE NOTIFICATION AS READ
// Endpoint: PUT /api/notifications/:id/read
// ==========================================
router.put("/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// 4. MARK ALL NOTIFICATIONS AS READ FOR USER
// Endpoint: PUT /api/notifications/mark-all-read
// ==========================================
router.put("/mark-all-read", async (req, res) => {
  try {
    const email = req.body.email || req.query.email;
    const phone = req.body.phone || req.query.phone;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone required to mark notifications as read." });
    }

    const conditions = [];
    if (email) conditions.push({ recipientEmail: email.toLowerCase().trim() });
    if (phone) conditions.push({ recipientPhone: String(phone).trim() });

    const query = conditions.length > 1 ? { $or: conditions } : conditions[0];

    const result = await Notification.updateMany(query, { $set: { isRead: true } });
    res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Mark All Read Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 5. DELETE A NOTIFICATION
// Endpoint: DELETE /api/notifications/:id
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
