const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    image: {
      type: String, // Stored image path (e.g. /uploads/category-xxx.jpg)
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Map _id to id for frontend compatibility
categorySchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Category", categorySchema);
