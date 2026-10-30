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
    <form style={{marginTop:'30px', width:'900px'}}
      onSubmit={handleSubmit}
      className="w-full bg-white rounded-full shadow-2xl border border-gray-100 flex items-stretch h-20 overflow-hidden"
    >
      {/* 1. Location */}
      <div className="flex-1 flex items-center justify-between px-6 border-r border-gray-200" style={{padding:'20px'}}>
        <div className="text-left w-full">
          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Location
          </span>
          <input
            type="text"
            placeholder="Where to next"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-sm font-bold text-gray-800 placeholder-gray-800 outline-none bg-transparent"
          />
        </div>
        <FiMapPin className="text-gray-600 text-lg ml-2 shrink-0" />
      </div>

      {/* 2. Type */}
      <div className="flex-1 flex items-center justify-between px-6 border-r border-gray-200">
        <div className="text-left w-full">
          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Type
          </span>
          <select
            value={tourType}
            onChange={(e) => setTourType(e.target.value)}
            className="w-full text-sm font-bold text-gray-800 outline-none bg-transparent cursor-pointer appearance-none"
          >
            <option value="">Booking Type</option>
            <option value="adventure">Adventure</option>
            <option value="wildlife">Wildlife</option>
            <option value="beach">Beach Holiday</option>
            <option value="family">Family Tour</option>
          </select>
        </div>
        <BiBriefcase className="text-gray-600 text-lg ml-2 shrink-0" />
      </div>

      {/* 3. Date Form */}
      <div className="flex-1 flex items-center justify-between px-6 border-r border-gray-200">
        <div className="text-left w-full">
          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Date Form
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
            className="w-full text-sm font-bold text-gray-800 placeholder-gray-800 outline-none bg-transparent cursor-pointer"
          />
        </div>
        <FiCalendar className="text-gray-600 text-lg ml-2 shrink-0" />
      </div>

      {/* 4. Guests */}
      <div className="flex-1 flex items-center justify-between px-6">
        <div className="text-left w-full">
          <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Guests
          </span>
          <input
            type="text"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full text-sm font-bold text-gray-800 outline-none bg-transparent"
          />
        </div>
        <IoWalkOutline className="text-gray-600 text-2xl ml-2 shrink-0" />
      </div>

      {/* 5. Search Button */}
      <button
        type="submit"
        className="bg-[#14b8a6] hover:bg-[#0da291] text-white px-9 font-bold flex items-center justify-center gap-2 transition shrink-0 rounded-r-full"
      >
        <span className="text-sm">Search</span>
        <FiSearch className="text-base" />
      </button>
    </form>
  );
};

export default SearchBar;
