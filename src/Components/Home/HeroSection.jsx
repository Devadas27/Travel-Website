import React from "react";
import SearchBar from "./SearchBar";
import skyLine from '../../assets/skyline.png.jpg'

const HeroSection = () => {
  const handleSearch = (filters) => {
    console.log("Searching Wanderly with:", filters);
  };

  return (
    <section className="relative bg-[#fbfcfb] pt-14 pb-14 px-4 overflow-hidden flex flex-col items-center">
      {/* 1. Airplane Doodle (Floating Top-Bottom) */}
      <div className="hidden lg:block absolute left-16 xl:left-24 top-10 opacity-30 pointer-events-none select-none animate-float">
        <svg
          width="85"
          height="85"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#222"
          strokeWidth="1.2"
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      </div>

      {/* 2. Cloud Doodle (Top Left) */}
      <div className="hidden lg:block absolute left-40 xl:left-52 top-6 opacity-25 pointer-events-none select-none">
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
      {/* 3. Cloud Doodle near Title (Right of 'The Travel!') */}
      <div className="hidden lg:block absolute right-36 xl:right-60 top-40 opacity-30 pointer-events-none select-none z-20">
        <svg
          width="48"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#333"
          strokeWidth="1.2"
        >
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        </svg>
      </div>

      {/* 4. Hot Air Balloon Doodle (Template pole 'The Travel!' nu thazhe clear aayi kaanam) */}
      <div className="hidden lg:block absolute right-32 xl:right-56 top-52 opacity-40 pointer-events-none select-none z-20 animate-float-delayed">
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
          <line x1="9" y1="17" x2="10" y2="21" stroke="#333" strokeWidth="1" />
          <line x1="15" y1="17" x2="14" y2="21" stroke="#333" strokeWidth="1" />
        </svg>
      </div>

      {/* 5. Left Floating Circle: Hiker (Floating Top-Bottom) */}
      <div className="hidden lg:block absolute left-4 xl:left-12 top-40 w-40 h-40 xl:w-48 xl:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl z-10 animate-float">
        <img
          src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80"
          alt="Backpacker Hiker"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 6. Right Floating Arch: Coastal Traveler (Floating Top-Bottom Delayed) */}
      <div className="hidden lg:block absolute right-4 xl:right-12 top-16 w-36 h-64 xl:w-44 xl:h-76 rounded-full overflow-hidden border-4 border-white shadow-2xl z-10 animate-float-delayed">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
          alt="Coastal Traveler"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 7. Center Main Content */}
      <div
        className="w-full max-w-4xl mx-auto text-center flex flex-col items-center relative z-20"
        style={{ marginTop: "100px" }}
      >
        <p
          style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
          className="text-[#14b8a6] text-3xl sm:text-4xl font-bold mb-2 tracking-wide"
        >
          Welcome to Wanderly
        </p>

        <h1 className="text-4xl sm:text-6xl md:text-[65px] font-black text-[#1e2329] leading-[1.08] mb-6 tracking-tight text-center">
          Explore More, Travel Better.
        </h1>

        {/* Slide-In Travel Paragraph */}
        <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-12 leading-relaxed text-center animate-slide-left" style={{marginTop:'30px' , fontSize:'18px'}}>
          Discover breathtaking destinations, handpicked adventures, and
          unforgettable journeys across the globe. Travel with confidence with
          Wanderly.
        </p>
      </div>

      {/* 8. Search Bar Row */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-center gap-4 relative z-20 px-4">
        <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80"
            alt="Family Travelers"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 max-w-4xl">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80"
            alt="Resort Pool"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 9. Animated Left-Right Moving Skyline at Bottom */}
      <div className="w-full overflow-hidden opacity-20 mt-14 pointer-events-none select-none flex justify-center">
        <img
          src={skyLine}
          alt="Skyline"
          className="w-[115%] max-w-none h-20 md:h-24 object-cover animate-skyline"
           style={{width:'100%' , height:'100%'}}
        />
      </div>
    </section>
  );
};

export default HeroSection;
