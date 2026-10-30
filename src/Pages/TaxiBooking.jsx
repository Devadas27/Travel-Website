import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiNavigation,
  FiCheck,
} from "react-icons/fi";
import { FaCar, FaUsers } from "react-icons/fa";

const API_BASE_URL = "http://localhost:5000/api/taxi-bookings";

const VEHICLE_OPTIONS = [
  {
    type: "Sedan (4 Seater)",
    model: "Dzire, Etios or similar",
    seats: "4 Seats",
    luggage: "2 Bags",
    icon: "🚗",
    badge: "Most Popular",
  },
  {
    type: "SUV (6-7 Seater)",
    model: "Innova, Ertiga or similar",
    seats: "6-7 Seats",
    luggage: "4 Bags",
    icon: "🚙",
    badge: "Spacious & Hills",
  },
  {
    type: "Hatchback (4 Seater)",
    model: "Swift, WagonR or similar",
    seats: "4 Seats",
    luggage: "1-2 Bags",
    icon: "🚕",
    badge: "Budget Friendly",
  },
  {
    type: "Luxury Sedan",
    model: "Camry, Mercedes or similar",
    seats: "4 Seats",
    luggage: "3 Bags",
    icon: "✨",
    badge: "Premium Executive",
  },
  {
    type: "Tempo Traveller (12+ Seater)",
    model: "Force Traveller (AC)",
    seats: "12-17 Seats",
    luggage: "10+ Bags",
    icon: "🚐",
    badge: "Group Tour",
  },
];

