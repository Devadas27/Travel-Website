import React from 'react';
import HeroSection from '../Components/Home/HeroSection';
import TopDestinations from '../Components/Home/TopDestinations';
import WhyChooseUs from '../Components/Home/WhyChooseUs';
import FeaturedTours from '../Components/Home/FeaturedTours';
import RecentGallery from '../Components/Home/RecentGallery'; // <--- NEW IMPORT
import ScrollToTop from '../Components/Common/ScrollToTop';
import LatestBlog from '../Components/Home/LatestBlog';
import Footer from '../Components/Home/Footer';

const Home = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Banner Section */}
      <HeroSection />

      {/* 2. Top Destinations Section */}
      <TopDestinations />

      {/* 3. Featured Tours Section */}
      <FeaturedTours />

      {/* 4. Recent Gallery Mosaic Section */}
      <RecentGallery />

      {/* 5. Categories Section */}
      <LatestBlog />

      {/* 6. Why Choose Us Section (Moved below Category & before Footer) */}
      <WhyChooseUs style={{ marginTop: "60px", marginBottom: "20px" }} />

      {/* Floating Scroll to Top Button */}
      <ScrollToTop />

      {/* 7. Footer */}
      <Footer />
    </main>
  );
};

export default Home;