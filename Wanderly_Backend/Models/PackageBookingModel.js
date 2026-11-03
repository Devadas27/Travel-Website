const mongoose = require("mongoose");

const packageBookingSchema = new mongoose.Schema(
  {
    packageTitle: {
      type: String,
      required: [true, "Package title is required"],
      trim: true,
    },
    packageImage: {
      type: String,
      default: "",
    },
    destination: {
      type: String,
      default: "",
    },
    duration: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    travelDate: {
      type: String,
      required: [true, "Travel date is required"],
    },
    travelers: {
      type: Number,
      required: [true, "Number of travelers is required"],
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
    specialRequests: {
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
packageBookingSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
packageBookingSchema.set("toJSON", { virtuals: true });

const PackageBooking = mongoose.model("PackageBooking", packageBookingSchema);

module.exports = PackageBooking;
