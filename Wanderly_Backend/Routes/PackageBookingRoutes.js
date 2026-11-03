const express = require("express");
const router = express.Router();
const PackageBooking = require("../Models/PackageBookingModel");
const Notification = require("../Models/NotificationModel");

// ==========================================
// 1. CREATE NEW PACKAGE BOOKING
// Endpoint: POST /api/package-bookings
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      packageTitle,
      packageImage,
      destination,
      duration,
      price,
      travelDate,
      travelers,
      customerName,
      email,
      phone,
      specialRequests,
      userId,
    } = req.body;

    if (!packageTitle || !travelDate || !customerName || !email || !phone) {
      return res.status(400).json({
        message: "Please provide package title, travel date, customer name, email, and phone.",
      });
    }

    const newBooking = new PackageBooking({
      packageTitle,
      packageImage: packageImage || "",
      destination: destination || "",
      duration: duration || "",
      price: Number(price) || 0,
      travelDate,
      travelers: Number(travelers) || 1,
      customerName,
      email: email.toLowerCase().trim(),
      phone: String(phone).trim(),
      specialRequests: specialRequests || "",
      status: "Pending",
      userId: userId || null,
    });

    const saved = await newBooking.save();

    // Trigger Notification for User
    try {
      await Notification.create({
        recipientEmail: saved.email,
        recipientPhone: saved.phone || "",
        title: "Package Booking Submitted 🎒",
        message: `Your booking for "${saved.packageTitle}" on ${saved.travelDate} has been submitted and is pending confirmation.`,
        type: "booking_submitted",
        bookingType: "Package",
        bookingId: String(saved._id),
      });
    } catch (notifErr) {
      console.warn("Package booking notification error:", notifErr);
    }

    res.status(201).json({
      success: true,
      message: "Tour package booking submitted successfully! Pending confirmation.",
      booking: saved,
    });
  } catch (error) {
    console.error("Create Package Booking Error:", error);
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// 2. GET ALL PACKAGE BOOKINGS (with optional filters)
// Endpoint: GET /api/package-bookings
// ==========================================
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.email) {
      filter.email = req.query.email.toLowerCase().trim();
    }
    if (req.query.status && req.query.status !== "All") {
      filter.status = req.query.status;
    }

    const bookings = await PackageBooking.find(filter).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch Package Bookings Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 3. GET SINGLE PACKAGE BOOKING
// Endpoint: GET /api/package-bookings/:id
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const booking = await PackageBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Package booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Fetch Single Package Booking Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 4. UPDATE BOOKING STATUS (Admin Approve / Confirm)
// Endpoint: PUT /api/package-bookings/:id
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = {};
    if (status) updateData.status = status;

    const updated = await PackageBooking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Package booking not found" });
    }

    // Trigger Notification for User upon Status Change
    if (status === "Confirmed") {
      try {
        await Notification.create({
          recipientEmail: updated.email,
          recipientPhone: updated.phone || "",
          title: "Package Booking Confirmed! 🎉",
          message: `Great news! Your booking for tour package "${updated.packageTitle}" on ${updated.travelDate} has been confirmed by Wanderly Admin!`,
          type: "booking_approved",
          bookingType: "Package",
          bookingId: String(updated._id),
        });
      } catch (notifErr) {
        console.warn("Package booking approval notification error:", notifErr);
      }
    } else if (status === "Cancelled") {
      try {
        await Notification.create({
          recipientEmail: updated.email,
          recipientPhone: updated.phone || "",
          title: "Package Booking Cancelled",
          message: `Your booking for "${updated.packageTitle}" on ${updated.travelDate} was cancelled.`,
          type: "booking_cancelled",
          bookingType: "Package",
          bookingId: String(updated._id),
        });
      } catch (notifErr) {
        console.warn("Package booking cancellation notification error:", notifErr);
      }
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Package Booking Error:", error);
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// 5. DELETE PACKAGE BOOKING
// Endpoint: DELETE /api/package-bookings/:id
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await PackageBooking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Package booking not found" });
    }
    res.status(200).json({
      success: true,
      message: "Package booking deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Delete Package Booking Error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
