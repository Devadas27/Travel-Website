import React, { useEffect } from "react";
import { FiX, FiArrowRight } from "react-icons/fi";

/**
 * CustomAlert Component
 * Modern, responsive travel-themed success alert popup.
 * Matches Wanderly's UI with mint checkmark, airplane motif, sparkles,
 * and emerald/teal gradient Continue button.
 */
const CustomAlert = ({
  isOpen,
  onClose,
  title = "You’re all set!",
  message,
  buttonText = "Continue",
}) => {
  // Close the alert when the Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // If not open, don't render anything to the DOM
  if (!isOpen) return null;

  // Format message: highlights dynamic email if present
  const renderMessageContent = () => {
    if (typeof message === "string" && message.includes("Subscribed with:")) {
      const parts = message.split("Subscribed with:");
      return (
        <p className="text-gray-500 text-[14px] sm:text-[15px] leading-relaxed mb-6">
          Subscribed with:{" "}
          <span className="font-semibold text-gray-800 break-all">
            {parts[1]?.trim()}
          </span>
        </p>
      );
    }
    return (
      <div className="text-gray-600 text-[14px] sm:text-[15px] leading-relaxed mb-6 break-words">
        {message}
      </div>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        // Close if user clicks the semi-transparent backdrop overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Smooth entrance animation */}
      <style>{`
        @keyframes customAlertPop {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-custom-alert {
          animation: customAlertPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Modal Card */}
      <div className="animate-custom-alert relative w-full max-w-[340px] sm:max-w-[370px] bg-white rounded-[32px] shadow-2xl pt-7 pb-8 px-6 text-center mx-auto border border-gray-100/80">
        
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close alert"
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition p-1 cursor-pointer focus:outline-none"
        >
          <FiX className="text-xl" />
        </button>

        {/* Top Graphic: Mint circle, checkmark, airplane with trail & sparkles */}
        <div className="relative w-44 h-34 mx-auto flex items-center justify-center mb-1">
          <svg
            viewBox="0 0 170 135"
            className="w-full h-full overflow-visible select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dashed Flight Trail */}
            <path
              d="M 72 36 C 96 22, 122 28, 131 46"
              fill="none"
              stroke="#a2e7df"
              strokeWidth="1.8"
              strokeDasharray="2.5 3.5"
            />

            {/* Center Pastel Mint Circle */}
            <circle cx="85" cy="70" r="43" fill="#DFF6F3" />

            {/* Bold Rounded Checkmark */}
            <path
              d="M 69 70 L 81 82 L 102 59"
              fill="none"
              stroke="#03AF9D"
              strokeWidth="6.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Flying Airplane (Top-Right) */}
            <g transform="translate(133, 43) rotate(42) scale(0.95)">
              <path
                d="M0,-14 C1.5,-14 2.5,-12 2.5,-8 L2.5,-2 L12,4 L12,6.5 L2.5,4.5 L2.5,9.5 L5.5,12 L5.5,13.5 L0,12.5 L-5.5,13.5 L-5.5,12 L-2.5,9.5 L-2.5,4.5 L-12,6.5 L-12,4 L-2.5,-2 L-2.5,-8 C-2.5,-12 -1.5,-14 0,-14 Z"
                fill="#62d6c6"
              />
            </g>

            {/* 4-point Sparkle Stars */}
            {/* 1. Top-Left Sparkle */}
            <g transform="translate(38, 36) scale(0.75)">
              <path
                d="M 0,-10 C 0,-3 3,0 10,0 C 3,0 0,3 0,10 C 0,3 -3,0 -10,0 C -3,0 0,-3 0,-10 Z"
                fill="#9fe4dc"
              />
            </g>

            {/* 2. Mid-Left Sparkle */}
            <g transform="translate(28, 74) scale(0.6)">
              <path
                d="M 0,-10 C 0,-3 3,0 10,0 C 3,0 0,3 0,10 C 0,3 -3,0 -10,0 C -3,0 0,-3 0,-10 Z"
                fill="#9fe4dc"
              />
            </g>

            {/* 3. Lower-Left Sparkle */}
            <g transform="translate(43, 102) scale(0.45)">
              <path
                d="M 0,-10 C 0,-3 3,0 10,0 C 3,0 0,3 0,10 C 0,3 -3,0 -10,0 C -3,0 0,-3 0,-10 Z"
                fill="#9fe4dc"
              />
            </g>

            {/* 4. Top Small Sparkle */}
            <g transform="translate(118, 27) scale(0.35)">
              <path
                d="M 0,-10 C 0,-3 3,0 10,0 C 3,0 0,3 0,10 C 0,3 -3,0 -10,0 C -3,0 0,-3 0,-10 Z"
                fill="#9fe4dc"
              />
            </g>

            {/* 5. Bottom-Right Sparkle */}
            <g transform="translate(132, 92) scale(0.6)">
              <path
                d="M 0,-10 C 0,-3 3,0 10,0 C 3,0 0,3 0,10 C 0,3 -3,0 -10,0 C -3,0 0,-3 0,-10 Z"
                fill="#9fe4dc"
              />
            </g>

            {/* 6. Subtle Tiny Dots */}
            <circle cx="127" cy="74" r="1.5" fill="#a2e7df" />
            <circle cx="70" cy="24" r="1.5" fill="#a2e7df" />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-[25px] sm:text-[27px] font-bold text-[#1f2937] tracking-tight mb-2">
          {title}
        </h3>

        {/* Subtitle / Email Message */}
        {renderMessageContent()}

        {/* Action Button: Gradient Pill with 'Continue →' */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full max-w-[220px] py-3.5 px-6 rounded-full font-bold text-white text-[15px] sm:text-[16px] shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 active:scale-98"
            style={{
              background: "linear-gradient(90deg, #01ACA8 0%, #01BEA3 100%)",
            }}
          >
            <span>{buttonText}</span>
            <FiArrowRight className="text-lg stroke-[2.5]" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CustomAlert;
