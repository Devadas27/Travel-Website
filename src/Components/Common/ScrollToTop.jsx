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
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full border-2 border-[#14b8a6] bg-white text-[#14b8a6] hover:bg-[#14b8a6] hover:text-white transition-all duration-300 shadow-xl flex items-center justify-center hover:scale-110 cursor-pointer animate-bounce"
        >
          <FiArrowUp className="text-xl stroke-[2.5]" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;