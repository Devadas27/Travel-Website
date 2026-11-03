const mongoose = require("mongoose");

const touristPlaceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Place name is required"],
            trim: true,
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        duration: {
            type: String,
            required: [true, "Duration is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
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
        image: {
            type: String, // Uploaded image path or URL
            default: "",
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

// Frontend-ile place.id support cheyyan (MongoDB _id to id alias)
touristPlaceSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
    },
});

module.exports = mongoose.model("TouristPlace", touristPlaceSchema);