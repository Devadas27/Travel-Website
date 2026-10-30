import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCompass,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const CATEGORY_DEFAULT_IMAGES = {
  beach:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "hill station":
    "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=80",
  snowfall:
    "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=800&q=80",
  adventure:
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=800&q=80",
  wildlife:
    "https://images.unsplash.com/photo-1547448415-e9f5b28e570d?auto=format&fit=crop&w=800&q=80",
  heritage:
    "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?auto=format&fit=crop&w=800&q=80",
  historical:
    "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?auto=format&fit=crop&w=800&q=80",
  backwaters:
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
  "film city":
    "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80",
  zoo:
    "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";

const LatestBlog = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state: 3 cards per row, 3 cards per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = categories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getCategoryImageUrl = (cat) => {
    if (cat.image) {
      return cat.image.startsWith("http")
        ? cat.image
        : `http://localhost:5000${cat.image}`;
    }
    const key = cat.name ? cat.name.toLowerCase().trim() : "";
    return CATEGORY_DEFAULT_IMAGES[key] || DEFAULT_IMAGE;
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white py-20 px-6 sm:px-12 lg:px-20 overflow-hidden flex justify-center"
      style={{ marginTop: "100px" }}
    >
      {/* Balloon Floating Animation */}
      <style>{`
        @keyframes floatBalloonAnim {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-14px) rotate(2deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        .animate-moving-balloon {
          animation: floatBalloonAnim 4.5s ease-in-out infinite;
        }
      `}</style>

      {/* Top-Left Concentric Circle Doodle */}
      <div className="absolute top-8 left-6 sm:left-12 w-7 h-7 rounded-full border-2 border-[#14b8a6]/40 flex items-center justify-center pointer-events-none"
       
      >
        <div className="w-2 h-2 rounded-full border border-[#14b8a6]/60" />
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col items-center relative">
        {/* Moving Hot Air Balloon */}
        <div className="absolute top-2 left-2 sm:left-6 lg:left-12 pointer-events-none hidden sm:block">
          <svg
            width="170"
            height="130"
            viewBox="0 0 170 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            <path
              d="M 5 115 C 35 115, 65 105, 60 78 C 55 52, 35 60, 42 85 C 48 108, 90 102, 120 65"
              stroke="#a0aec0"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              fill="none"
            />

            <g
              className="animate-moving-balloon"
              style={{ transformOrigin: "125px 38px" }}
            >
              <path
                d="M 125 8 C 141 8, 153 20, 153 36 C 153 50, 139 65, 132 70 L 118 70 C 111 65, 97 50, 97 36 C 97 20, 109 8, 125 8 Z"
                stroke="#4a5568"
                strokeWidth="1.3"
                fill="#ffffff"
              />
              <path
                d="M 125 8 C 134 18, 140 32, 131 70"
                stroke="#a0aec0"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M 125 8 C 116 18, 110 32, 119 70"
                stroke="#a0aec0"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M 125 8 L 125 70"
                stroke="#a0aec0"
                strokeWidth="1"
                strokeDasharray="2 2"
                fill="none"
              />
              <line
                x1="120"
                y1="70"
                x2="122"
                y2="77"
                stroke="#4a5568"
                strokeWidth="1"
              />
              <line
                x1="130"
                y1="70"
                x2="128"
                y2="77"
                stroke="#4a5568"
                strokeWidth="1"
              />
              <rect
                x="120"
                y="77"
                width="10"
                height="7"
                rx="1"
                stroke="#4a5568"
                strokeWidth="1"
                fill="#f7fafc"
              />
            </g>
          </svg>
        </div>

        {/* Section Header */}
        <div className="text-center flex flex-col items-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span
              style={{ fontFamily: "'Caveat', cursive" }}
              className="text-[#14b8a6] text-3xl sm:text-4xl font-bold tracking-wide"
            >
              Categories
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

          <h2
            className="text-4xl sm:text-5xl font-black text-[#1e2329] tracking-tight mb-3"
            style={{ marginTop: "20px" }}
          >
            Explore Our Categories
          </h2>

          <p
            className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto"
            style={{ marginTop: "20px", fontSize: "20px" }}
          >
            content of a page when looking at layout the point of using lorem the
            is Ipsum less
          </p>
        </div>

        {/* Categories Cards Grid */}
        <div
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center"
          style={{ marginTop: "30px", marginBottom: "50px" }}
        >
          {loading ? (
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-full rounded-3xl bg-gray-100 animate-pulse"
                style={{ minHeight: "475px" }}
              />
            ))
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="text-lg font-semibold">No categories found.</p>
              <p className="text-sm">
                Add categories in the Admin Panel to display them here.
              </p>
            </div>
          ) : (
            currentCategories.map((cat) => {
              const catId = cat._id || cat.id || cat.name;
              const imageUrl = getCategoryImageUrl(cat);

              return (
                <div
                  key={catId}
                  onClick={() =>
                    navigate(`/category/${encodeURIComponent(cat.name)}`)
                  }
                  className="group relative w-full rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer bg-[#1e2329]"
                  style={{ minHeight: "475px" }}
                >
                  {/* Full Background Photo */}
                  <img
                    src={imageUrl}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGE;
                    }}
                  />

                  {/* Bottom Dark Gradient Shadow for Contrast */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 32%, rgba(0, 0, 0, 0) 65%)",
                    }}
                  />

                  {/* Card Content: Explicit 28px padding all around */}
                  <div
                    className="absolute bottom-0 left-0 right-0 flex flex-col justify-end"
                    style={{ padding: "0 28px 28px 28px" }}
                  >
                    {/* Category Title */}
                    <h3
                      className="text-white font-bold group-hover:text-[#14b8a6] transition-colors duration-300"
                      style={{
                        fontSize: "22px",
                        lineHeight: "1.3",
                        marginBottom: "12px",
                        maxWidth: "280px",
                      }}
                    >
                      {cat.name}
                    </h3>

                    {/* Metadata Row: Explore Destinations | View All -> */}
                    <div
                      className="flex items-center text-gray-200"
                      style={{ fontSize: "13px" }}
                    >
                      {/* Compass Icon + Label */}
                      <div className="flex items-center gap-1.5">
                        <FiCompass
                          style={{ color: "#14b8a6", fontSize: "16px" }}
                        />
                        <span className="font-medium text-white">
                          Explore Destinations
                        </span>
                      </div>

                      {/* Divider */}
                      <span
                        className="text-gray-400"
                        style={{ margin: "0 10px" }}
                      >
                        |
                      </span>

                      {/* Action Link */}
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-[#14b8a6] group-hover:underline flex items-center gap-1">
                          View All
                          <FiArrowRight className="inline-block transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination: 3 cards per row, 3 cards per page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 mb-10">
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
      </div>
    </section>
  );
};

export default LatestBlog;