const express = require("express");
const router = express.Router();
const PlaceBooking = require("../Models/PlaceBookingModel");
const Notification = require("../Models/NotificationModel");

// ==========================================
// 1. CREATE NEW PLACE BOOKING
// Endpoint: POST /api/place-bookings
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      placeName,
      placeImage,
      location,
      price,
      visitDate,
      timeSlot,
      visitors,
      customerName,
      email,
      phone,
      specialNotes,
      userId,
    } = req.body;

    if (!placeName || !visitDate || !customerName || !email || !phone) {
      return res.status(400).json({
        message: "Please provide place name, date, customer name, email, and phone.",
      });
    }

    const newBooking = new PlaceBooking({
      placeName,
      placeImage: placeImage || "",
      location: location || "",
      price: Number(price) || 0,
      visitDate,
      timeSlot: timeSlot || "Morning (09:00 AM - 01:00 PM)",
      visitors: Number(visitors) || 1,
      customerName,
      email: email.toLowerCase().trim(),
      phone: String(phone).trim(),
      specialNotes: specialNotes || "",
      status: "Pending",
      userId: userId || null,
    });

    const saved = await newBooking.save();

    // Trigger Notification for User
    try {
      await Notification.create({
        recipientEmail: saved.email,
        recipientPhone: saved.phone || "",
        title: "Place Booking Submitted 📍",
        message: `Your booking for ${saved.placeName} on ${saved.visitDate} has been received and is pending confirmation.`,
        type: "booking_submitted",
        bookingType: "Place",
        bookingId: String(saved._id),
      });
    } catch (notifErr) {
      console.warn("Place booking notification error:", notifErr);
    }

    res.status(201).json({
      success: true,
      message: "Tourist place booking submitted successfully! Pending confirmation.",
      booking: saved,
    });
  } catch (error) {
    console.error("Create Place Booking Error:", error);
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// 2. GET ALL PLACE BOOKINGS (with optional filters)
// Endpoint: GET /api/place-bookings
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

    const bookings = await PlaceBooking.find(filter).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch Place Bookings Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 3. GET SINGLE PLACE BOOKING
// Endpoint: GET /api/place-bookings/:id
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const booking = await PlaceBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Place booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Fetch Single Place Booking Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 4. UPDATE BOOKING STATUS (Admin Approve / Confirm)
// Endpoint: PUT /api/place-bookings/:id
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = {};
    if (status) updateData.status = status;

    const updated = await PlaceBooking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Place booking not found" });
    }

    // Trigger Notification for User upon Status Change
    if (status === "Confirmed") {
      try {
        await Notification.create({
          recipientEmail: updated.email,
          recipientPhone: updated.phone || "",
          title: "Place Booking Confirmed! 🎉",
          message: `Your visit to ${updated.placeName} on ${updated.visitDate} has been confirmed by Wanderly Admin!`,
          type: "booking_approved",
          bookingType: "Place",
          bookingId: String(updated._id),
        });
      } catch (notifErr) {
        console.warn("Place booking approval notification error:", notifErr);
      }
    } else if (status === "Cancelled") {
      try {
        await Notification.create({
          recipientEmail: updated.email,
          recipientPhone: updated.phone || "",
          title: "Place Booking Cancelled",
          message: `Your booking for ${updated.placeName} on ${updated.visitDate} was cancelled.`,
          type: "booking_cancelled",
          bookingType: "Place",
          bookingId: String(updated._id),
        });
      } catch (notifErr) {
        console.warn("Place booking cancellation notification error:", notifErr);
      }
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Place Booking Error:", error);
    res.status(400).json({ message: error.message });
  }
});

// ==========================================
// 5. DELETE PLACE BOOKING
// Endpoint: DELETE /api/place-bookings/:id
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await PlaceBooking.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Place booking not found" });
    }
    res.status(200).json({
      success: true,
      message: "Place booking deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Delete Place Booking Error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
