import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit,
  FiEdit3,
  FiTrash2,
  FiLogOut,
  FiShield,
  FiHeart,
  FiSend,
  FiCheckCircle,
  FiChevronRight,
  FiX,
  FiUploadCloud,
} from "react-icons/fi";
import { BiBriefcaseAlt2 } from "react-icons/bi";

const UserProfile = () => {
  const navigate = useNavigate();

  // Active navigation tab on the left sidebar
  const [activeTab, setActiveTab] = useState("profile");

  // User details state (loaded from localStorage / API)
  const [user, setUser] = useState({
    name: "Devadas",
    email: "devadas@example.com",
    mobileNumber: "+91 98765 43210",
    dob: "",
    gender: "",
    address: "Kerala, India",
    country: "India",
    image: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Form state for Edit Profile Modal
  const [editForm, setEditForm] = useState({
    name: "",
    mobileNumber: "",
    dob: "",
    gender: "",
    address: "",
    country: "",
    image: "",
  });

  const loadUserData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUser((prev) => ({
          ...prev,
          name: parsed.name || parsed.fullName || prev.name,
          email: parsed.email || prev.email,
          mobileNumber:
            parsed.mobileNumber || parsed.phone || prev.mobileNumber,
          dob: parsed.dob || "",
          gender: parsed.gender || "",
          address: parsed.address || prev.address,
          country: parsed.country || prev.country,
          image: parsed.image || "",
        }));
      } else if (!token) {
        // If not logged in, user can still preview sample profile or log in
        setIsLoggedIn(false);
      }

      // Fetch latest profile from backend if token exists
      if (token) {
        try {
          const res = await fetch(
            "http://localhost:5000/api/user-registration/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.user) {
              setIsLoggedIn(true);
              setUser((prev) => ({
                ...prev,
                ...data.user,
              }));
              const stored = localStorage.getItem("user");
              const currentObj = stored ? JSON.parse(stored) : {};
              localStorage.setItem(
                "user",
                JSON.stringify({ ...currentObj, ...data.user })
              );
            }
          }
        } catch (fetchErr) {
          console.warn("Could not fetch remote profile:", fetchErr);
        }
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
    }
  };

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Open Edit Modal with current values
  const handleOpenEditModal = () => {
    setSelectedFile(null);
    setEditForm({
      name: user.name || "",
      mobileNumber: user.mobileNumber || "",
      dob: user.dob || "",
      gender: user.gender || "",
      address: user.address || "",
      country: user.country || "India",
      image: user.image || "",
    });
    setSuccessMsg("");
    setIsEditModalOpen(true);
  };

  // Handle Edit form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload from computer
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Image size should be less than 10MB");
        return;
      }
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setEditForm((prev) => ({
        ...prev,
        image: previewUrl,
      }));
    }
  };

  // Handle delete / clear photo
  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setEditForm((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // Save updated profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSuccessMsg("");

    let updatedUser = {
      ...user,
      name: editForm.name.trim() || user.name,
      mobileNumber: editForm.mobileNumber.trim() || user.mobileNumber,
      dob: editForm.dob,
      gender: editForm.gender,
      address: editForm.address.trim(),
      country: editForm.country.trim() || "India",
      image: editForm.image,
    };

    // 1. Sync to backend API if token is present
    const token = localStorage.getItem("token");
    if (token) {
      try {
        let res;
        if (selectedFile) {
          // Send multipart FormData for image upload
          const formData = new FormData();
          formData.append("image", selectedFile);
          formData.append("name", updatedUser.name);
          formData.append("mobileNumber", updatedUser.mobileNumber);
          formData.append("dob", updatedUser.dob || "");
          formData.append("gender", updatedUser.gender || "");
          formData.append("address", updatedUser.address || "");
          formData.append("country", updatedUser.country || "");

          res = await fetch(
            "http://localhost:5000/api/user-registration/profile",
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            }
          );
        } else {
          // Send JSON payload
          res = await fetch(
            "http://localhost:5000/api/user-registration/profile",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: updatedUser.name,
                mobileNumber: updatedUser.mobileNumber,
                dob: updatedUser.dob,
                gender: updatedUser.gender,
                address: updatedUser.address,
                country: updatedUser.country,
                image: updatedUser.image,
              }),
            }
          );
        }

        if (res && res.ok) {
          const data = await res.json();
          if (data && data.success && data.user) {
            updatedUser = { ...updatedUser, ...data.user };
          }
        }
      } catch (err) {
        console.warn("Backend update error:", err);
      }
    }

    // 2. Save to state immediately
    setUser(updatedUser);

    // 3. Save to localStorage
    try {
      const stored = localStorage.getItem("user");
      const currentObj = stored ? JSON.parse(stored) : {};
      const mergedObj = { ...currentObj, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(mergedObj));

      // Trigger storage event so Header navbar updates immediately
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed saving to localStorage", err);
    }

    setSelectedFile(null);
    setSaveLoading(false);
    setSuccessMsg("Profile updated successfully!");
    setTimeout(() => {
      setIsEditModalOpen(false);
      setSuccessMsg("");
    }, 800);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
    window.location.reload();
  };

  // Sample fallback bookings
  const defaultSampleBookings = [
    {
      id: "BK-1001",
      title: "Munnar Escape",
      location: "Munnar, Kerala",
      dates: "15 Nov 2025 - 17 Nov 2025",
      status: "Confirmed",
      type: "Tour Package",
      image:
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "BK-1002",
      title: "Alappuzha Backwater Retreat",
      location: "Alappuzha, Kerala",
      dates: "10 Dec 2025 - 12 Dec 2025",
      status: "Pending",
      type: "Tour Package",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "BK-1003",
      title: "Wayanad Rainforest Trail",
      location: "Wayanad, Kerala",
      dates: "22 Jan 2026 - 25 Jan 2026",
      status: "Confirmed",
      type: "Tour Package",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    },
  ];

  const [userBookings, setUserBookings] = useState(defaultSampleBookings);

  // Fetch Real User Bookings from All 3 Endpoints (Taxi, Packages, Places)
  const fetchUserBookings = async (email, phone) => {
    if (!email && !phone) return;
    try {
      const [taxiRes, pkgRes, placeRes] = await Promise.all([
        fetch("http://localhost:5000/api/taxi-bookings"),
        fetch("http://localhost:5000/api/package-bookings"),
        fetch("http://localhost:5000/api/place-bookings"),
      ]);

      const allBookings = [];

      // 1. Process Taxi Bookings
      if (taxiRes.ok) {
        const taxiList = await taxiRes.json();
        if (Array.isArray(taxiList)) {
          const matchedTaxi = taxiList.filter(
            (b) =>
              (b.email && email && b.email.toLowerCase() === email.toLowerCase()) ||
              (b.phone && phone && String(b.phone) === String(phone))
          );
          matchedTaxi.forEach((b) => {
            allBookings.push({
              id: `TX-${(b._id || b.id || "1001").slice(-4).toUpperCase()}`,
              rawId: b._id || b.id,
              type: "Taxi Booking",
              title: `${b.pickupLocation} ➔ ${b.dropLocation}`,
              location: b.pickupLocation,
              dates: `${b.pickupDate} • ${b.pickupTime}`,
              status: b.status || "Pending",
              image:
                "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80",
              createdAt: b.createdAt || new Date().toISOString(),
            });
          });
        }
      }

      // 2. Process Package Bookings
      if (pkgRes.ok) {
        const pkgList = await pkgRes.json();
        if (Array.isArray(pkgList)) {
          const matchedPkg = pkgList.filter(
            (b) =>
              (b.email && email && b.email.toLowerCase() === email.toLowerCase()) ||
              (b.phone && phone && String(b.phone) === String(phone))
          );
          matchedPkg.forEach((b) => {
            allBookings.push({
              id: `PK-${(b._id || b.id || "1002").slice(-4).toUpperCase()}`,
              rawId: b._id || b.id,
              type: "Tour Package",
              title: b.packageTitle,
              location: b.destination || "Kerala Tour",
              dates: `${b.travelDate} • ${b.travelers || 1} Person(s)`,
              status: b.status || "Pending",
              image: b.packageImage
                ? (b.packageImage.startsWith("http") ? b.packageImage : `http://localhost:5000${b.packageImage.startsWith("/") ? "" : "/"}${b.packageImage}`)
                : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
              createdAt: b.createdAt || new Date().toISOString(),
            });
          });
        }
      }

      // 3. Process Place Bookings
      if (placeRes.ok) {
        const placeList = await placeRes.json();
        if (Array.isArray(placeList)) {
          const matchedPlaces = placeList.filter(
            (b) =>
              (b.email && email && b.email.toLowerCase() === email.toLowerCase()) ||
              (b.phone && phone && String(b.phone) === String(phone))
          );
          matchedPlaces.forEach((b) => {
            allBookings.push({
              id: `PL-${(b._id || b.id || "1003").slice(-4).toUpperCase()}`,
              rawId: b._id || b.id,
              type: "Tourist Place",
              title: b.placeName,
              location: b.location || "Scenic Visit",
              dates: `${b.visitDate} • ${b.timeSlot || ""}`,
              status: b.status || "Pending",
              image: b.placeImage
                ? (b.placeImage.startsWith("http") ? b.placeImage : `http://localhost:5000${b.placeImage.startsWith("/") ? "" : "/"}${b.placeImage}`)
                : "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80",
              createdAt: b.createdAt || new Date().toISOString(),
            });
          });
        }
      }

      // Sort newest first
      allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (allBookings.length > 0) {
        setUserBookings(allBookings);
      }
    } catch (err) {
      console.warn("Could not fetch user bookings:", err);
    }
  };

  useEffect(() => {
    if (user.email || user.mobileNumber) {
      fetchUserBookings(user.email, user.mobileNumber);
    }
  }, [user.email, user.mobileNumber]);

  // Default avatar image when none is provided
  const defaultAvatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

  // Helper to format avatar image URL
  const getAvatarUrl = (img) => {
    if (!img) return defaultAvatar;
    if (
      img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("blob:") ||
      img.startsWith("data:")
    ) {
      return img;
    }
    return `http://localhost:5000${img.startsWith("/") ? "" : "/"}${img}`;
  };

  return (
    <div
      style={{ marginTop: "20px" }}
      className="w-full bg-[#f4f7f6] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-12 select-none"
    >
      <div className="max-w-7xl mx-auto">
        {/* Guest Warning Banner if not signed in */}
        {!isLoggedIn && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-amber-800">
            <div className="flex items-center gap-2">
              <FiUser className="text-xl shrink-0 text-amber-600" />
              <span>
                You are viewing a guest preview. Please log in to synchronize
                your personal bookings and account information.
              </span>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-[#14b8a6] hover:bg-[#0da291] text-white font-bold rounded-xl transition shadow-sm whitespace-nowrap"
            >
              Sign In Now
            </Link>
          </div>
        )}

        {/* Main 2-Column Profile Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ============================================================== */}
          {/* LEFT COLUMN: Profile Card & Sidebar Tabs                       */}
          {/* ============================================================== */}
          <div
            className="w-full lg:w-[320px] shrink-0 space-y-6"
            style={{ padding: "0px 20px" }}
          >
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-7 flex flex-col items-center text-center">
              {/* Avatar with Circular Edit Badge */}
              <div  style={{marginTop:'10px'}}F className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md bg-teal-50 flex items-center justify-center text-teal-600 text-3xl font-bold">
                  <img
                    src={getAvatarUrl(user.image)}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Edit Photo Icon Button */}
                <button
                  type="button"
                  onClick={handleOpenEditModal}
                  aria-label="Change Profile Photo"
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#14b8a6] hover:bg-[#0da291] text-white flex items-center justify-center shadow-md transition-all duration-200 cursor-pointer focus:outline-none"
                  title="Change photo"
                >
                  <FiEdit3 className="text-sm stroke-2" />
                </button>
              </div>

              {/* User Name & Role Pill */}
              <h2 className="text-2xl font-black text-gray-900 mt-4 tracking-tight">
                {user.name}
              </h2>
              <div style={{fontSize:'15px'}} className="mt-1.5 inline-flex items-center px-3 py-0.5 bg-[#14b8a6]/10 text-[#14b8a6] text-xs font-bold rounded-full">
                Traveler
              </div>

              {/* Email & Location */}
              <div
                style={{ padding: "20px" , fontSize:'15px'}}
                className="mt-5 space-y-2 text-xs text-gray-500 w-full text-left pl-2"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FiMail className="text-gray-400 text-sm shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2.5 truncate">
                  <FiMapPin className="text-gray-400 text-sm shrink-0" />
                  <span className="truncate">
                    {user.address || "Kerala, India"}
                  </span>
                </div>
              </div>

              {/* Edit Profile Full-width Button */}
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="mt-6 w-full py-3 px-4 bg-[#14b8a6] hover:bg-[#0da291] text-white font-bold text-sm rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
              >
                <FiEdit3 className="text-base" />
                <span>Edit Profile</span>
              </button>

              {/* Navigation Menu Tabs */}
              <div
                style={{ padding: "10px" }}
                className="mt-6 pt-6 border-t border-gray-100 w-full space-y-1"
              >
                {/* 1. My Profile Tab */}
                <button
                  style={{ marginTop: "10px", padding: "10px" }}
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer focus:outline-none ${
                    activeTab === "profile"
                      ? "bg-[#14b8a6]/10 text-[#14b8a6]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FiUser className="text-lg shrink-0 stroke-2" />
                  <span>My Profile</span>
                </button>

                {/* 2. My Bookings Tab */}
                <button
                  style={{ marginTop: "10px", padding: "10px" }}
                  type="button"
                  onClick={() => setActiveTab("bookings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer focus:outline-none ${
                    activeTab === "bookings"
                      ? "bg-[#14b8a6]/10 text-[#14b8a6]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FiCalendar className="text-lg shrink-0 stroke-2" />
                  <span>My Bookings</span>
                </button>

                {/* 3. Saved Destinations Tab */}
                <button
                  style={{ marginTop: "10px", padding: "10px" }}
                  type="button"
                  onClick={() => setActiveTab("saved")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer focus:outline-none ${
                    activeTab === "saved"
                      ? "bg-[#14b8a6]/10 text-[#14b8a6]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FiHeart className="text-lg shrink-0 stroke-2" />
                  <span>Saved Destinations</span>
                </button>

                {/* 4. Security Tab */}
                <button
                  style={{ marginTop: "10px", padding: "10px" }}
                  type="button"
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer focus:outline-none ${
                    activeTab === "security"
                      ? "bg-[#14b8a6]/10 text-[#14b8a6]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FiShield className="text-lg shrink-0 stroke-2" />
                  <span>Security</span>
                </button>

                {/* 5. Logout Option */}
                <button
                  style={{ marginTop: "10px", padding: "10px" }}
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all text-left cursor-pointer focus:outline-none mt-2"
                >
                  <FiLogOut className="text-lg shrink-0 stroke-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: Hero Banner, Stats, Information & Bookings       */}
          {/* ============================================================== */}
          <div className="flex-1 w-full space-y-6">
            {/* 1. Hero Welcome Banner Card */}
            <div
              style={{ padding: "20px" }}
              className="bg-gradient-to-r from-teal-50 via-teal-50/70 to-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-teal-100/70 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
            >
              <div className="flex-1 text-left z-10">
                <span className="text-xs font-black tracking-widest text-[#14b8a6] uppercase">
                  Your Wanderly Account
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1.5 tracking-tight">
                  Welcome back, {user.name}!
                </h1>
                <p
                  style={{ marginTop: "10px" }}
                  className="text-gray-500 text-sm mt-2 max-w-md"
                >
                  Manage your profile and keep your next adventure close.
                </p>
              </div>

              {/* Scenic Landscape Image Badge */}
              <div className="w-full md:w-64 h-32 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white/80">
                <img
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                  alt="Scenic landscape"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 2. Stats Cards Row */}
            <div
              style={{ marginTop: "20px" }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {/* Card 1: Total Bookings */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-xl shrink-0">
                  <FiCalendar className="stroke-2" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Total Bookings
                  </span>
                  <span className="text-2xl font-black text-gray-900 block mt-0.5">
                    {String(userBookings.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Card 2: Upcoming Trips */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-xl shrink-0">
                  <FiSend className="stroke-2" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Upcoming Trips
                  </span>
                  <span className="text-2xl font-black text-gray-900 block mt-0.5">
                    02
                  </span>
                </div>
              </div>

              {/* Card 3: Saved Places */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-xl shrink-0">
                  <FiHeart className="stroke-2" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    Saved Places
                  </span>
                  <span className="text-2xl font-black text-gray-900 block mt-0.5">
                    08
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* TAB CONTENT 1: PROFILE OVERVIEW (Personal Info + Bookings)     */}
            {/* ============================================================== */}
            {activeTab === "profile" && (
              <>
                {/* 3. Personal Information Card */}
                <div
                  style={{ marginTop: "20px", padding: "20px" }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-lg">
                        <FiUser className="stroke-2" />
                      </div>
                      <h2 className="text-lg font-black text-gray-900 tracking-tight">
                        Personal Information
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenEditModal}
                      className="text-xs font-bold text-[#14b8a6] hover:text-[#0da291] flex items-center gap-1.5 cursor-pointer focus:outline-none"
                    >
                      <FiEdit className="text-sm" />
                      <span>Edit details</span>
                    </button>
                  </div>

                  {/* 2-Column Details Grid */}
                  <div
                    style={{ marginTop: "10px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 pt-6"
                  >
                    {/* Full Name */}
                    <div className="flex items-start gap-3.5">
                      <FiUser className="text-gray-400 text-lg mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                          Full Name
                        </span>
                        <span className="text-sm font-bold text-gray-800 block mt-0.5">
                          {user.name}
                        </span>
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="flex items-start gap-3.5">
                      <FiCalendar className="text-gray-400 text-lg mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                          Date of Birth
                        </span>
                        <span className="text-sm font-bold text-gray-800 block mt-0.5">
                          {user.dob ? user.dob : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3.5">
                      <FiMail className="text-gray-400 text-lg mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                          Email
                        </span>
                        <span className="text-sm font-bold text-gray-800 block mt-0.5">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="flex items-start gap-3.5">
                      <span className="text-gray-400 text-lg font-bold mt-0.5 shrink-0">
                        ⚤
                      </span>
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                          Gender
                        </span>
                        <span className="text-sm font-bold text-gray-800 block mt-0.5">
                          {user.gender ? user.gender : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3.5">
                      <FiPhone className="text-gray-400 text-lg mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                          Phone
                        </span>
                        <span className="text-sm font-bold text-gray-800 block mt-0.5">
                          {user.mobileNumber ? user.mobileNumber : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Country / Address */}
                    <div className="flex items-start gap-3.5">
                      <FiMapPin className="text-gray-400 text-lg mt-0.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                          Country / Address
                        </span>
                        <span className="text-sm font-bold text-gray-800 block mt-0.5">
                          {user.country ? user.country : "India"}
                          {user.address ? ` (${user.address})` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Recent Bookings Card */}
                <div
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100"
                  style={{
                    marginTop: "20px",
                    marginBottom: "30px",
                    padding: "20px",
                  }}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-lg">
                        <BiBriefcaseAlt2 className="stroke-1" />
                      </div>
                      <h2 className="text-lg font-black text-gray-900 tracking-tight">
                        Recent Bookings
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab("bookings")}
                      className="text-xs font-bold text-[#14b8a6] hover:text-[#0da291] flex items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      <span>View all</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* List of Bookings */}
                  <div
                    style={{ marginTop: "10px" }}
                    className="divide-y divide-gray-100 pt-2"
                  >
                    {userBookings.length === 0 ? (
                      <p className="text-sm text-gray-500 py-4 text-center">No bookings yet.</p>
                    ) : (
                      userBookings.slice(0, 3).map((b) => (
                        <div
                          key={b.id || b._id}
                          className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-gray-50/50 p-2 rounded-2xl transition"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={b.image}
                              alt={b.title}
                              className="w-16 h-14 rounded-2xl object-cover shrink-0 shadow-sm"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 uppercase tracking-wider">
                                  {b.type}
                                </span>
                              </div>
                              <h3 className="font-bold text-gray-900 text-sm group-hover:text-[#14b8a6] transition-colors mt-0.5">
                                {b.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <FiMapPin className="text-[11px]" />
                                  {b.location}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <FiCalendar className="text-[11px]" />
                                  {b.dates}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                b.status === "Confirmed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : b.status === "Cancelled"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {b.status}
                            </span>
                            <FiChevronRight className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ============================================================== */}
            {/* TAB CONTENT 2: ALL BOOKINGS                                    */}
            {/* ============================================================== */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-lg">
                      <FiCalendar className="stroke-2" />
                    </div>
                    <h2 className="text-lg font-black text-gray-900">
                      My Tour & Taxi Bookings
                    </h2>
                  </div>
                  <Link
                    to="/destinations"
                    className="text-xs font-bold text-[#14b8a6] hover:underline"
                  >
                    + Book New Visit / Tour
                  </Link>
                </div>

                <div className="divide-y divide-gray-100 pt-2">
                  {userBookings.length === 0 ? (
                    <p className="text-sm text-gray-500 py-8 text-center">No bookings found yet. Explore Destinations and Tour Packages to make your first booking!</p>
                  ) : (
                    userBookings.map((b) => (
                      <div
                        key={b.id || b._id}
                        className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={b.image}
                            alt={b.title}
                            className="w-20 h-16 rounded-2xl object-cover shrink-0 shadow-sm"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                                Booking ID: {b.id}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 uppercase tracking-wider">
                                {b.type}
                              </span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-base mt-0.5">
                              {b.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FiMapPin className="text-xs text-[#14b8a6]" />
                                {b.location}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <FiCalendar className="text-xs text-[#14b8a6]" />
                                {b.dates}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3.5 py-1 rounded-full text-xs font-bold ${
                              b.status === "Confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : b.status === "Cancelled"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB CONTENT 3: SAVED DESTINATIONS                              */}
            {/* ============================================================== */}
            {activeTab === "saved" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-lg">
                    <FiHeart className="stroke-2" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900">
                    Saved Destinations (8)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                  {[
                    {
                      name: "Varkala Cliff Beach",
                      place: "Varkala, Kerala",
                      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
                    },
                    {
                      name: "Athirappilly Waterfalls",
                      place: "Thrissur, Kerala",
                      img: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=400&q=80",
                    },
                    {
                      name: "Vagamon Pine Forest",
                      place: "Idukki, Kerala",
                      img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80",
                    },
                    {
                      name: "Kumarakom Bird Sanctuary",
                      place: "Kottayam, Kerala",
                      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-2xl p-3 flex items-center gap-3.5 hover:shadow-md transition"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 truncate">
                        <h3 className="font-bold text-sm text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <FiMapPin className="text-[11px] text-[#14b8a6]" />
                          {item.place}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove saved place"
                        className="p-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB CONTENT 4: SECURITY & PASSWORD                             */}
            {/* ============================================================== */}
            {activeTab === "security" && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-lg">
                    <FiShield className="stroke-2" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900">
                    Account Security
                  </h2>
                </div>

                <div className="pt-6 max-w-md space-y-4">
                  <p className="text-xs text-gray-500">
                    Keep your account secure with a strong password and
                    multi-factor authentication.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Registered Email
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.email}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      alert("Password reset instructions sent to " + user.email)
                    }
                    className="py-3 px-6 bg-[#14b8a6] hover:bg-[#0da291] text-white font-bold text-sm rounded-2xl shadow-sm transition cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* EDIT PROFILE MODAL (Add, Edit, Delete Personal Details)         */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 my-auto text-left animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition flex items-center justify-center text-lg cursor-pointer focus:outline-none"
            >
              <FiX />
            </button>

            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center text-xl">
                <FiEdit3 />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  Edit Personal Details
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update your contact info, location, and avatar photo
                </p>
              </div>
            </div>

            {/* Success Message */}
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2">
                <FiCheckCircle className="text-base shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Photo Section (Upload, URL, or Remove) */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200 shrink-0">
                    <img
                      src={getAvatarUrl(editForm.image)}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-[#14b8a6] hover:bg-[#0da291] text-white text-xs font-bold rounded-xl transition shadow-sm inline-flex items-center gap-1.5">
                        <FiUploadCloud />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>

                      {editForm.image && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold rounded-xl transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FiTrash2 />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400 block font-normal">
                      Upload PNG or JPG under 10MB
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={editForm.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#14b8a6] focus:bg-white transition"
                />
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address (Immutable)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-2xl text-sm font-medium text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={editForm.mobileNumber}
                  onChange={handleFormChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#14b8a6] focus:bg-white transition"
                />
              </div>

              {/* Two Column Row: DOB & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date of Birth */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date of Birth
                    </label>
                    {editForm.dob && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm((prev) => ({ ...prev, dob: "" }))
                        }
                        className="text-[11px] text-red-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="date"
                    name="dob"
                    value={editForm.dob}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#14b8a6] focus:bg-white transition"
                  />
                </div>

                {/* Gender */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Gender
                    </label>
                    {editForm.gender && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm((prev) => ({ ...prev, gender: "" }))
                        }
                        className="text-[11px] text-red-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <select
                    name="gender"
                    value={editForm.gender}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#14b8a6] focus:bg-white transition"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Address / Location */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Address / City
                  </label>
                  {editForm.address && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditForm((prev) => ({ ...prev, address: "" }))
                      }
                      className="text-[11px] text-red-500 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="address"
                  value={editForm.address}
                  onChange={handleFormChange}
                  placeholder="e.g. Aluva, Kochi, Kerala"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#14b8a6] focus:bg-white transition"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={editForm.country}
                  onChange={handleFormChange}
                  placeholder="India"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#14b8a6] focus:bg-white transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-2xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-6 py-2.5 bg-[#14b8a6] hover:bg-[#0da291] text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
                >
                  {saveLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
