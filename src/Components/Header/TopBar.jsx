import React from "react";
import { FiMapPin, FiMail, FiClock } from "react-icons/fi";

const TopBar = () => {
  return (
    <div className="w-full bg-[#212529] text-gray-400 text-xs sm:text-[13px] min-h-[48px] h-auto pt-5 sm:pt-2.5 pb-3 sm:pb-2.5 border-b border-gray-800/60 flex items-center justify-center px-4 sm:px-6 lg:px-12 select-none">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-1.5 sm:gap-4 text-center">
        {/* Left: Location & Email */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-8 lg:ml-8 text-center">
          <div className="hidden md:flex items-center gap-2">
            <FiMapPin className="text-[#14b8a6] text-sm sm:text-base shrink-0" />
            <span className="text-gray-300 hover:text-white transition cursor-default">
              6391 Elgin St. Celina, Delaware 10299
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiMail className="text-[#14b8a6] text-sm sm:text-base shrink-0" />
            <a
              href="mailto:exam126@gmail.com"
              className="text-gray-300 hover:text-white transition"
            >
              exam126@gmail.com
            </a>
          </div>
        </div>

        {/* Right: Working Hours */}
        <div className="flex items-center justify-center gap-2 text-center">
          <FiClock className="text-[#14b8a6] text-sm sm:text-base shrink-0" />
          <span className="text-gray-300">
            Opening Hour 9:00am - 10:00pm
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
