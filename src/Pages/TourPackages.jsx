import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiClock,
  FiSearch,
  FiCheckCircle,
  FiX,
  FiCalendar,
  FiUser,
  FiMail,
  FiPhone,
  FiUsers,
  FiStar,
  FiCheck,
} from "react-icons/fi";
import Footer from "../Components/Home/Footer";
import ScrollToTop from "../Components/Common/ScrollToTop";

const API_BASE_URL = "http://localhost:5000/api";
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";

const TourPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Booking Modal State
  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    pkg: null,
    loading: false,
    success: false,
    bookingId: "",
  });

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    travelDate: "",
    travelers: 1,
    specialRequests: "",
  });

  // 1. Fetch Tourist Packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/tourist-packages`);
        if (!res.ok) throw new Error("Failed to load tour packages");
        const data = await res.json();
        const activeOnly = data.filter((p) => p.status !== "Inactive");
        setPackages(activeOnly.length > 0 ? activeOnly : data);
      } catch (err) {
        console.error("Error loading packages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Open Booking Modal for a specific Package
  const handleOpenBooking = (pkg) => {
    let storedUser = null;
    try {
      const stored = localStorage.getItem("user");
      if (stored) storedUser = JSON.parse(stored);
    } catch (e) {}

    setBookingForm({
      customerName: storedUser && storedUser.name ? String(storedUser.name) : "",
      email: storedUser && storedUser.email ? String(storedUser.email) : "",
      phone: storedUser ? String(storedUser.mobileNumber || storedUser.phone || "") : "",
      travelDate: "",
      travelers: 1,
      specialRequests: "",
    });

    setBookingModal({
      isOpen: true,
      pkg,
      loading: false,
      success: false,
      bookingId: "",
    });
  };

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit Tour Package Booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingModal.pkg) return;

    try {
      setBookingModal((prev) => ({ ...prev, loading: true }));

      let userId = null;
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          userId = parsed.id || parsed._id || null;
        }
      } catch (err) {}

      const effectivePrice =
        bookingModal.pkg.discountPrice && bookingModal.pkg.discountPrice > 0
          ? bookingModal.pkg.discountPrice
          : bookingModal.pkg.price || 0;

      const payload = {
        packageTitle: bookingModal.pkg.title,
        packageImage: bookingModal.pkg.image || "",
        destination: bookingModal.pkg.destination || "",
        duration: bookingModal.pkg.duration || "",
        price: effectivePrice,
        travelDate: bookingForm.travelDate,
        travelers: Number(bookingForm.travelers) || 1,
        customerName: String(bookingForm.customerName || "").trim(),
        email: String(bookingForm.email || "").trim(),
        phone: String(bookingForm.phone || "").trim(),
        specialRequests: String(bookingForm.specialRequests || "").trim(),
        userId: userId,
      };

      const res = await fetch(`${API_BASE_URL}/package-bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to submit booking");
      }

      const result = await res.json();
      setBookingModal((prev) => ({
        ...prev,
        loading: false,
        success: true,
        bookingId: result.booking ? result.booking._id || result.booking.id : "CONFIRMED",
      }));
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking error: " + err.message);
      setBookingModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // Helper for image URLs
  const getImageUrl = (img) => {
    if (!img) return FALLBACK_IMAGE;
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return `http://localhost:5000${img.startsWith("/") ? "" : "/"}${img}`;
  };

  // Extract unique categories
  const categories = ["All", ...new Set(packages.map((p) => p.category).filter(Boolean))];

  // Filtered packages
  const filteredPackages = packages.filter((pkg) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      pkg.title.toLowerCase().includes(q) ||
      (pkg.destination && pkg.destination.toLowerCase().includes(q)) ||
      (pkg.description && pkg.description.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === "All" || pkg.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-10 px-4 sm:px-6 lg:px-12 flex flex-col items-center select-none">
      <div
        className="w-full max-w-7xl mx-auto flex flex-col items-center"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        {/* Hero Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#14b8a6]/10 text-[#14b8a6] text-xs font-bold uppercase tracking-wider mb-3">
            <span>🎒 Curated Adventures</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Popular Tour Packages & Trips
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            Choose from handpicked multi-day tours, rainforest expeditions, backwater retreats, and family holiday packages.
          </p>

          {/* Search Bar */}
          <div className="mt-8 w-full max-w-xl mx-auto relative">
            <div className="flex items-center bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 focus-within:border-[#14b8a6] focus-within:ring-2 focus-within:ring-[#14b8a6]/20 transition">
              <FiSearch className="text-gray-400 text-xl mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search packages by destination, duration, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#14b8a6] text-white shadow-md shadow-[#14b8a6]/20"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[#14b8a6] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 font-medium mt-4">Loading tour packages...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-lg mx-auto">
            <span className="text-5xl block mb-3">🎒</span>
            <h3 className="text-xl font-bold text-gray-800">No Tour Packages Found</h3>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your search criteria or selecting another category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id || pkg.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(pkg.image)}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {pkg.isFeatured && (
                    <span className="absolute top-4 left-4 bg-amber-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <FiStar className="fill-current" /> Featured
                    </span>
                  )}
                  <span className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <FiClock /> {pkg.duration || "3 Days / 2 Nights"}
                  </span>
                </div>

                {/* Card Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2 font-medium">
                      <span className="flex items-center gap-1 text-[#14b8a6] font-bold">
                        <FiMapPin /> {pkg.destination}
                      </span>
                      <span>{pkg.groupSize || "1-10 Persons"}</span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 group-hover:text-[#14b8a6] transition-colors line-clamp-1">
                      {pkg.title}
                    </h3>

                    <p className="text-gray-500 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                      {pkg.description ||
                        "Experience the best sightseeing, curated itineraries, private transfers, and luxury accommodation."}
                    </p>
                  </div>

                  {/* Pricing and Action Button */}
                  <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                        Package Cost
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gray-900">
                          ₹{pkg.discountPrice ? pkg.discountPrice.toLocaleString() : pkg.price.toLocaleString()}
                        </span>
                        {pkg.discountPrice && pkg.discountPrice < pkg.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{pkg.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(pkg)}
                      className="px-5 py-2.5 bg-[#14b8a6] hover:bg-[#0da291] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-[#14b8a6]/20 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Book Package</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* TOUR PACKAGE BOOKING MODAL FORM                                */}
      {/* ============================================================== */}
      {bookingModal.isOpen && bookingModal.pkg && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() =>
            !bookingModal.loading &&
            setBookingModal((prev) => ({ ...prev, isOpen: false }))
          }
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-7 sm:p-9 border border-gray-100 my-auto text-left animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() =>
                !bookingModal.loading &&
                setBookingModal((prev) => ({ ...prev, isOpen: false }))
              }
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition flex items-center justify-center text-xl cursor-pointer"
            >
              <FiX />
            </button>

            {/* Success State */}
            {bookingModal.success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
                  <FiCheckCircle />
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  Tour Package Booked!
                </h3>
                <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
                  Your booking request for <strong>{bookingModal.pkg.title}</strong> has been submitted.
                </p>
                <div className="my-5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-800">
                  ⏳ Current Status: <strong>Pending Admin Confirmation</strong>
                  <br />
                  <span className="font-normal text-gray-500 text-[11px] block mt-1">
                    Our team will verify availability. Once confirmed, you will see it as <strong>Confirmed</strong> in your profile.
                  </span>
                </div>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/profile"
                    className="px-5 py-2.5 bg-[#14b8a6] hover:bg-[#0da291] text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md"
                  >
                    View My Bookings
                  </Link>
                  <button
                    type="button"
                    onClick={() => setBookingModal((prev) => ({ ...prev, isOpen: false }))}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm rounded-xl transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Package Booking Form */
              <div>
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-2xl shrink-0">
                    <FiCalendar />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                      Book Tour Package
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {bookingModal.pkg.title} • {bookingModal.pkg.duration}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-5 sm:space-y-6">
                  {/* Selected Package Mini Summary */}
                  <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 flex items-center gap-4 mb-2 shadow-xs">
                    <img
                      src={getImageUrl(bookingModal.pkg.image)}
                      alt={bookingModal.pkg.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs border border-white"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-base truncate">
                        {bookingModal.pkg.title}
                      </h4>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <span>📍 {bookingModal.pkg.destination}</span>
                        <span>•</span>
                        <span className="text-[#14b8a6] font-extrabold text-sm">
                          ₹{bookingModal.pkg.discountPrice || bookingModal.pkg.price} / person
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Full Name *
                    </label>
                    <div className="flex items-center bg-gray-50/70 border border-gray-200 rounded-xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#14b8a6]/20 transition-all shadow-xs">
                      <FiUser className="text-gray-400 mr-3 text-lg shrink-0" />
                      <input
                        type="text"
                        name="customerName"
                        required
                        value={bookingForm.customerName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-transparent text-sm sm:text-base font-medium text-gray-800 placeholder-gray-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Email Address *
                      </label>
                      <div className="flex items-center bg-gray-50/70 border border-gray-200 rounded-xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#14b8a6]/20 transition-all shadow-xs">
                        <FiMail className="text-gray-400 mr-3 text-lg shrink-0" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={bookingForm.email}
                          onChange={handleInputChange}
                          placeholder="name@email.com"
                          className="w-full bg-transparent text-sm sm:text-base font-medium text-gray-800 placeholder-gray-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Phone Number *
                      </label>
                      <div className="flex items-center bg-gray-50/70 border border-gray-200 rounded-xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#14b8a6]/20 transition-all shadow-xs">
                        <FiPhone className="text-gray-400 mr-3 text-lg shrink-0" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={bookingForm.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="w-full bg-transparent text-sm sm:text-base font-medium text-gray-800 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Travel Start Date & Travelers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Travel Start Date *
                      </label>
                      <input
                        type="date"
                        name="travelDate"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        value={bookingForm.travelDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm sm:text-base font-medium text-gray-800 focus:outline-none focus:border-[#14b8a6] focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/20 transition-all shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                        Number of Travelers *
                      </label>
                      <div className="flex items-center bg-gray-50/70 border border-gray-200 rounded-xl px-4 py-3.5 focus-within:border-[#14b8a6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#14b8a6]/20 transition-all shadow-xs">
                        <FiUsers className="text-gray-400 mr-3 text-lg shrink-0" />
                        <input
                          type="number"
                          name="travelers"
                          min="1"
                          max="30"
                          required
                          value={bookingForm.travelers}
                          onChange={handleInputChange}
                          className="w-full bg-transparent text-sm sm:text-base font-medium text-gray-800 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Special Requests / Hotel Preferences (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      rows="3"
                      value={bookingForm.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Vegetarian meals, room with balcony, pickup from railway station, etc."
                      className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm sm:text-base font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#14b8a6] focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/20 transition-all shadow-xs resize-none"
                    ></textarea>
                  </div>

                  {/* Total Cost & Submit */}
                  <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-0.5">
                        Total Package Cost
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-gray-900">
                        ₹{((bookingModal.pkg.discountPrice || bookingModal.pkg.price) * (Number(bookingForm.travelers) || 1)).toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={bookingModal.loading}
                      className="px-7 py-3.5 bg-[#14b8a6] hover:bg-[#0da291] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center shrink-0"
                    >
                      {bookingModal.loading ? "Submitting..." : "Confirm Package Booking"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Scroll to Top & Webpage Footer */}
      <ScrollToTop />
      <div className="w-full mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default TourPackages;
