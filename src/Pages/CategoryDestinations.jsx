import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiArrowLeft,
  FiArrowUpRight,
  FiClock,
  FiCompass,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const API_BASE_URL = "http://localhost:5000/api/tourist-places";
const BACKEND_BASE_URL = "http://localhost:5000";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=80";

const CategoryDestinations = () => {
  // 1. Get the category name parameter from the URL using useParams
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state: 3 cards per row, 3 cards per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Decode URI component (e.g., "Hill%20Station" -> "Hill Station")
  const decodedCategory = categoryName ? decodeURIComponent(categoryName) : "";

  // Scroll to top and reset page on category change
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categoryName]);

  // 2. Fetch tourist places from the Backend API
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_BASE_URL);
        if (!res.ok) {
          throw new Error("Failed to load tourist destinations");
        }
        const data = await res.json();
        setPlaces(data);
      } catch (err) {
        console.error("Error loading destinations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // 3. Filter destinations matching the selected category (case-insensitive)
  const filteredPlaces = places.filter((place) => {
    if (!place.category) return false;
    return (
      place.category.trim().toLowerCase() ===
      decodedCategory.trim().toLowerCase()
    );
  });

  // Pagination calculations: 3 cards per row, 3 cards per page
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlaces = filteredPlaces.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDestinationClick = (place) => {
    navigate(`/tours?destination=${encodeURIComponent(place.name)}`);
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-12 px-4 sm:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Top Back Navigation Bar */}
        <div className="w-full flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#14b8a6] transition-colors bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100"
          >
            <FiArrowLeft className="text-lg" />
            <span>Back to Home / Categories</span>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-white px-3.5 py-2 rounded-2xl shadow-sm border border-gray-100">
            <FiCompass className="text-[#14b8a6]" />
            Category Filter:{" "}
            <strong className="text-gray-800">{decodedCategory}</strong>
          </span>
        </div>

        {/* Header Banner */}
        <div className="text-center flex flex-col items-center max-w-2xl mx-auto mb-12">
          {/* Cursive Subtitle Badge */}
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span
              style={{ fontFamily: "'Caveat', cursive" }}
              className="text-[#14b8a6] text-3xl sm:text-4xl font-bold tracking-wide"
            >
              Explore Destinations
            </span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="mb-2"
            >
              <line x1="12" y1="4" x2="12" y2="11" />
              <line x1="5" y1="7" x2="10" y2="12" />
              <line x1="19" y1="7" x2="14" y2="12" />
            </svg>
          </div>

          {/* Main Page Title */}
          <h1 className="text-4xl sm:text-5xl font-black text-[#1e2329] tracking-tight mb-3">
            {decodedCategory} Destinations
          </h1>

          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Discover all handpicked tourist places and travel itineraries under
            the <span className="font-semibold text-gray-700">{decodedCategory}</span> category.
          </p>

          {/* Results Count Pill */}
          {!loading && (
            <div className="mt-4">
              <span className="inline-block bg-[#14b8a6]/10 text-[#0d9488] text-xs font-bold px-4 py-1.5 rounded-full border border-[#14b8a6]/20">
                {filteredPlaces.length}{" "}
                {filteredPlaces.length === 1 ? "Destination" : "Destinations"}{" "}
                Found
              </span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-3xl bg-gray-200 animate-pulse flex flex-col justify-end p-7"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-3" />
                <div className="h-7 bg-[#14b8a6]/20 rounded-full w-24" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="w-full max-w-md bg-red-50 border border-red-200 text-red-700 p-6 rounded-3xl text-center my-8">
            <p className="font-bold mb-1">Failed to load destinations</p>
            <p className="text-xs mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPlaces.length === 0 && (
          <div className="w-full max-w-lg bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100 my-8">
            <div className="w-20 h-20 rounded-full bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-4xl mx-auto mb-4">
              📍
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Destinations in {decodedCategory}
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              There are currently no tourist places listed under the{" "}
              <strong>"{decodedCategory}"</strong> category. Add places in this
              category via the Admin Panel to display them here!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#14b8a6] hover:bg-[#0da291] text-white font-bold text-sm px-6 py-3 rounded-full transition shadow-md"
            >
              <FiArrowLeft /> Explore Other Categories
            </Link>
          </div>
        )}

        {/* Destinations Grid (3 cards per row matching Wanderly standard) */}
        {!loading && !error && filteredPlaces.length > 0 && (
          <>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center">
              {currentPlaces.map((place) => {
                const placeId = place._id || place.id;
                const imageUrl = place.image
                  ? place.image.startsWith("http")
                    ? place.image
                    : `${BACKEND_BASE_URL}${place.image}`
                  : FALLBACK_IMAGE;

                return (
                  <div
                    key={placeId}
                    onClick={() => handleDestinationClick(place)}
                    className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gray-900"
                  >
                    {/* Background Image with Zoom */}
                    <img
                      src={imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />

                    {/* Dark Gradient Overlay */}
                    <div
                      className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                      }}
                    />

                    {/* Top-Right Teal Corner Badge with Arrow (↗) on Hover */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#14b8a6] rounded-bl-3xl flex items-center justify-center text-white shadow-lg transform translate-x-2 -translate-y-2 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                      <FiArrowUpRight className="text-2xl stroke-2" />
                    </div>

                    {/* Top-Left Duration Badge (if provided) */}
                    {place.duration && (
                      <div className="absolute top-5 left-5 z-20">
                        <span className="bg-black/50 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1">
                          <FiClock className="text-[#14b8a6]" />
                          {place.duration}
                        </span>
                      </div>
                    )}

                    {/* Bottom Content */}
                    <div className="absolute bottom-7 left-6 right-6 z-10">
                      <h3 className="text-2xl font-bold text-white tracking-wide mb-1 transition-transform duration-300 group-hover:translate-x-1">
                        {place.name}
                      </h3>

                      {/* Location */}
                      {place.location && (
                        <p className="text-gray-200 text-xs sm:text-sm font-medium mb-3 flex items-center gap-1">
                          <FiMapPin className="text-[#14b8a6] shrink-0" />
                          <span>{place.location}</span>
                        </p>
                      )}

                      {/* Bottom Row: Category Pill Badge + Price */}
                      <div className="flex items-center justify-between">
                        <span className="inline-block bg-[#14b8a6] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
                          {place.category}
                        </span>

                        {place.price && (
                          <span className="text-white font-extrabold text-base">
                            ₹{place.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 mb-4">
                {/* Prev Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-[#14b8a6] hover:text-white shadow-sm border border-gray-200"
                  }`}
                >
                  <FiChevronLeft className="text-base" /> Prev
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-[#14b8a6] text-white shadow-md shadow-[#14b8a6]/25"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-[#14b8a6] hover:text-white shadow-sm border border-gray-200"
                  }`}
                >
                  Next <FiChevronRight className="text-base" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryDestinations;
