import React from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiArrowUpRight } from "react-icons/fi";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { FaSignsPost } from "react-icons/fa6";

const WhyChooseUs = ({ style }) => {
  return (
    <section
      className="w-full bg-[#fbfcfb] py-20 px-4 sm:px-8 lg:px-16 overflow-hidden flex justify-center"
      style={style || { marginTop: "100px", marginBottom: "100px" }}
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* ================= LEFT COLUMN: Photo Collage & Floating Elements ================= */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          {/* 1. Background Dashed Accent Border */}
          <div className="absolute -top-6 -right-2 sm:right-6 w-72 sm:w-80 h-96 border-2 border-dashed border-[#14b8a6]/50 rounded-3xl pointer-events-none hidden sm:block" />

          {/* 2. Main Traveler Image Card */}
          <div
            style={{ height: "480px" }}
            className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl z-10"
          >
            <img
              src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80"
              alt="Adventurer Traveler"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 3. Overlapping Circular Coastal Image (Smooth Floating Animation) */}
          <div className="absolute -right-2 sm:right-0 top-24 w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl z-20 animate-float">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80"
              alt="Coastal Traveler"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 4. Floating 'Trusted by' Badge (Static - No Moving) */}
          <div className="absolute -left-3 sm:-left-6 bottom-28 bg-white py-3 px-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-30">
            <div className="w-10 h-10 rounded-full bg-[#14b8a6] text-white flex items-center justify-center text-lg font-bold shrink-0">
              <FiCheck className="stroke-2" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">
                Trusted by
              </p>
              <p className="text-xs text-gray-500">Trustpilot &amp; rating</p>
            </div>
          </div>
          {/* 5. Bottom Right Teal Circle with Arrow (↗) (Floating Animation) */}
          {/* 5. Bottom Right Teal Circle with Arrow (Static Perfect Round + Hover Rotate) */}
          <div className="absolute -right-2 sm:right-8 -bottom-4 w-20 h-20 rounded-full shrink-0 aspect-square bg-[#14b8a6] border-4 border-white flex items-center justify-center text-white shadow-xl z-30 cursor-pointer group/arrow">
            {/* Inner Dashed Round Border (Hover cheyyumbo 45 degree rotate aakum) */}
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/70 flex items-center justify-center transition-transform duration-500 group-hover/arrow:rotate-45">
              <FiArrowUpRight className="text-3xl stroke-2" />
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Content, Features & Counter ================= */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          {/* Subheading: 'Why we are' in script + 3 Green Sprouts */}
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span
              style={{ fontFamily: "'Caveat', cursive" }}
              className="text-[#14b8a6] text-3xl font-bold tracking-wide"
            >
              Why we are
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

          {/* Main Title */}
          <h2 className="text-4xl sm:text-5xl font-black text-[#1e2329] tracking-tight mb-4 leading-tight">
            Why Choose Us
          </h2>

          {/* Description */}
          <p
            className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-lg"
            style={{ fontSize: "20px", marginTop: "20px" }}
          >
            We curate seamless, authentic, and tailor-made travel experiences
            worldwide. From handpicked stays to expert local guides, we make
            every adventure extraordinary.
          </p>

          {/* Feature List */}
          <div className="space-y-6 mb-10">
            {/* Feature 1: Personalized Trips (Floating Icon) */}
            <div
              className="flex items-start gap-4 group cursor-pointer"
              style={{ marginTop: "40px" }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#14b8a6] text-white flex items-center justify-center text-2xl shrink-0 shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 animate-float">
                <BiBriefcaseAlt2 />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1e2329] mb-1 group-hover:text-[#14b8a6] transition-colors">
                  Personalized Trips
                </h3>
                <p
                  className="text-gray-500 text-sm leading-relaxed max-w-md"
                  style={{ fontSize: "18px" }}
                >
                  Custom itineraries crafted around your preferences, budget,
                  and travel dreams for a truly personal journey.
                </p>
              </div>
            </div>

            {/* Feature 2: Trusted Travel Guide (Floating Icon Delayed) */}
            <div
              className="flex items-start gap-4 group cursor-pointer"
              style={{ marginTop: "40px" }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#14b8a6] text-white flex items-center justify-center text-2xl shrink-0 shadow-md shadow-teal-500/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 animate-float-delayed">
                <FaSignsPost />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1e2329] mb-1 group-hover:text-[#14b8a6] transition-colors">
                  Trusted Travel Guide
                </h3>
                <p
                  className="text-gray-500 text-sm leading-relaxed max-w-md"
                  style={{ fontSize: "18px" }}
                >
                  Passionate, verified local tour guides dedicated to showing
                  you hidden gems and genuine cultural experiences safely.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Actions: 'Start Booking' Button + 18k+ Travellers Counter */}
          <div
            className="flex flex-wrap items-center gap-6 sm:gap-8 pt-2"
            style={{ marginTop: "50px" }}
          >
            {/* Start Booking Button */}
            <Link
              to="/tours"
              className="bg-[#14b8a6] hover:bg-[#0da291] text-white font-bold text-sm px-8 py-4 rounded-full transition shadow-lg shadow-teal-600/20 hover:scale-105 flex items-center justify-center"
              style={{
                width: "180px",
                height: "55px",
                fontSize: "20px",
              }}
            >
              Start Booking
            </Link>
            {/* Customer Avatars & Counter */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3 overflow-hidden">
                <img
                  className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Customer 1"
                />
                <img
                  className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Customer 2"
                />
                <img
                  className="inline-block h-11 w-11 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
                  alt="Customer 3"
                />
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ccfbf1] text-[#14b8a6] ring-2 ring-white font-black text-lg">
                  +
                </div>
              </div>

              <div>
                <p className="text-xl font-extrabold text-[#1e2329] leading-tight">
                  18k+
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Individual Traveller
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
