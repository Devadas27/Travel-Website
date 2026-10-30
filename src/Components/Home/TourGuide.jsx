import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const guidesData = [
  {
    id: 1,
    name: "Mike Hardson",
    role: "Tourist Guide",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
    socials: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
      instagram: "#",
    },
  },
  {
    id: 2,
    name: "Leslie Alexander",
    role: "Tourist Guide",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&q=80",
    socials: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
      instagram: "#",
    },
  },
  {
    id: 3,
    name: "Annette Black",
    role: "Tourist Guide",
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=80",
    socials: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
      instagram: "#",
    },
  },
  {
    id: 4,
    name: "Guy Hawkins",
    role: "Tourist Guide",
    image:
      "https://images.unsplash.com/photo-1520409364224-63400afe26e5?auto=format&fit=crop&w=500&q=80",
    socials: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
      instagram: "#",
    },
  },
];

const TourGuide = () => {
  return (
    <section className="w-full bg-white py-20 px-4 sm:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Header: Perfectly Centered */}
        <div className="w-full text-center flex flex-col items-center max-w-2xl mx-auto">
          {/* Cursive Subtitle with 3-leaf doodle */}
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span
              style={{ fontFamily: "'Caveat', cursive" }}
              className="text-[#14b8a6] text-3xl sm:text-4xl font-bold tracking-wide"
            >
              Meet With Our Guide
            </span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#14b8a6"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="mb-2"
            >
              <line x1="12" y1="4" x2="12" y2="11" />
              <line x1="5" y1="7" x2="10" y2="12" />
              <line x1="19" y1="7" x2="14" y2="12" />
            </svg>
          </div>

          {/* Main Title */}
          <h2
            className="text-4xl sm:text-5xl font-black text-[#1e2329] tracking-tight mb-3"
            style={{ marginTop: "20px" }}
          >
            Tour Guide
          </h2>

          {/* Description */}
          <p
            className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto"
            style={{ marginTop: "20px", fontSize: "20px" }}
          >
            content of a page when looking at layout the point of using lorem
            the is Ipsum less
          </p>
        </div>

        {/* 4-Column Guides Grid - Perfectly centered with equal margins */}
        <div
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center items-center"
          style={{ marginTop: "105px" }}
        >
          {guidesData.map((guide) => (
            <div
              key={guide.id}
              className="w-full group relative bg-[#f2f4f7] rounded-3xl pb-8 px-6 flex flex-col items-center text-center shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              style={{ paddingTop: "85px", minHeight: "260px" }}
            >
              {/* Overlapping Avatar Circle */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-white"
                style={{ top: "-64px" }}
              >
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Guide Name */}
              <h3 className="text-xl font-black text-[#1e2329] mb-1 group-hover:text-[#14b8a6] transition-colors duration-300">
                {guide.name}
              </h3>

              {/* Guide Role */}
              <p className="text-[#14b8a6] font-semibold text-sm mb-6">
                {guide.role}
              </p>

              {/* Social Media Buttons */}
              <div className="flex items-center justify-center gap-2.5 mt-auto">
                <a
                  href={guide.socials.facebook}
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-[#e2e7ec] text-gray-700 flex items-center justify-center hover:bg-[#14b8a6] hover:text-white transition-colors duration-300 text-xs"
                >
                  <FaFacebookF />
                </a>

                <a
                  href={guide.socials.twitter}
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-full bg-[#e2e7ec] text-gray-700 flex items-center justify-center hover:bg-[#14b8a6] hover:text-white transition-colors duration-300 text-xs"
                >
                  <FaTwitter />
                </a>

                <a
                  href={guide.socials.linkedin}
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-[#e2e7ec] text-gray-700 flex items-center justify-center hover:bg-[#14b8a6] hover:text-white transition-colors duration-300 text-xs"
                >
                  <FaLinkedinIn />
                </a>

                <a
                  href={guide.socials.instagram}
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-[#e2e7ec] text-gray-700 flex items-center justify-center hover:bg-[#14b8a6] hover:text-white transition-colors duration-300 text-xs"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourGuide;
