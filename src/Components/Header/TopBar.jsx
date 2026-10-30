import React from "react";
import { FiMapPin, FiMail, FiClock } from "react-icons/fi";

const TopBar = () => {
  return (
    <div className="bg-[#212529] text-gray-400 text-[13px] h-14 border-b border-gray-800/60 flex items-center px-6 lg:px-12 select-none">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Location & Email */}
        <div className="flex items-center gap-8" style={{ marginLeft: "45px" }}>
          <div className="flex items-center gap-2">
            <FiMapPin className="text-[#14b8a6] text-base shrink-0" />
            <span className="text-gray-300 hover:text-white transition cursor-default">
              6391 Elgin St. Celina, Delaware 10299
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiMail className="text-[#14b8a6] text-base shrink-0" />
            <a
              href="mailto:exam126@gmail.com"
              className="text-gray-300 hover:text-white transition"
            >
              exam126@gmail.com
            </a>
          </div>
        </div>

        {/* Right: Working Hours */}

        <div className="flex items-center gap-2">
          <FiClock className="text-[#14b8a6] text-base shrink-0"/>
          <span className="text-gray-300">
            {" "}
            Opening Hour 9:00am - 10:00pm
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
