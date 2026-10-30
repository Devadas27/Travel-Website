import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiPhone,
  FiSend,
  FiHelpCircle,
  FiCheckCircle,
} from "react-icons/fi";
import skyLine from "../assets/skyline.png.jpg";
import contactTraveler from "../assets/contact-traveler.png";
import Footer from "../Components/Home/Footer";
import ScrollToTop from "../Components/Common/ScrollToTop";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 4000);
  };

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
        <div className="text-center relative z-10 mb-8 sm:mb-12 flex flex-col items-center">
          <h1
            className="text-4xl sm:text-5xl font-black text-black/20 tracking-tight mb-3"
            style={{ marginTop: "50px" }}
          >
            Contact Us
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
      {/* 2. 4 CONTACT DETAILS CARDS (Perfect Center Alignment)   */}
      {/* ======================================================== */}
      <section className="w-full flex justify-center px-4 -mt-8 sm:-mt-12 relative z-20">
        <div
          className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 overflow-hidden"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          {/* Card 1: Office Address */}
          <div
            style={{ padding: "20px" }}
            className="p-8 flex flex-col items-center text-center justify-between relative group hover:bg-gray-50/50 transition"
          >
            <div className="p-1 border border-dashed border-[#14b8a6] rounded-2xl mb-4 group-hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-[#14b8a6] text-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                <FiMapPin />
              </div>
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-2">
              Office Address
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              3517 W. Gray St. Utica,
              <br />
              Pennsylvania 57867
            </p>
          </div>

          {/* Card 2: Phone Number */}
          <div
            style={{ padding: "20px" }}
            className="p-8 flex flex-col items-center text-center justify-between relative group hover:bg-gray-50/50 transition"
          >
            <div className="p-1 border border-dashed border-[#14b8a6] rounded-2xl mb-4 group-hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-[#14b8a6] text-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                <FiPhone />
              </div>
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-2">
              Phone Number
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              356 9999 8888
              <br />
              458 6666 3333
            </p>
          </div>

          {/* Card 3: Email Address */}
          <div
            style={{ padding: "20px" }}
            className="p-8 flex flex-col items-center text-center justify-between relative group hover:bg-gray-50/50 transition"
          >
            <div className="p-1 border border-dashed border-[#14b8a6] rounded-2xl mb-4 group-hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-[#14b8a6] text-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                <FiSend />
              </div>
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-2">
              Email Address
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              example@gmail.com
              <br />
              yourmail@gmail.com
            </p>
          </div>

          {/* Card 4: Supports */}
          <div
            style={{ padding: "20px" }}
            className="p-8 flex flex-col items-center text-center justify-between relative group hover:bg-gray-50/50 transition"
          >
            <div className="p-1 border border-dashed border-[#14b8a6] rounded-2xl mb-4 group-hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-[#14b8a6] text-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                <FiHelpCircle />
              </div>
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg mb-2">
              Supports
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              24/7 any time support team
              <br />
              ready for supports.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. GET IN TOUCH SECTION (Balanced & Centered)           */}
      {/* ======================================================== */}
      <section className="w-full flex justify-center py-16 sm:py-20 px-4 sm:px-6">
        <div
          className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          style={{ marginLeft: "auto", marginRight: "auto", marginTop: "50px" }}
        >
          {/* Left Column: Traveler Graphic */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <img
              src={contactTraveler}
              alt="Wanderly Traveler"
              className="w-full max-w-sm sm:max-w-md object-contain"
            />
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-2 flex items-center gap-2">
              <span
                style={{ fontFamily: "'Caveat', cursive" }}
                className="text-[#14b8a6] text-3xl font-bold tracking-wide"
              >
                Contact Us
              </span>
              <span className="text-[#14b8a6] text-xl">🌿</span>
            </div>

            <h2
              style={{ marginTop: "10px" }}
              className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-8"
            >
              Get In Touch
            </h2>

            {submitted && (
              <div     style={{ marginTop: "10px" }} className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-[#14b8a6] flex items-center gap-3 text-sm font-semibold">
                <FiCheckCircle className="text-xl shrink-0" />
                <span>Thank you! Your message has been sent successfully.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                style={{ marginTop: "10px" }}
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Full Name
                  </label>
                  <input
                    style={{ marginTop: "10px", padding: "10px" }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter name"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Email
                  </label>
                  <input
                    style={{ marginTop: "10px", padding: "10px" }}
                    style={{ marginTop: "10px", padding: "10px" }}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition"
                  />
                </div>
              </div>

              <div>
                <label
                  style={{ marginTop: "10px" }}
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Message
                </label>
                <textarea
                  style={{ marginTop: "10px", padding: "10px" }}
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write Message"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#14b8a6] focus:ring-1 focus:ring-[#14b8a6] transition resize-none"
                />
              </div>

              <div>
                <button
                  style={{ marginTop: "10px", padding: "10px" , marginBottom:'10px'}}
                  type="submit"
                  className="px-8 py-3.5 bg-[#14b8a6] hover:bg-[#0da291] text-white font-bold rounded-lg transition duration-200 shadow-sm cursor-pointer"
                >
                  Send Messages
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FULL-WIDTH GOOGLE MAP                                 */}
      {/* ======================================================== */}
      <section className="w-full h-96 sm:h-[450px] overflow-hidden border-t border-b border-gray-100">
        <iframe
          title="Office Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105634.33128919632!2d-118.88941783309997!3d34.14811654407889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e8248c8b67f1b7%3A0xb3cf51a1795c345a!2sCostco%20Wholesale!5e0!3m2!1sen!2sus!4v1714000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full grayscale hover:grayscale-0 transition duration-500"
        />
      </section>

      {/* ======================================================== */}
      {/* 5. FLOATING SCROLL TO TOP & WEBPAGE FOOTER               */}
      {/* ======================================================== */}
      <ScrollToTop />
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
