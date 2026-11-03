const express = require("express");
const router = express.Router();
const TaxiBooking = require("../Models/TaxiBookingModel");
const Notification = require("../Models/NotificationModel");

// ==========================================
// CRUD API ENDPOINTS FOR TAXI BOOKINGS
// ==========================================

// 1. GET ALL BOOKINGS (For Admin Table with optional ?status= filter)
// Endpoint: GET /api/taxi-bookings
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== "All") {
      filter.status = req.query.status;
    }

    const bookings = await TaxiBooking.find(filter).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET SINGLE BOOKING BY ID
// Endpoint: GET /api/taxi-bookings/:id
router.get("/:id", async (req, res) => {
  try {
    const booking = await TaxiBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Taxi booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. CREATE NEW TAXI BOOKING (Customer Frontend Form)
// Endpoint: POST /api/taxi-bookings
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      vehicleType,
      passengers,
      notes,
    } = req.body;

    const newBooking = new TaxiBooking({
      customerName,
      phone,
      email,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime,
      vehicleType: vehicleType || "Sedan (4 Seater)",
      passengers: passengers ? Number(passengers) : 1,
      notes: notes || "",
      status: "Pending",
    });

    const savedBooking = await newBooking.save();

    // Trigger Notification for User
    if (savedBooking.email) {
      try {
        await Notification.create({
          recipientEmail: savedBooking.email,
          recipientPhone: savedBooking.phone || "",
          title: "Taxi Booking Submitted 🚕",
          message: `Your taxi ride from ${savedBooking.pickupLocation} to ${savedBooking.dropLocation} on ${savedBooking.pickupDate} has been requested.`,
          type: "booking_submitted",
          bookingType: "Taxi",
          bookingId: String(savedBooking._id),
        });
      } catch (notifErr) {
        console.warn("Taxi booking notification error:", notifErr);
      }
    }

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. UPDATE BOOKING (Status change or detail update from Admin Panel)
// Endpoint: PUT /api/taxi-bookings/:id
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.passengers) {
      updateData.passengers = Number(updateData.passengers);
    }

    const updatedBooking = await TaxiBooking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Taxi booking not found" });
    }

    // Trigger Notification for User upon Status Change
    if (updateData.status === "Confirmed" && updatedBooking.email) {
      try {
        await Notification.create({
          recipientEmail: updatedBooking.email,
          recipientPhone: updatedBooking.phone || "",
          title: "Taxi Booking Confirmed! 🚕",
          message: `Your taxi ride from ${updatedBooking.pickupLocation} to ${updatedBooking.dropLocation} on ${updatedBooking.pickupDate} at ${updatedBooking.pickupTime} is confirmed!`,
          type: "booking_approved",
          bookingType: "Taxi",
          bookingId: String(updatedBooking._id),
        });
      } catch (notifErr) {
        console.warn("Taxi booking approval notification error:", notifErr);
      }
    } else if (updateData.status === "Cancelled" && updatedBooking.email) {
      try {
        await Notification.create({
          recipientEmail: updatedBooking.email,
          recipientPhone: updatedBooking.phone || "",
          title: "Taxi Booking Cancelled",
          message: `Your taxi ride from ${updatedBooking.pickupLocation} to ${updatedBooking.dropLocation} on ${updatedBooking.pickupDate} was cancelled.`,
          type: "booking_cancelled",
          bookingType: "Taxi",
          bookingId: String(updatedBooking._id),
        });
      } catch (notifErr) {
        console.warn("Taxi booking cancellation notification error:", notifErr);
      }
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. DELETE BOOKING (Admin Panel)
// Endpoint: DELETE /api/taxi-bookings/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedBooking = await TaxiBooking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Taxi booking not found" });
    }

    res.status(200).json({ message: "Taxi booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
