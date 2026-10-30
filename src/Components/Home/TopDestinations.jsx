import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiMapPin, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const API_BASE_URL = "http://localhost:5000/api/tourist-places";
const BACKEND_BASE_URL = "http://localhost:5000";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";

const TopDestinations = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state: 3 cards per row, 3 cards per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Fetch tourist places from backend API
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_BASE_URL);
        if (!res.ok) {
          throw new Error("Failed to fetch tourist places");
        }
        const data = await res.json();
        // Show active places or all places from backend
        const activePlaces = data.filter((p) => p.status !== "Inactive");
        setPlaces(activePlaces.length > 0 ? activePlaces : data);
      } catch (err) {
        console.error("Error loading tourist destinations:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleDestinationClick = (place) => {
    navigate(`/tours?destination=${encodeURIComponent(place.name)}`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(places.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPlaces = places.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    // 1. Outer Section: Centered with equal left-right padding
    <section ref={sectionRef} className="w-full bg-white py-16 px-4 sm:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* 2. Headings: Perfectly Centered */}
        <div className="text-center flex flex-col items-center max-w-2xl mx-auto mb-12">
          {/* Script Subtitle with 3 Green Sprouts */}
          <div className="inline-flex items-center gap-1.5 mb-1">
            <span
              style={{ fontFamily: "'Caveat', cursive" }}
              className="text-[#14b8a6] text-3xl sm:text-4xl font-bold tracking-wide"
            >
              Destinations
            </span>
            {/* 3 Green Sprouts SVG from Template */}
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

          {/* Main Title: Explore Our Tourist Destinations */}
          <h2
            className="text-4xl sm:text-5xl font-black text-[#1e2329] tracking-tight mb-3"
            style={{ marginTop: "20px" }}
          >
            Explore Our Tourist Destinations
          </h2>

          {/* Subtitle Description */}
          <p
            className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
            style={{ marginTop: "20px", fontSize: "19px", lineHeight: "30px" }}
          >
            Explore the world's most iconic places with handpicked itineraries,
            top-rated tours, and unforgettable travel memories.
          </p>
        </div>

        {/* 3. Loading State */}
        {loading ? (
          <div
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
            style={{ marginTop: "50px", marginBottom: "30px" }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-85 rounded-3xl bg-gray-100 animate-pulse flex flex-col justify-end p-7"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-7 bg-[#14b8a6]/20 rounded-full w-24"></div>
              </div>
            ))}
          </div>
        ) : places.length === 0 ? (
          /* Empty State if no places in database */
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-semibold mb-1">No tourist destinations found.</p>
            <p className="text-sm">Add tourist places from the Admin Panel to display them here.</p>
          </div>
        ) : (
          <>
            {/* 4. Cards Grid: 3 cards in a row */}
            <div
              className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
              style={{ marginTop: "50px", marginBottom: "30px" }}
            >
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
                    {/* Image with 1.1x Zoom on Hover */}
                    <img
                      src={imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />

                    {/* Dark Gradient Overlay for text readability */}
                    <div
                      className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)",
                      }}
                    />

                    {/* Top-Right Teal Corner Badge with Arrow (↗) on Hover */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#14b8a6] rounded-bl-3xl flex items-center justify-center text-white shadow-lg transform translate-x-2 -translate-y-2 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                      <FiArrowUpRight className="text-2xl stroke-2" />
                    </div>

                    {/* Top-Left Duration Badge (if provided) */}
                    {place.duration && (
                      <div className="absolute top-5 left-5 z-20">
                        <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 shadow-sm">
                          ⏱️ {place.duration}
                        </span>
                      </div>
                    )}

                    {/* Bottom Content: Generous Inner Padding */}
                    <div className="absolute bottom-7 left-6 right-6 z-10">
                      <h3 className="text-2xl font-bold text-white tracking-wide mb-1 transition-transform duration-300 group-hover:translate-x-1">
                        {place.name}
                      </h3>

                      {/* Location */}
                      {place.location && (
                        <p className="text-gray-200 text-xs sm:text-sm font-medium mb-2.5 flex items-center gap-1">
                          <FiMapPin className="text-[#14b8a6] shrink-0" />
                          <span>{place.location}</span>
                        </p>
                      )}

                      {/* Teal Pill Badge + Price */}
                      <div className="flex items-center justify-between">
                        <span className="inline-block bg-[#14b8a6] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                          {place.category || "Destination"}
                        </span>

                        {place.price && (
                          <span className="text-white font-extrabold text-sm">
                            ₹{place.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 5. Pagination: 3 cards per row, remaining in next page */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
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
                ))}

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
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
    </section>
  );
};

export default TopDestinations;
