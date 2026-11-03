import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./Pages/Dashboard";
import TouristPlaces from "./Pages/TouristPlaces";
import TouristPackages from "./Pages/TouristPackages";
import TaxiBookings from "./Pages/TaxiBookings";
import Categories from "./Pages/Categories";
import Users from "./Pages/Users";
import UserDetails from "./Pages/UserDetails";

const MainRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/tourist-places" element={<TouristPlaces />} />
      <Route path="/destinations" element={<TouristPlaces />} />
      <Route path="/place-bookings" element={<TouristPlaces />} />

      <Route path="/tourist-packages" element={<TouristPackages />} />
      <Route path="/tourist-pakages" element={<TouristPackages />} />
      <Route path="/package-bookings" element={<TouristPackages />} />

      <Route path="/categories" element={<Categories />} />
      <Route path="/category" element={<Categories />} />

      <Route path="/taxi-bookings" element={<TaxiBookings />} />
      <Route path="/bookings" element={<TaxiBookings />} />

      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<UserDetails />} />
    </Routes>
  );
};

export default MainRouter;
