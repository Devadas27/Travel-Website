import React, { useState } from "react";
import { FiMapPin, FiCalendar, FiSearch } from "react-icons/fi";
import { BiBriefcase } from "react-icons/bi";
import { IoWalkOutline } from "react-icons/io5";

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [tourType, setTourType] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("02");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ location, tourType, date, guests });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl md:max-w-4xl mx-auto bg-white rounded-2xl md:rounded-full shadow-2xl border-2 border-[#14b8a6]/20 md:border md:border-gray-100 flex flex-col md:flex-row items-stretch overflow-hidden mt-6 md:mt-8 p-1.5 md:p-0"
    >
      {/* 1. Location */}
      <div className="flex-1 min-w-0 flex items-center px-4 sm:px-6 py-3.5 md:py-2.5 border-b md:border-b-0 md:border-r border-gray-100 gap-3">
        <FiMapPin className="text-[#14b8a6] text-xl shrink-0" />
        <div className="text-left w-full min-w-0">
          <span className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
            Location
          </span>
          <input
            type="text"
            placeholder="Where to next?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full min-w-0 text-sm sm:text-base font-bold text-gray-800 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>
      </div>

      {/* 2. Type */}
      <div className="flex-1 min-w-0 flex items-center px-4 sm:px-6 py-3.5 md:py-2.5 border-b md:border-b-0 md:border-r border-gray-100 gap-3">
        <BiBriefcase className="text-[#14b8a6] text-xl shrink-0" />
        <div className="text-left w-full min-w-0">
          <span className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
            Tour Type
          </span>
          <select
            value={tourType}
            onChange={(e) => setTourType(e.target.value)}
            className="w-full min-w-0 text-sm sm:text-base font-bold text-gray-800 outline-none bg-transparent cursor-pointer appearance-none"
          >
            <option value="">All Types</option>
            <option value="adventure">Adventure</option>
            <option value="wildlife">Wildlife</option>
            <option value="beach">Beach Holiday</option>
            <option value="family">Family Tour</option>
          </select>
        </div>
      </div>

      {/* 3. Date Form */}
      <div className="flex-1 min-w-0 flex items-center px-4 sm:px-6 py-3.5 md:py-2.5 border-b md:border-b-0 md:border-r border-gray-100 gap-3">
        <FiCalendar className="text-[#14b8a6] text-xl shrink-0" />
        <div className="text-left w-full min-w-0">
          <span className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
            Date
          </span>
          <input
            type="text"
            placeholder="Select Date"
            value={date}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            onChange={(e) => setDate(e.target.value)}
            className="w-full min-w-0 text-sm sm:text-base font-bold text-gray-800 placeholder-gray-400 outline-none bg-transparent cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Guests */}
      <div className="flex-1 min-w-0 flex items-center px-4 sm:px-6 py-3.5 md:py-2.5 border-b md:border-b-0 border-gray-100 gap-3">
        <IoWalkOutline className="text-[#14b8a6] text-2xl shrink-0" />
        <div className="text-left w-full min-w-0">
          <span className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
            Guests
          </span>
          <input
            type="text"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full min-w-0 text-sm sm:text-base font-bold text-gray-800 outline-none bg-transparent"
          />
        </div>
      </div>

      {/* 5. Booking.com Style CTA Button */}
      <button
        type="submit"
        className="w-full md:w-auto bg-[#14b8a6] hover:bg-[#0da291] active:scale-[0.98] text-white py-4 md:py-0 px-8 lg:px-10 font-black text-sm sm:text-base flex items-center justify-center gap-2 transition duration-200 shrink-0 rounded-xl md:rounded-none md:rounded-r-full cursor-pointer shadow-md mt-2 md:mt-0"
      >
        <span>Search</span>
        <FiSearch className="text-lg stroke-[2.5]" />
      </button>
    </form>
  );
};

export default SearchBar;