const TaxiBooking = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    pickupTime: "",
    vehicleType: "Sedan (4 Seater)",
    passengers: 1,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehicleSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      vehicleType: type,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to submit taxi booking");
      }

      const saved = await res.json();
      setSuccessBooking(saved);

      // Reset form
      setFormData({
        customerName: "",
        phone: "",
        email: "",
        pickupLocation: "",
        dropLocation: "",
        pickupDate: "",
        pickupTime: "",
        vehicleType: "Sedan (4 Seater)",
        passengers: 1,
        notes: "",
      });
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    // 1. Full Screen Centered Container
    <section className="w-full bg-[#f8fafc] py-12 md:py-20 px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Header Title & Subtitle with Generous Spacing */}
        <div className="text-center flex flex-col items-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span
              style={{ fontFamily: "'Caveat', cursive", marginTop: "20px" }}
              className="text-[#14b8a6] text-3xl sm:text-4xl font-bold tracking-wide"
            >
              Wanderly Rides
            </span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="4" x2="12" y2="11" />
              <line x1="5" y1="7" x2="10" y2="12" />
              <line x1="19" y1="7" x2="14" y2="12" />
            </svg>
          </div>

          <h1
            style={{ marginTop: "20px" }}
            className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mb-4"
          >
            Online Taxi Booking
          </h1>

          <p
            style={{ marginTop: "20px", marginBottom: "20px" }}
            className="text-gray-600 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Book verified, sanitized cabs for local sightseeing, outstation
            roundtrips, and seamless airport transfers.
          </p>
        </div>

        {/* 2. Main Booking Form Card: Spacious, Beautiful Padding & Larger Fonts */}
        <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 lg:p-14 mb-12">
          {errorMsg && (
            <div className="mb-8 p-5 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-base font-bold flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* STEP 1: Route & Schedule */}
            <div
              className="border-b border-gray-100 pb-10"
              style={{ padding: "40px 50px" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-full bg-[#14b8a6] text-white flex items-center justify-center text-base font-extrabold shadow-sm shrink-0">
                  1
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                    Trip Route & Schedule
                  </h2>
                  <p
                    className="text-gray-500 text-sm mt-0.5"
                    style={{ marginTop: "10px" }}
                  >
                    Enter your pickup location, drop location, and scheduled
                    travel timings
                  </p>
                </div>
              </div>
              <br />

              {/* Row 1: Pickup & Drop Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                {/* Pickup Location */}
                <div>
                  <label
                    style={{ marginTop: "10px" }}
                    className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-2.5"
                  >
                    Pickup Location <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:ring-2 focus-within:ring-[#14b8a6]/20 focus-within:bg-white transition">
                    <span
                      className="text-xl text-[#14b8a6] mr-3 shrink-0"
                      style={{ padding: "0px 5px" }}
                    >
                      <FiMapPin />
                    </span>
                    <input
                      style={{ padding: "10px 5px" }}
                      type="text"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      placeholder="e.g. Cochin International Airport, Kochi"
                      required
                      className="w-full bg-transparent text-base font-semibold text-gray-800 placeholder-gray-400 outline-none"
                    />
                  </div>
                </div>

                {/* Drop Location */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                    Drop-off Location <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:ring-2 focus-within:ring-[#14b8a6]/20 focus-within:bg-white transition">
                    <span
                      className="text-xl text-rose-500 mr-3 shrink-0"
                      style={{ padding: "0px 5px" }}
                    >
                      <FiNavigation />
                    </span>
                    <input
                      style={{ padding: "10px 5px" }}
                      type="text"
                      name="dropLocation"
                      value={formData.dropLocation}
                      onChange={handleChange}
                      placeholder="e.g. Munnar Tea Estate, Idukki"
                      required
                      className="w-full bg-transparent text-base font-semibold text-gray-800 placeholder-gray-400 outline-none"
                    />
                  </div>
                </div>
              </div>
              <br />

              {/* Row 2: Date, Time & Total Passengers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                {/* Pickup Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                    Pickup Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:ring-2 focus-within:ring-[#14b8a6]/20 focus-within:bg-white transition">
                    <span
                      className="text-xl text-gray-400 mr-3 shrink-0"
                      style={{ padding: "0px 5px" }}
                    >
                      <FiCalendar />
                    </span>
                    <input
                      style={{ padding: "10px 5px" }}
                      type="date"
                      name="pickupDate"
                      min={todayStr}
                      value={formData.pickupDate}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent text-base font-semibold text-gray-800 outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Pickup Time */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                    Pickup Time <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:ring-2 focus-within:ring-[#14b8a6]/20 focus-within:bg-white transition">
                    <span
                      className="text-xl text-gray-400 mr-3 shrink-0"
                      style={{ padding: "0px 5px" }}
                    >
                      <FiClock />
                    </span>
                    <input
                      style={{ padding: "10px 5px" }}
                      type="time"
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent text-base font-semibold text-gray-800 outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Total Passengers */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                    Total Passengers <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:ring-2 focus-within:ring-[#14b8a6]/20 focus-within:bg-white transition">
                    <span
                      className="text-xl text-gray-400 mr-3 shrink-0"
                      style={{ padding: "0px 5px" }}
                    >
                      <FaUsers />
                    </span>
                    <input
                      style={{ padding: "10px 5px" }}
                      type="number"
                      name="passengers"
                      min="1"
                      max="30"
                      value={formData.passengers}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent text-base font-semibold text-gray-800 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Select Vehicle Type */}
            <div
              className="border-b border-gray-100 pb-10"
              style={{ padding: "10px 50px" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-full bg-[#14b8a6] text-white flex items-center justify-center text-base font-extrabold shadow-sm shrink-0">
                  2
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                    Select Vehicle Type
                  </h2>
                  <p
                    className="text-gray-500 text-sm mt-0.5"
                    style={{ marginTop: "10px" }}
                  >
                    Choose the cab that best fits your passenger capacity and
                    luggage comfort
                  </p>
                </div>
              </div>

              {/* Vehicle Cards Grid with Generous Spacing */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                style={{ marginTop: "30px" }}
              >
                {VEHICLE_OPTIONS.map((veh) => {
                  const isSelected = formData.vehicleType === veh.type;
                  return (
                    <div
                      style={{ padding: "20px" }}
                      key={veh.type}
                      onClick={() => handleVehicleSelect(veh.type)}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "border-[#14b8a6] bg-teal-50/40 shadow-lg ring-2 ring-[#14b8a6]/20"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:bg-gray-50/50"
                      }`}
                    >
                      {/* Top Row: Icon & Tag */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl">{veh.icon}</span>
                        {isSelected ? (
                          <span
                            style={{ padding: "3px" }}
                            className="inline-flex items-center gap-1.5 bg-[#14b8a6] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-sm"
                          >
                            <FiCheck className="text-sm stroke-3" /> Selected
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                            {veh.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Model */}
                      <div className="mb-4">
                        <div className="text-lg font-black text-gray-900 mb-1">
                          {veh.type}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">
                          {veh.model}
                        </div>
                      </div>

                      {/* Specs Pill */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm text-gray-700 font-bold">
                        <span>👥 {veh.seats}</span>
                        <span className="text-gray-300">•</span>
                        <span>🧳 {veh.luggage}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[#14b8a6]">AC</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Passenger Contact Information */}
            <div className="pb-4" style={{ padding: "20px 50px" }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-full bg-[#14b8a6] text-white flex items-center justify-center text-base font-extrabold shadow-sm shrink-0">
                  3
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                    Passenger Contact Information
                  </h2>
                  <p
                    className="text-gray-500 text-sm mt-0.5"
                    style={{ marginTop: "10px", marginBottom: "20px" }}
                  >
                    Booking confirmation and driver assignment details will be
                    shared on these contacts
                  </p>
                </div>
              </div>

              {/* Contact Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:ring-2 focus-within:ring-[#14b8a6]/20 focus-within:bg-white transition">
                    <span
                      className="text-xl text-gray-400 mr-3 shrink-0"
                      style={{ padding: "0px 5px" }}
                    >
                      <FiUser />
                    </span>
                    <input
                      style={{ padding: "10px 5px" }}
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full bg-transparent text-base font-semibold text-gray-800 placeholder-gray-400 outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:ring-2 focus-within:ring-[#14b8a6]/20 focus-within:bg-white transition">
                    <span
                      style={{ padding: "0px 5px" }}
                      className="text-xl text-gray-400 mr-3 shrink-0"
                    >
                      <FiPhone />
                    </span>
                    <input
                      style={{ padding: "10px 5px" }}
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      required
                      className="w-full bg-transparent text-base font-semibold text-gray-800 placeholder-gray-400 outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:ring-2 focus-within:ring-[#14b8a6]/20 focus-within:bg-white transition">
                    <span
                      style={{ padding: "0px 5px" }}
                      className="text-xl text-gray-400 mr-3 shrink-0"
                    >
                      <FiMail />
                    </span>
                    <input
                      style={{ padding: "10px 5px" }}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@gmail.com"
                      required
                      className="w-full bg-transparent text-base font-semibold text-gray-800 placeholder-gray-400 outline-none"
                    />
                  </div>
                </div>
              </div>
              <br />
              {/* Special Requests / Notes */}
              <div>
                <label className="block text-sm font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                  Special Requests / Flight Number / Extra Notes (Optional)
                </label>
                <textarea
                  style={{ padding: "5px 20px" }}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter any special requests, flight number, child booster seat requirements, or luggage details..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-base font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:bg-white transition"
                ></textarea>
              </div>
            </div>

            {/* Large Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#14b8a6] hover:bg-[#0da291] text-white font-black text-xl py-5 rounded-2xl shadow-xl shadow-[#14b8a6]/25 transition duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Your Booking...</span>
                  </>
                ) : (
                  <>
                    <FaCar className="text-2xl" />
                    <span style={{ padding: "10px" }}>
                      Confirm & Book Taxi Now
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 3. Features Highlight Strip - Generously Padded & Balanced */}
        <div style={{marginTop:'30px' , marginBottom:'50px'}} className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-md flex flex-col items-center">
            <span className="text-4xl mb-3">🛡️</span>
            <div className="font-extrabold text-base text-gray-900">
              Verified Drivers
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Licensed & Experienced
            </div>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-md flex flex-col items-center">
            <span className="text-4xl mb-3">⏱️</span>
            <div className="font-extrabold text-base text-gray-900">
              24/7 On-Time
            </div>
            <div className="text-sm text-gray-500 mt-1">Punctual Pickups</div>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-md flex flex-col items-center">
            <span className="text-4xl mb-3">💰</span>
            <div className="font-extrabold text-base text-gray-900">
              Best Fixed Rates
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Zero Hidden Charges
            </div>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-md flex flex-col items-center">
            <span className="text-4xl mb-3">🧼</span>
            <div className="font-extrabold text-base text-gray-900">
              Clean & AC Cabs
            </div>
            <div className="text-sm text-gray-500 mt-1">Sanitized Fleet</div>
          </div>
        </div>
      </div>

      {/* 4. Booking Success Modal */}
      {successBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-teal-50 text-[#14b8a6] rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheckCircle className="text-4xl stroke-2" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">
                Taxi Booking Requested! 🎉
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Your ride request has been saved and sent to our cab team.
              </p>
            </div>

            {/* Booking Summary Box */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3 text-sm text-gray-700 mb-6">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-semibold">Booking ID:</span>
                <span className="font-bold text-gray-900 font-mono">
                  #{successBooking._id?.slice(-6).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Passenger:</span>
                <span className="font-bold text-gray-900">
                  {successBooking.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Pickup:</span>
                <span className="font-bold text-gray-900 text-right">
                  📍 {successBooking.pickupLocation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Drop:</span>
                <span className="font-bold text-gray-900 text-right">
                  🏁 {successBooking.dropLocation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">
                  Date & Time:
                </span>
                <span className="font-bold text-gray-900">
                  📅 {successBooking.pickupDate} at ⏰{" "}
                  {successBooking.pickupTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Vehicle:</span>
                <span className="font-bold text-[#14b8a6]">
                  {successBooking.vehicleType}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-500 font-semibold">Status:</span>
                <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs">
                  Pending Confirmation
                </span>
              </div>
            </div>

            <div className="bg-teal-50/70 border border-teal-100 rounded-xl p-3.5 text-xs text-teal-800 mb-6 text-center">
              📞 Our coordinator will contact you at{" "}
              <strong>{successBooking.phone}</strong> shortly to confirm your
              driver & cab details.
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSuccessBooking(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl text-base transition cursor-pointer"
              >
                Book Another Cab
              </button>
              <Link
                to="/"
                className="flex-1 bg-[#14b8a6] hover:bg-[#0da291] text-white font-bold py-3.5 rounded-xl text-base transition text-center flex items-center justify-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TaxiBooking;
