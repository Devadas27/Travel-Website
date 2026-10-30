import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

// 6 Exact Photos matching Template Our Gallery
const galleryThumbs = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80", // 1. Pink dress cliff
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80", // 2. Couple walking street
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=300&q=80", // 3. Couple looking at map
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=300&q=80", // 4. Family at airport
  "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=300&q=80", // 5. Couple sunglasses
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80", // 6. Hiker mountain
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer
      className="w-full text-white flex flex-col items-center px-4 sm:px-8 lg:px-12"
      style={{ backgroundColor: "#061814", marginTop: "80px" }}
    >
      {/* 1. Newsletter Banner Portion (Height kootti, Padding koduthu, N-te aduthulla color ozhivakki) */}
      <div className="w-full max-w-6xl mx-auto pt-14 pb-4">
        <div
          className="w-full bg-[#f4f7f6] flex flex-col lg:flex-row items-center justify-between gap-8 shadow-md"
          style={{
            borderRadius: "0px",
            minHeight: "210px",
            padding: "30px 40px",
          }}
        >
          {/* Left: Newsletter Heading with clean breathing room */}
          <div className="flex flex-col items-start text-left w-full lg:w-auto">
            <div className="inline-flex items-center gap-2 mb-2">
              <h3
                className="font-black text-gray-900 tracking-tight"
                style={{ fontSize: "37px", lineHeight: "1.2" }}
              >
                Get Updated The Latest
              </h3>
              {/* 3-leaf teal doodle */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#14b8a6"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="mb-2 shrink-0"
              >
                <line x1="12" y1="4" x2="12" y2="11" />
                <line x1="5" y1="7" x2="10" y2="12" />
                <line x1="19" y1="7" x2="14" y2="12" />
              </svg>
            </div>
            <h3
              className="font-black text-gray-900 tracking-tight"
              style={{ fontSize: "32px", lineHeight: "1.2" }}
            >
              Newsletter
            </h3>
          </div>

          {/* Right: Email Input Pill Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full lg:w-auto flex-1 max-w-xl bg-white rounded-full p-2 pl-6 flex items-center justify-between shadow-xs border border-gray-200"
            style={{ minHeight: "62px", padding: "10px" }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full bg-transparent text-gray-700 text-sm sm:text-base outline-none placeholder-gray-400 pr-3"
              required
            />
            <button
              type="submit"
              className="text-white font-bold text-sm sm:text-base rounded-full transition-all duration-300 shadow-sm whitespace-nowrap cursor-pointer hover:opacity-90 shrink-0"
              style={{
                backgroundColor: "#14b8a6",
                padding: "13px 32px",
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main 4-Column Footer Content */}
      <div
        className="w-full max-w-6xl mx-auto pt-14 pb-14"
        style={{ marginTop: "60px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand Logo & Description */}
          <div className="flex flex-col">
            {/* White Suitcase Icon + TravHub Typography */}
            <div className="flex items-center gap-3 mb-5">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="7" width="14" height="14" rx="2" />
                <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                <line x1="9" y1="11" x2="9" y2="17" />
                <line x1="15" y1="11" x2="15" y2="17" />
              </svg>
              <span
                className="text-3xl font-black tracking-tight text-white"
                style={{ fontSize: "35px" }}
              >
                Wanderly
              </span>
            </div>

            <p
              className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs"
              style={{ marginTop: "20px", fontSize: "18px" }}
            >
              Content of a page when looking at layout the point of using lorem
              the is Ipsum less when looking normal
            </p>

            {/* Social Media Buttons */}
            <div className="flex items-center gap-2" style={{marginTop:'20px'}}>
              <a
                href="#"
                aria-label="Facebook"
                className="w-8 h-8 rounded-md flex items-center justify-center text-gray-300 transition-colors duration-300 text-xs cursor-pointer"
                style={{ backgroundColor: "#122a24" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#14b8a6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#122a24")
                }
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 rounded-md flex items-center justify-center text-gray-300 transition-colors duration-300 text-xs cursor-pointer"
                style={{ backgroundColor: "#122a24" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#14b8a6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#122a24")
                }
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-md flex items-center justify-center text-gray-300 transition-colors duration-300 text-xs cursor-pointer"
                style={{ backgroundColor: "#122a24" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#14b8a6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#122a24")
                }
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-md flex items-center justify-center text-gray-300 transition-colors duration-300 text-xs cursor-pointer"
                style={{ backgroundColor: "#122a24" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#14b8a6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#122a24")
                }
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div className="flex flex-col">
            <h4
              className="text-white font-bold text-xl mb-6"
              style={{ fontSize: "25px" }}
            >
              Useful Links
            </h4>
            <ul className="space-y-3.5 text-sm text-gray-400" style={{fontSize:'18px' , marginTop:'20px'}}>
              <li>
                <a
                  href="#home"
                  className="hover:text-teal-400 transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-teal-400 transition-colors duration-200"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#destination"
                  className="hover:text-teal-400 transition-colors duration-200"
                >
                  Destination
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  className="hover:text-teal-400 transition-colors duration-200"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-teal-400 transition-colors duration-200"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-xl mb-6" style={{fontSize:'25px'}}>Legal</h4>
            <ul className="space-y-3.5 text-sm text-gray-400" style={{fontSize:'18px' , marginTop:'20px'}}>
              <li>
                <a
                  href="#terms"
                  className="hover:text-teal-400 transition-colors duration-200"
                >
                  Terms of use
                </a>
              </li>
              <li>
                <a
                  href="#conditions"
                  className="hover:text-teal-400 transition-colors duration-200"
                >
                  Terms & conditions
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="hover:text-teal-400 transition-colors duration-200"
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a
                  href="#cookies"
                  className="hover:text-teal-400 transition-colors duration-200"
                >
                  Cookie policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Our Gallery (3x2 Exact Squares) */}
          <div className="flex flex-col">
            <h4 className="text-white font-bold text-xl mb-6" style={{fontSize:'25px'}}>Our Gallery</h4>
            <div
              className="grid grid-cols-3 gap-2.5"
              style={{ maxWidth: "230px", marginTop:'20px' }}
            >
              {galleryThumbs.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative bg-gray-800"
                  style={{ width: "68px", height: "68px" }}
                >
                  <img
                    src={img}
                    alt={`Gallery thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500 ease-out"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright Bar */}
      <div
        className="w-full max-w-6xl mx-auto border-t text-center text-gray-400 text-sm py-8"
        style={{
          borderColor: "rgba(255, 255, 255, 0.08)", marginTop:'40px' , marginBottom:'50px'
        }}
      >
        <p style={{marginTop:'40px' , fontSize:'20px'}}>© Copyright 2026 by Wanderly HTML Template.</p>
      </div>
    </footer>
  );
};

export default Footer;
