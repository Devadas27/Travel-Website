const mongoose = require("mongoose");

const placeBookingSchema = new mongoose.Schema(
  {
    placeName: {
      type: String,
      required: [true, "Place name is required"],
      trim: true,
    },
    placeImage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    visitDate: {
      type: String,
      required: [true, "Visit date is required"],
    },
    timeSlot: {
      type: String,
      default: "Morning (09:00 AM - 01:00 PM)",
    },
    visitors: {
      type: Number,
      required: [true, "Number of visitors is required"],
      default: 1,
      min: 1,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    specialNotes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual id field
placeBookingSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
placeBookingSchema.set("toJSON", { virtuals: true });

const PlaceBooking = mongoose.model("PlaceBooking", placeBookingSchema);

module.exports = PlaceBooking;
