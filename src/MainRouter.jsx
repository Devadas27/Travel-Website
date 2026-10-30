import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "../src/Pages/Home";
import TopBar from "../src/Components/Header/TopBar";
import Header from "../src/Components/Header/Header";
import TaxiBooking from "./Pages/TaxiBooking";
import CategoryDestinations from "./Pages/CategoryDestinations";
import UserProfile from "./Pages/UserProfile";
import Destinations from "./Pages/Destinations";
import TourPackages from "./Pages/TourPackages";
import About from "./Pages/About";
import Contact from "./Pages/Contact";

// Common Layout (Header + TopBar + Page Content)
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-gray-800">
      <TopBar />
      <Header />
      <main className="grow">
        <Outlet />
      </main>
    </div>
  );
};

// Dummy pages for other links
const PagePlaceholder = ({ title }) => (
  <div className="py-24 text-center">
    <h2 className="text-3xl font-bold text-gray-700">{title}</h2>
    <p className="text-gray-400 mt-2">Under Construction</p>
  </div>
);

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="pages" element={<PagePlaceholder title="Pages" />} />
          <Route path="tours" element={<TourPackages />} />
          <Route path="tour-packages" element={<TourPackages />} />
          <Route path="destination" element={<Destinations />} />
          <Route path="destinations" element={<Destinations />} />
          <Route
            path="news"
            element={<PagePlaceholder title="Travel News & Blogs" />}
          />
          <Route path="contact" element={<Contact />} />
          <Route path="taxi-booking" element={<TaxiBooking />} />
          <Route path="category/:categoryName" element={<CategoryDestinations />} />
          <Route path="categories/:categoryName" element={<CategoryDestinations />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="userprofile" element={<UserProfile />} />
          <Route path="login" element={<PagePlaceholder title="Customer Login" />} />
          <Route path="signup" element={<PagePlaceholder title="Create an Account" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MainRouter;
