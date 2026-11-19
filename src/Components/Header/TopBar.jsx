import React from "react";
import { FiMapPin, FiMail, FiClock } from "react-icons/fi";

const TopBar = () => {
  return (
    <div className="w-full bg-[#212529] text-gray-400 text-xs sm:text-[13px] min-h-[44px] h-auto px-4 sm:px-6 lg:px-12 py-2.5 sm:py-2.5 border-b border-gray-800/60 flex items-center justify-center select-none">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 sm:gap-4 text-center">
        {/* Left: Location & Email */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 lg:ml-8 text-center">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 sm:bg-transparent rounded-full sm:rounded-none">
            <FiMapPin className="text-[#14b8a6] text-xs sm:text-sm shrink-0" />
            <span className="text-gray-300 hover:text-white transition cursor-default text-[11px] sm:text-xs">
              Delaware 10299
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 sm:bg-transparent rounded-full sm:rounded-none">
            <FiMail className="text-[#14b8a6] text-xs sm:text-sm shrink-0" />
            <a
              href="mailto:exam126@gmail.com"
              className="text-gray-300 hover:text-white transition text-[11px] sm:text-xs"
            >
              exam126@gmail.com
            </a>
          </div>
        </div>

        {/* Right: Working Hours */}
        <div className="flex items-center justify-center gap-1.5 px-2.5 py-1 bg-white/5 sm:bg-transparent rounded-full sm:rounded-none text-center">
          <FiClock className="text-[#14b8a6] text-xs sm:text-sm shrink-0" />
          <span className="text-gray-300 text-[11px] sm:text-xs">
            9:00am - 10:00pm
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
