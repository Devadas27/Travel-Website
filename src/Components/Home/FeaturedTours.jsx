import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const API_BASE_URL = "http://localhost:5000/api/tourist-packages";
const BACKEND_BASE_URL = "http://localhost:5000";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";

const FeaturedTours = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state: 3 cards per row, 3 cards per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Fetch tourist packages from backend API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_BASE_URL);
        if (!res.ok) {
          throw new Error("Failed to fetch tourist packages");
        }
        const data = await res.json();
        // Show active packages or all packages
        const activePackages = data.filter((p) => p.status !== "Inactive");
        setPackages(activePackages.length > 0 ? activePackages : data);
      } catch (err) {
        console.error("Error loading tourist packages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handlePackageClick = (pkg) => {
    const pkgId = pkg._id || pkg.id;
    navigate(`/tours/${pkgId}`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(packages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPackages = packages.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section ref={sectionRef} className="w-full bg-white py-20 px-4 sm:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* 1. Headings: Perfectly Centered */}
        <div className="text-center flex flex-col items-center max-w-2xl mx-auto mb-14">
          {/* Subheading in script font with 3 Green Sprouts */}
          <div className="inline-flex items-center gap-1.5 mb-1">
            <span
              style={{ fontFamily: "'Caveat', cursive" }}
              className="text-[#14b8a6] text-3xl sm:text-4xl font-bold tracking-wide"
            >
              Featured Tours
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

          {/* Main Title: Popular Tourist Packages */}
          <h2 className="text-4xl sm:text-5xl font-black text-[#1e2329] tracking-tight mb-3">
            Popular Tourist Packages
          </h2>

          {/* Subtitle Description */}
          <p
            className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto"
            style={{ marginTop: "30px", fontSize: "20px" }}
          >
            Discover our handpicked, highest-rated tour packages offering
            exceptional travel itineraries, breathtaking scenery, and unbeatable
            value.
          </p>
        </div>

        {/* 2. Loading State */}
        {loading ? (
          <div
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
            style={{ marginTop: "50px" }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{ height: "460px" }}
                className="rounded-3xl bg-gray-100 animate-pulse flex flex-col justify-end p-8"
              >
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-3"></div>
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          /* Empty State if no packages in database */
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-semibold mb-1">No tourist packages found.</p>
            <p className="text-sm">
              Add tourist packages from the Admin Panel to display them here.
            </p>
          </div>
        ) : (
          <>
            {/* 3. Cards Grid: 3 Cards in a Row */}
            <div
              className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
              style={{ marginTop: "50px" }}
            >
              {currentPackages.map((pkg) => {
                const pkgId = pkg._id || pkg.id;
                const imageUrl = pkg.image
                  ? pkg.image.startsWith("http")
                    ? pkg.image
                    : `${BACKEND_BASE_URL}${pkg.image}`
                  : FALLBACK_IMAGE;

                const hasDiscount =
                  pkg.discountPrice &&
                  pkg.discountPrice > 0 &&
                  pkg.discountPrice < pkg.price;

                const discountPercent = hasDiscount
                  ? Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100) +
                    "% off"
                  : pkg.isFeatured
                  ? "★ Featured"
                  : null;

                return (
                  <div
                    key={pkgId}
                    onClick={() => handlePackageClick(pkg)}
                    style={{ height: "460px" }}
                    className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gray-900"
                  >
                    {/* Background Image with Smooth 1.1x Zoom on Hover */}
                    <img
                      src={imageUrl}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />

                    {/* Top-Left Yellow Discount / Featured Badge */}
                    {discountPercent && (
                      <div className="absolute top-5 left-5 z-20">
                        <span className="bg-amber-400 text-gray-900 text-xs font-extrabold px-3.5 py-1.5 rounded-lg shadow-md">
                          {discountPercent}
                        </span>
                      </div>
                    )}

                    {/* Dark Gradient Overlay for Text Readability */}
                    <div
                      className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)",
                      }}
                    />

                    {/* Bottom Content Area */}
                    <div className="absolute bottom-6 left-6 right-6 z-10">
                      {/* Category Tag */}
                      <div className="mb-2">
                        <span className="bg-[#14b8a6] text-white text-[11px] font-extrabold px-3 py-1 rounded-md shadow-sm">
                          {pkg.category || "Tour Package"}
                        </span>
                      </div>

                      {/* Price Display */}
                      <div className="mb-2 flex items-baseline gap-2">
                        {hasDiscount ? (
                          <>
                            <span className="text-3xl font-black text-white tracking-tight">
                              ₹{pkg.discountPrice}
                            </span>
                            <span className="text-sm font-semibold text-gray-300 line-through">
                              ₹{pkg.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl font-black text-white tracking-tight">
                            ₹{pkg.price}
                          </span>
                        )}
                      </div>

                      {/* Package Title */}
                      <h3 className="text-2xl font-black text-white tracking-wide mb-3 transition-transform duration-300 group-hover:translate-x-1">
                        {pkg.title}
                      </h3>

                      {/* Meta Row: Duration + Group Size + Location */}
                      <div className="flex items-center gap-2.5 text-xs text-white/90 font-medium flex-wrap">
                        {/* Duration Badge */}
                        {pkg.duration && (
                          <span className="bg-[#14b8a6] text-white font-bold px-2 py-0.5 rounded text-[11px]">
                            ⏱️ {pkg.duration}
                          </span>
                        )}

                        {/* Group Size */}
                        {pkg.groupSize && (
                          <span className="text-white font-semibold">
                            👥 {pkg.groupSize}
                          </span>
                        )}

                        <span className="text-white/40">|</span>

                        {/* Location with Pin Icon */}
                        <div className="flex items-center gap-1 text-white font-semibold">
                          <FiMapPin className="text-[#14b8a6] text-sm shrink-0" />
                          <span>{pkg.destination}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4. Pagination: 3 cards per row, remaining in next page */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
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

export default FeaturedTours;
