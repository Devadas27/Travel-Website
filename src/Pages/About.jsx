import React from "react";
import { Link } from "react-router-dom";
import skyLine from "../assets/skyline.png.jpg";
import WhyChooseUs from "../Components/Home/WhyChooseUs";
import Footer from "../Components/Home/Footer";
import ScrollToTop from "../Components/Common/ScrollToTop";

const About = () => {
  return (
    <div className="w-full min-h-screen bg-white select-none flex flex-col items-center">
      {/* ======================================================== */}
      {/* 1. HERO BANNER WITH MOVING SKYLINE, PLANE & BALLOON      */}
      {/* ======================================================== */}
      <section className="relative w-full bg-[#f8fafc] pt-20 pb-12 px-4 overflow-hidden flex flex-col items-center justify-center">
        {/* Moving Airplane Doodle */}
        <div className="absolute left-8 sm:left-16 md:left-24 top-10 opacity-30 pointer-events-none select-none animate-float">
          <svg
            width="75"
            height="75"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#222"
            strokeWidth="1.2"
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>

        {/* Cloud Doodle (Top Left) */}
        <div className="hidden sm:block absolute left-24 md:left-44 top-6 opacity-25 pointer-events-none select-none">
          <svg
            width="45"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="1.2"
          >
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          </svg>
        </div>

        {/* Cloud Doodle (Top Right) */}
        <div className="hidden sm:block absolute right-24 md:right-44 top-6 opacity-25 pointer-events-none select-none">
          <svg
            width="45"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="1.2"
          >
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          </svg>
        </div>

        {/* Moving Hot Air Balloon Doodle */}
        <div className="absolute right-8 sm:right-16 md:right-24 top-12 opacity-35 pointer-events-none select-none animate-float-delayed">
          <svg
            width="65"
            height="85"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="1.2"
          >
            <ellipse cx="12" cy="9" rx="7" ry="8" />
            <path d="M8 17h8l-2 4h-4z" />
            <line
              x1="9"
              y1="17"
              x2="10"
              y2="21"
              stroke="#333"
              strokeWidth="1"
            />
            <line
              x1="15"
              y1="17"
              x2="14"
              y2="21"
              stroke="#333"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Title and Breadcrumbs */}
        <div
          style={{ marginTop: "50px" }}
          className="text-center relative z-10 mb-8 sm:mb-12 flex flex-col items-center"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 text-black/20">
            About Us
          </h1>
        </div>

        {/* Moving Left-Right Skyline Background Image */}
        <div className="w-full overflow-hidden opacity-25 pointer-events-none select-none flex justify-center -mb-4">
          <img
            src={skyLine}
            alt="Skyline"
            className="w-[115%] max-w-none h-20 sm:h-24 object-cover animate-skyline"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. WHY CHOOSE US SECTION                                 */}
      {/* ======================================================== */}
      <div className="w-full">
        <WhyChooseUs style={{ marginTop: "40px", marginBottom: "60px" }} />
      </div>

      {/* ======================================================== */}
      {/* 3. FLOATING SCROLL TO TOP & WEBPAGE FOOTER               */}
      {/* ======================================================== */}
      <ScrollToTop />
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default About;
