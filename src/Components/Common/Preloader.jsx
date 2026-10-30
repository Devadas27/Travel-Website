import React, { useState, useEffect } from "react";
import { BiBriefcaseAlt2 } from "react-icons/bi";

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 900ms preloader kaanichittu smooth aayi fade out aavum
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 500); // 500ms fade transition
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#181a1d] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 1. Animated Teal Logo Box with Glowing Ring */}
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Glow */}
        <div className="absolute w-24 h-24 rounded-2xl bg-[#14b8a6]/20 animate-ping pointer-events-none" />

        {/* Signature Teal Logo Box */}
        <div className="w-16 h-16 bg-[#14b8a6] text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-500/50 transform animate-bounce">
          <BiBriefcaseAlt2 className="text-3xl text-white" />
        </div>
      </div>

      {/* 2. "LOADING..." Animated Text in Vibrant Teal */}
      <div className="mt-6 flex items-center gap-1.5 select-none">
        <span className="text-xs font-black tracking-[0.35em] text-[#14b8a6] uppercase">
          LOADING
        </span>
        <span className="flex gap-1 text-[#14b8a6] text-xs font-black">
          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
            .
          </span>
          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
            .
          </span>
          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
            .
          </span>
        </span>
      </div>
    </div>
  );
};

export default Preloader;
