import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiBell,
} from "react-icons/fi";
import AuthModal from "../Common/AuthModal";
import logoImg from "../../assets/wanderly-logo.png";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: "login",
  });

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Check login state from localStorage
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        setCurrentUser(null);
      }
    };

    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [authModal.isOpen]);

  // Fetch Notifications for Current User
  const fetchNotifications = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setNotifications([]);
      return;
    }
    try {
      const userObj = JSON.parse(storedUser);
      const email = userObj.email || "";
      const phone = userObj.mobileNumber || userObj.phone || "";
      if (!email && !phone) return;

      const url = `http://localhost:5000/api/notifications?email=${encodeURIComponent(
        email
      )}&phone=${encodeURIComponent(phone)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      }
    } catch (err) {
      console.warn("Could not fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 10 seconds to catch real-time admin approvals
    const interval = setInterval(fetchNotifications, 10000);
    window.addEventListener("storage", fetchNotifications);
    window.addEventListener("notificationsUpdated", fetchNotifications);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", fetchNotifications);
      window.removeEventListener("notificationsUpdated", fetchNotifications);
    };
  }, [currentUser]);

  // Mark single notification as read
  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PUT",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.warn("Mark read failed:", err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    try {
      const userObj = JSON.parse(storedUser);
      const res = await fetch("http://localhost:5000/api/notifications/mark-all-read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userObj.email || "",
          phone: userObj.mobileNumber || userObj.phone || "",
        }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.warn("Mark all read failed:", err);
    }
  };

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setNotifications([]);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
    window.location.reload();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="w-full bg-[#212529] px-4 md:px-8 lg:px-12 pb-4 flex justify-center">
      <div className="w-full max-w-7xl mx-auto flex justify-center">
        <div className="w-full bg-white rounded-t-3xl rounded-br-3xl flex items-center justify-between h-24 pr-8 lg:pr-12 shadow-xl pl-0 relative">
          {/* Wanderly Logo Image */}
          <Link
            to="/"
            aria-label="Wanderly Home"
            className="group flex h-full shrink-0 items-center px-4 py-2"
          >
            <div className="flex h-16 w-auto shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src={logoImg}
                alt="Wanderly Logo"
                className="h-full w-auto object-contain rounded-3xl"
                style={{ marginLeft: "20px" }}
              />
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-7 xl:gap-9 text-sm font-extrabold tracking-wider text-gray-800">
            <Link to="/" className="text-[#14b8a6] transition">
              HOME
            </Link>
            <Link to="/destinations" className="hover:text-[#14b8a6] transition">
              DESTINATIONS
            </Link>
            <Link to="/tour-packages" className="hover:text-[#14b8a6] transition">
              TOUR PACKAGES
            </Link>
            <Link
              to="/taxi-booking"
              className="hover:text-[#14b8a6] transition"
            >
              TAXI BOOKING
            </Link>

            <Link to="/about" className="hover:text-[#14b8a6] transition">
              ABOUT
            </Link>

            <Link to="/contact" className="hover:text-[#14b8a6] transition">
              CONTACT
            </Link>
          </nav>

          {/* Profile, Search and Booking */}
          <div className="flex items-center gap-5 shrink-0 pr-6 lg:pr-10">
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-label="User Account"
                aria-expanded={isProfileOpen}
                className={`w-11 h-11 rounded-full border transition flex items-center justify-center focus:outline-none shadow-sm ${
                  isProfileOpen
                    ? "border-[#14b8a6] text-[#14b8a6] bg-[#14b8a6]/10 ring-2 ring-[#14b8a6]/20"
                    : "border-gray-200 text-gray-700 hover:border-[#14b8a6] hover:text-[#14b8a6] hover:bg-gray-50"
                }`}
              >
                <FiUser className="text-xl stroke-2" />
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 top-full mt-3.5 w-64 bg-white rounded-2xl p-2.5 border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    boxShadow:
                      "0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 10px 20px -5px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  {currentUser ? (
                    // ==========================================
                    // WHEN USER IS LOGGED IN (Full Name & Logout)
                    // ==========================================
                    <div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="px-3 py-3 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 transition-all rounded-t-xl cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center font-bold text-base shrink-0 group-hover:bg-[#14b8a6] group-hover:text-white transition-colors">
                          {currentUser.name
                            ? currentUser.name.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-xs text-gray-400 block font-normal uppercase tracking-wider">
                            Signed in as
                          </span>
                          <span className="font-bold text-gray-800 text-sm block truncate group-hover:text-[#14b8a6] transition-colors">
                            {currentUser.name}
                          </span>
                        </div>
                      </Link>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left group flex items-center gap-3.5 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all rounded-xl focus:outline-none cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors shadow-sm">
                            <FiLogOut className="text-lg stroke-2" />
                          </div>
                          <div className="py-1">
                            <span className="font-bold text-sm block">
                              Logout
                            </span>
                            <span className="text-xs text-red-400 block font-normal">
                              Sign out from account
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // ==========================================
                    // WHEN USER IS LOGGED OUT (Login & Signup)
                    // ==========================================
                    <div>
                      {/* Login */}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthModal({ isOpen: true, mode: "login" });
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left group flex items-center gap-3.5 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#14b8a6] hover:bg-[#14b8a6]/10 transition-all rounded-xl focus:outline-none cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center shrink-0 group-hover:bg-[#14b8a6] group-hover:text-white transition-colors shadow-sm">
                          <FiLogIn className="text-lg stroke-2" />
                        </div>

                        <div className="py-1">
                          <span className="font-bold text-gray-800 text-sm block group-hover:text-[#14b8a6] transition-colors">
                            Login
                          </span>
                          <span className="text-xs text-gray-400 block font-normal">
                            Sign in to your account
                          </span>
                        </div>
                      </button>

                      <div className="h-px bg-gray-100 my-1 mx-2" />

                      {/* Signup */}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthModal({ isOpen: true, mode: "signup" });
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left group flex items-center gap-3.5 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#14b8a6] hover:bg-[#14b8a6]/10 transition-all rounded-xl focus:outline-none cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center shrink-0 group-hover:bg-[#14b8a6] group-hover:text-white transition-colors shadow-sm">
                          <FiUserPlus className="text-lg stroke-2" />
                        </div>

                        <div className="py-1">
                          <span className="font-bold text-gray-800 text-sm block group-hover:text-[#14b8a6] transition-colors">
                            Signup
                          </span>
                          <span className="text-xs text-gray-400 block font-normal">
                            Create a new account
                          </span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification Bell Dropdown (Between Profile & Search) */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => {
                  setIsNotificationsOpen((prev) => !prev);
                  setIsProfileOpen(false);
                }}
                aria-label="Notifications"
                className={`relative w-11 h-11 rounded-full border transition flex items-center justify-center focus:outline-none shadow-sm cursor-pointer ${
                  isNotificationsOpen
                    ? "border-[#14b8a6] text-[#14b8a6] bg-[#14b8a6]/10 ring-2 ring-[#14b8a6]/20"
                    : "border-gray-200 text-gray-700 hover:border-[#14b8a6] hover:text-[#14b8a6] hover:bg-gray-50"
                }`}
              >
                <FiBell className="text-xl stroke-2" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse border-2 border-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotificationsOpen && (
                <div
                  className="absolute right-0 top-full mt-3.5 w-80 sm:w-96 bg-white rounded-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    boxShadow:
                      "0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 10px 20px -5px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  {/* Dropdown Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-sm font-bold">
                        <FiBell className="stroke-2" />
                      </div>
                      <h4 className="font-extrabold text-gray-900 text-sm tracking-tight">
                        Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <span className="bg-[#14b8a6]/15 text-[#14b8a6] text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="text-xs font-bold text-[#14b8a6] hover:text-[#0da291] transition cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 px-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2 text-xl">
                          <FiBell />
                        </div>
                        <p className="text-sm font-bold text-gray-700">No notifications yet</p>
                        <p className="text-xs text-gray-400 mt-1">
                          When you book a visit, tour, or taxi, or when admin approves it, updates will appear here!
                        </p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => !item.isRead && handleMarkAsRead(item._id)}
                          className={`p-3.5 flex items-start gap-3 transition cursor-pointer hover:bg-gray-50/80 ${
                            !item.isRead ? "bg-[#14b8a6]/5" : "bg-white"
                          }`}
                        >
                          {/* Type Icon Badge */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 mt-0.5 ${
                              item.type === "booking_approved"
                                ? "bg-emerald-100 text-emerald-700"
                                : item.type === "booking_cancelled"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-[#14b8a6]/10 text-[#14b8a6]"
                            }`}
                          >
                            {item.bookingType === "Taxi"
                              ? "🚕"
                              : item.bookingType === "Package"
                              ? "🎒"
                              : item.bookingType === "Place"
                              ? "📍"
                              : "🔔"}
                          </div>

                          {/* Message Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h5
                                className={`text-xs font-bold truncate ${
                                  !item.isRead ? "text-gray-900" : "text-gray-700"
                                }`}
                              >
                                {item.title}
                              </h5>
                              {!item.isRead && (
                                <span className="w-2 h-2 rounded-full bg-[#14b8a6] shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                              {item.message}
                            </p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {new Date(item.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Dropdown Footer: Link to User Profile */}
                  <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                    <Link
                      to="/profile"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-xs font-bold text-[#14b8a6] hover:text-[#0da291] transition block py-1"
                    >
                      View All Activity in Profile →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              className="text-gray-700 hover:text-[#14b8a6] transition p-1 flex items-center justify-center cursor-pointer"
            >
              <FiSearch className="text-2xl stroke-2" />
            </button>

            {/* Start Booking */}
            <Link
              to="/tours"
              className="bg-[#14b8a6] hover:bg-[#0da291] text-white font-bold text-sm px-4 rounded-full transition shadow-md whitespace-nowrap flex items-center justify-center"
              style={{
                minWidth: "120px",
                height: "40px",
              }}
            >
              Start Booking
            </Link>
          </div>
        </div>
      </div>

      {/* Login and Signup Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
        initialMode={authModal.mode}
      />
    </header>
  );
};

export default Header;
