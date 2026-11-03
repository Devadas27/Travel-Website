require("dotenv").config();
console.log("Server Started");

const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Uploads folder static aakki public access kodukkunnu (http://localhost:5000/uploads/...)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
    .connect(
        "mongodb+srv://devadas9446:devadas27102002@cluster0.caygaxa.mongodb.net/wanderly"
    )
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// Routes Import & Mount
const touristPlaceRoutes = require("./Routes/TouristPlaceRoutes");
app.use("/api/tourist-places", touristPlaceRoutes);

const touristPackageRoutes = require("./Routes/TouristPackageRoutes");
app.use("/api/tourist-packages", touristPackageRoutes);

const taxiBookingRoutes = require("./Routes/TaxiBookingRoutes");
app.use("/api/taxi-bookings", taxiBookingRoutes);

const categoryRoutes = require("./Routes/CategoryRoutes");
app.use("/api/categories", categoryRoutes);

const userRoutes = require('./Routes/UserRoutes')
app.use('/api/user-registration', userRoutes)

const placeBookingRoutes = require("./Routes/PlaceBookingRoutes");
app.use("/api/place-bookings", placeBookingRoutes);

const packageBookingRoutes = require("./Routes/PackageBookingRoutes");
app.use("/api/package-bookings", packageBookingRoutes);

const notificationRoutes = require("./Routes/NotificationRoutes");
app.use("/api/notifications", notificationRoutes);

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));