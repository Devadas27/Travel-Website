import React from "react";
import { FiCamera } from "react-icons/fi";

const galleryPhotos = {
  // Column 1
  col1: [
    {
      id: 1,
      title: "Taj Mahal",
      location: "Agra, Uttar Pradesh",
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
      height: "h-64",
    },
    {
      id: 2,
      title: "Alleppey Backwaters",
      location: "Alappuzha, Kerala",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
      height: "aspect-square",
    },
    {
      id: 3,
      title: "Hawa Mahal",
      location: "Jaipur, Rajasthan",
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      height: "aspect-square",
    },
  ],

  // Column 2
  col2: [
    {
      id: 4,
      title: "Munnar Tea Hills",
      location: "Idukki, Kerala",
      image:
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
      height: "aspect-square",
    },
    {
      id: 5,
      title: "Golden Temple",
      location: "Amritsar, Punjab",
      image:
        "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80",
      height: "aspect-square",
    },
    {
      id: 6,
      title: "Pangong Lake",
      location: "Ladakh, Himalayas",
      image:
        "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
      height: "h-64",
    },
  ],

  // Column 3 (Center Anchor)
  col3: [
    {
      id: 7,
      title: "Varanasi Ganga Ghats",
      location: "Varanasi, Uttar Pradesh",
      image:
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
      height: "h-72",
    },
    {
      id: 8,
      title: "Lake Palace",
      location: "Udaipur, Rajasthan",
      image:
        "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
      height: "h-60",
    },
  ],

  // Column 4
  col4: [
    {
      id: 9,
      title: "Goa Beaches",
      location: "Palolem, Goa",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      height: "aspect-square",
    },
    {
      id: 10,
      title: "Dal Lake Shikara",
      location: "Srinagar, Kashmir",
      image:
        "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=800&q=80",
      height: "aspect-square",
    },
    {
      id: 11,
      title: "Amber Fort",
      location: "Jaipur, Rajasthan",
      image:
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      height: "h-64",
    },
  ],

  // Column 5
  col5: [
    {
      id: 12,
      title: "Gateway of India",
      location: "Mumbai, Maharashtra",
      image:
        "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
      height: "h-72",
    },
    {
      id: 13,
      title: "Qutub Minar",
      location: "New Delhi",
      image:
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
      height: "h-60",
    },
  ],
};

// Reusable Single Gallery Card with Hover Effect & Location Tag
const GalleryCard = ({ item }) => (
  <div
    className={`group relative ${item.height} w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-gray-100`}
  >
    {/* Photo with zoom effect on hover */}
    <img
      src={item.image}
      alt={item.title || "India Tourist Destination"}
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      loading="lazy"
    />

    {/* Hover Overlay: Teal Background + Title & Camera Icon */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center pointer-events-none"
      style={{ backgroundColor: "rgba(20, 184, 166, 0.85)" }}
    >
      <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300 mb-2">
        <FiCamera className="text-lg" style={{ color: "#14b8a6" }} />
      </div>

      {item.title && (
        <span className="text-white font-bold text-sm leading-tight drop-shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {item.title}
        </span>
      )}

      {item.location && (
        <span className="text-white/90 text-xs font-medium mt-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          📍 {item.location}
        </span>
      )}
    </div>
  </div>
);

const RecentGallery = () => {
  return (
    <section
      className="w-full bg-[#fbfcfb] py-20 px-6 sm:px-12 lg:px-20 flex justify-center"
      style={{ marginTop: "100px" }}
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Headings: Perfectly Centered */}
        <div className="text-center flex flex-col items-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 mb-1">
            <span
              style={{ fontFamily: "'Caveat', cursive" }}
              className="text-[#14b8a6] text-3xl sm:text-4xl font-bold tracking-wide"
            >
              Our beautiful moment
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

          <h2
            className="text-4xl sm:text-5xl font-black text-[#1e2329] tracking-tight mb-3"
            style={{ marginTop: "10px" }}
          >
            Recent Gallery
          </h2>

          <p
            className="text-gray-500 leading-relaxed max-w-lg mx-auto"
            style={{ marginTop: "20px", fontSize: "20px" }}
          >
            A glimpse into the real adventures, smiles, and breathtaking
            destinations experienced by our wonderful travelers worldwide.
          </p>
        </div>

        {/* 5-Column Balanced Mosaic Grid */}
        <div
          className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5"
          style={{ marginTop: "40px", marginBottom: "40px" }}
        >
          {/* Column 1 */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {galleryPhotos.col1.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {galleryPhotos.col2.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 3 (Center Anchor) */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {galleryPhotos.col3.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {galleryPhotos.col4.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>

          {/* Column 5 */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {galleryPhotos.col5.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentGallery;