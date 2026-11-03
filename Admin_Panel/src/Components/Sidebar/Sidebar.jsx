import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column p-3 text-white"
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: "#1F2933",
      }}
    >
      {/* Logo */}
      <div className="mb-4 text-center">
        <h3 className="fw-bold mb-0" style={{ color: "#14B8A6" }}>
          Wanderly
        </h3>

        <small className="text-secondary">Admin Panel</small>
      </div>

      {/* Menu */}
      <nav className="d-flex flex-column gap-2">
        <NavLink
          to="/"
          className="text-decoration-none text-white rounded px-3 py-3"
        >
          🏠 &nbsp; Dashboard
        </NavLink>

        <NavLink
          to="/tourist-places"
          className="text-decoration-none text-white rounded px-3 py-3"
        >
          📍 &nbsp; Tourist Places
        </NavLink>

        <NavLink
          to="/tourist-packages"
          className="text-decoration-none text-white rounded px-3 py-3"
        >
          🎒 &nbsp; Tourist Packages
        </NavLink>

        <NavLink
          to="/categories"
          className="text-decoration-none text-white rounded px-3 py-3"
        >
          🏷️ &nbsp; Categories
        </NavLink>

        <NavLink
          to="/destinations"
          className="text-decoration-none text-white rounded px-3 py-3"
        >
          🗺️ &nbsp; Destinations
        </NavLink>

        <NavLink
          to="/taxi-bookings"
          className="text-decoration-none text-white rounded px-3 py-3"
        >
          🚕 &nbsp; Taxi Bookings
        </NavLink>

        <NavLink
          to="/users"
          className="text-decoration-none text-white rounded px-3 py-3"
        >
          👥 &nbsp; Users
        </NavLink>

        <NavLink
          to="/settings"
          className="text-decoration-none text-white rounded px-3 py-3"
        >
          ⚙️ &nbsp; Settings
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button
          className="btn w-100 text-white"
          style={{
            backgroundColor: "#14B8A6",
          }}
        >
          🚪 &nbsp; Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
