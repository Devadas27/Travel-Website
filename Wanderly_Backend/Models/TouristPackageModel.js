const mongoose = require("mongoose");

const touristPackageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Package title is required"],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "General",
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true, // e.g. "4 Days / 3 Nights"
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    groupSize: {
      type: String,
      default: "1-10 Persons",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String, // Stored image path (e.g. /uploads/package-xxx.jpg)
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Frontend-ile package.id and MongoDB _id support cheyyan (alias)
touristPackageSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

module.exports = mongoose.model("TouristPackage", touristPackageSchema);
