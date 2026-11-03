const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full name is required"]
    },
    email: {
        type: String,
        required: [true, "Email name is required"],
        unique: true
    },
    mobileNumber: {
        type: Number,
        required: [true, "Phone is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    dob: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: "India"
    },
    image: {
        type: String,
        default: ""
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User