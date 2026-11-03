const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    recipientPhone: {
      type: String,
      trim: true,
      default: "",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["booking_submitted", "booking_approved", "booking_cancelled", "general"],
      default: "general",
    },
    bookingType: {
      type: String,
      enum: ["Place", "Package", "Taxi", "Other"],
      default: "Other",
    },
    bookingId: {
      type: String,
      default: "",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
