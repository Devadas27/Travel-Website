const mongoose = require("mongoose");

const taxiBookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    pickupLocation: {
      type: String,
      required: [true, "Pickup location is required"],
      trim: true,
    },
    dropLocation: {
      type: String,
      required: [true, "Drop location is required"],
      trim: true,
    },
    pickupDate: {
      type: String,
      required: [true, "Pickup date is required"],
    },
    pickupTime: {
      type: String,
      required: [true, "Pickup time is required"],
    },
    vehicleType: {
      type: String,
      required: [true, "Vehicle type is required"],
      default: "Sedan (4 Seater)",
    },
    passengers: {
      type: Number,
      required: [true, "Number of passengers is required"],
      default: 1,
      min: 1,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id for frontend compatibility
taxiBookingSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

module.exports = mongoose.model("TaxiBooking", taxiBookingSchema);
