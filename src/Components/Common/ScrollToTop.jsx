import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll position monitor cheyyuka
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Smooth scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#14b8a6] bg-white/95 backdrop-blur-xs text-[#14b8a6] hover:bg-[#14b8a6] hover:text-white transition-all duration-300 shadow-lg flex items-center justify-center cursor-pointer hover:scale-105"
        >
          <FiArrowUp className="text-base sm:text-xl stroke-[2.5]" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;