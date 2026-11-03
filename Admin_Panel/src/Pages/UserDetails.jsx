import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";

const API_BASE_URL = "http://localhost:5000/api";

const defaultAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

const STATUS_BADGE_CLASSES = {
  Pending: "badge text-bg-warning",
  Confirmed: "badge text-bg-primary",
  Completed: "badge text-bg-success",
  Cancelled: "badge text-bg-danger",
};

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Booking activities states
  const [taxiBookings, setTaxiBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [places, setPlaces] = useState([]);
  const [activeTab, setActiveTab] = useState("taxi");

  // State for Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    isDeleting: false,
  });

  // 1. Fetch User by ID
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/user-registration/users/${id}`);
      if (!res.ok) {
        throw new Error("Failed to load user details");
      }
      const data = await res.json();
      if (data && data.success && data.user) {
        setUser(data.user);
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch User's Booking Activities (Taxi, Packages, Places)
  const fetchUserActivities = async (userEmail, userPhone) => {
    try {
      // Fetch Taxi Bookings
      const taxiRes = await fetch(`${API_BASE_URL}/taxi-bookings`);
      if (taxiRes.ok) {
        const allTaxi = await taxiRes.json();
        if (Array.isArray(allTaxi)) {
          const matched = allTaxi.filter(
            (b) =>
              (b.email &&
                userEmail &&
                b.email.toLowerCase() === userEmail.toLowerCase()) ||
              (b.phone && userPhone && String(b.phone) === String(userPhone))
          );
          setTaxiBookings(matched);
        }
      }

      // Fetch Tourist Packages Bookings
      const pkgRes = await fetch(`${API_BASE_URL}/package-bookings`);
      if (pkgRes.ok) {
        const allPkgs = await pkgRes.json();
        if (Array.isArray(allPkgs)) {
          const matched = allPkgs.filter(
            (b) =>
              (b.email &&
                userEmail &&
                b.email.toLowerCase() === userEmail.toLowerCase()) ||
              (b.phone && userPhone && String(b.phone) === String(userPhone))
          );
          setPackages(matched);
        }
      }

      // Fetch Tourist Places Bookings
      const placeRes = await fetch(`${API_BASE_URL}/place-bookings`);
      if (placeRes.ok) {
        const allPlaces = await placeRes.json();
        if (Array.isArray(allPlaces)) {
          const matched = allPlaces.filter(
            (b) =>
              (b.email &&
                userEmail &&
                b.email.toLowerCase() === userEmail.toLowerCase()) ||
              (b.phone && userPhone && String(b.phone) === String(userPhone))
          );
          setPlaces(matched);
        }
      }
    } catch (err) {
      console.warn("Could not load booking activities:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      fetchUserActivities(user.email, user.mobileNumber);
    }
  }, [user]);

  // 3. Toggle Status (Online / Offline)
  const handleToggleStatus = async () => {
    if (!user) return;
    try {
      const nextStatus = !user.isOnline;
      const res = await fetch(
        `${API_BASE_URL}/user-registration/users/${user._id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isOnline: nextStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      if (data && data.success && data.user) {
        setUser((prev) => ({ ...prev, isOnline: data.user.isOnline }));
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to toggle status: " + err.message);
    }
  };

  // 4. Delete User
  const handleDeleteUser = async () => {
    if (!user) return;
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      const res = await fetch(
        `${API_BASE_URL}/user-registration/users/${user._id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete user");
      }

      alert("User deleted successfully! 🗑️");
      navigate("/users");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user: " + err.message);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Format avatar URL
  const getAvatarUrl = (img) => {
    if (!img) return defaultAvatar;
    if (
      img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("data:")
    ) {
      return img;
    }
    return `http://localhost:5000${img.startsWith("/") ? "" : "/"}${img}`;
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className="p-4 bg-light"
        style={{
          flex: 1,
          minHeight: "100vh",
        }}
      >
        {/* Navigation Breadcrumb & Back Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="btn btn-outline-secondary fw-semibold d-inline-flex align-items-center gap-2 rounded-3 shadow-sm"
          >
            ← Back to Users List
          </button>

          {user && (
            <button
              type="button"
              onClick={() => setDeleteModal({ isOpen: true, isDeleting: false })}
              className="btn btn-outline-danger fw-semibold d-inline-flex align-items-center gap-2 rounded-3"
              title="Delete this user account"
            >
              🗑️ Delete User
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-teal"
              style={{ color: "#14B8A6" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2">Loading user details...</p>
          </div>
        ) : error ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
            <div className="display-5 text-danger mb-3">⚠️</div>
            <h4 className="fw-bold text-dark">{error}</h4>
            <p className="text-muted">
              We couldn't find the requested user profile. It may have been removed.
            </p>
            <div>
              <Link to="/users" className="btn btn-primary rounded-3 px-4">
                Return to Users List
              </Link>
            </div>
          </div>
        ) : !user ? null : (
          <div className="space-y-4">
            {/* Top User Hero Card */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
              <div
                className="p-4 p-md-5"
                style={{
                  background:
                    "linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 50%, #E0F2FE 100%)",
                  borderBottom: "1px solid #99F6E4",
                }}
              >
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
                  {/* Left: Avatar + Details */}
                  <div className="d-flex align-items-center gap-4">
                    <img
                      src={getAvatarUrl(user.image)}
                      alt={user.name}
                      className="rounded-circle object-fit-cover shadow border border-3 border-white"
                      style={{ width: "96px", height: "96px" }}
                    />
                    <div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                        <h2 className="fw-bold text-dark mb-0">{user.name}</h2>
                        <span
                          className="badge rounded-pill fw-semibold px-3 py-1"
                          style={{
                            backgroundColor: "#14B8A6",
                            color: "white",
                            fontSize: "12px",
                          }}
                        >
                          Customer / Traveler
                        </span>
                      </div>
                      <div className="text-muted small mb-1">
                        ✉️ {user.email} &nbsp;•&nbsp; 📞 {user.mobileNumber || "No phone"}
                      </div>
                      <div className="text-secondary small">
                        📍 {user.address || "Kerala"}, {user.country || "India"}
                      </div>
                    </div>
                  </div>

                  {/* Right: Login Activity Button */}
                  <div className="text-md-end">
                    <span className="text-muted small d-block mb-1 text-uppercase fw-bold">
                      Login Activity Status
                    </span>
                    {user.isOnline ? (
                      <button
                        type="button"
                        onClick={handleToggleStatus}
                        className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                        title="Click to toggle status"
                      >
                        <span
                          className="rounded-circle bg-white d-inline-block"
                          style={{ width: "10px", height: "10px" }}
                        ></span>
                        🟢 Active / Currently Logged In
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleToggleStatus}
                        className="btn btn-danger fw-bold px-4 py-2 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                        title="Click to toggle status"
                      >
                        <span
                          className="rounded-circle bg-white d-inline-block"
                          style={{ width: "10px", height: "10px" }}
                        ></span>
                        🔴 Logged Out / Inactive
                      </button>
                    )}
                    <small className="d-block text-muted mt-1 fst-italic">
                      (Click button to toggle status)
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details Information Grid */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold text-dark mb-0">
                  👤 Personal Information
                </h5>
                <p className="text-muted small mb-0">
                  Registered account details (Read-only for Admin)
                </p>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  {/* Full Name */}
                  <div className="col-12 col-sm-6 col-lg-4">
                    <span className="text-muted text-uppercase small fw-bold d-block">
                      Full Name
                    </span>
                    <span className="fw-bold fs-6 text-dark mt-1 d-block">
                      {user.name}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="col-12 col-sm-6 col-lg-4">
                    <span className="text-muted text-uppercase small fw-bold d-block">
                      Email Address
                    </span>
                    <span className="fw-bold fs-6 text-dark mt-1 d-block">
                      {user.email}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="col-12 col-sm-6 col-lg-4">
                    <span className="text-muted text-uppercase small fw-bold d-block">
                      Phone Number
                    </span>
                    <span className="fw-bold fs-6 text-dark mt-1 d-block">
                      {user.mobileNumber || "—"}
                    </span>
                  </div>

                  {/* Date of Birth */}
                  <div className="col-12 col-sm-6 col-lg-4">
                    <span className="text-muted text-uppercase small fw-bold d-block">
                      Date of Birth
                    </span>
                    <span className="fw-bold fs-6 text-dark mt-1 d-block">
                      {user.dob ? user.dob : "—"}
                    </span>
                  </div>

                  {/* Gender */}
                  <div className="col-12 col-sm-6 col-lg-4">
                    <span className="text-muted text-uppercase small fw-bold d-block">
                      Gender
                    </span>
                    <span className="fw-bold fs-6 text-dark mt-1 d-block">
                      {user.gender ? user.gender : "—"}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="col-12 col-sm-6 col-lg-4">
                    <span className="text-muted text-uppercase small fw-bold d-block">
                      Address / City
                    </span>
                    <span className="fw-bold fs-6 text-dark mt-1 d-block">
                      {user.address ? user.address : "—"}
                    </span>
                  </div>

                  {/* Country */}
                  <div className="col-12 col-sm-6 col-lg-4">
                    <span className="text-muted text-uppercase small fw-bold d-block">
                      Country
                    </span>
                    <span className="fw-bold fs-6 text-dark mt-1 d-block">
                      {user.country || "India"}
                    </span>
                  </div>

                  {/* Joined Date */}
                  <div className="col-12 col-sm-6 col-lg-4">
                    <span className="text-muted text-uppercase small fw-bold d-block">
                      Registration Date
                    </span>
                    <span className="fw-bold fs-6 text-dark mt-1 d-block">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </span>
                  </div>

                  {/* Last Active */}
                  <div className="col-12 col-sm-6 col-lg-4">
                    <span className="text-muted text-uppercase small fw-bold d-block">
                      Last Active Timestamp
                    </span>
                    <span className="fw-bold fs-6 text-dark mt-1 d-block">
                      {user.lastActive
                        ? new Date(user.lastActive).toLocaleString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Recently Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Activities Section */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                  <div>
                    <h5 className="fw-bold text-dark mb-0">
                      📅 User Booking Activities
                    </h5>
                    <p className="text-muted small mb-0">
                      Explore bookings made by this user for Taxi, Tourist Packages, and Places
                    </p>
                  </div>

                  {/* Navigation Tabs */}
                  <ul className="nav nav-pills gap-2">
                    <li className="nav-item">
                      <button
                        type="button"
                        onClick={() => setActiveTab("taxi")}
                        className={`nav-link rounded-pill fw-semibold px-3 py-1.5 ${
                          activeTab === "taxi"
                            ? "bg-dark text-white"
                            : "bg-light text-muted"
                        }`}
                      >
                        🚕 Taxi Bookings ({taxiBookings.length})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        onClick={() => setActiveTab("packages")}
                        className={`nav-link rounded-pill fw-semibold px-3 py-1.5 ${
                          activeTab === "packages"
                            ? "bg-dark text-white"
                            : "bg-light text-muted"
                        }`}
                      >
                        🎒 Tourist Packages ({packages.length})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        onClick={() => setActiveTab("places")}
                        className={`nav-link rounded-pill fw-semibold px-3 py-1.5 ${
                          activeTab === "places"
                            ? "bg-dark text-white"
                            : "bg-light text-muted"
                        }`}
                      >
                        📍 Tourist Places ({places.length})
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card-body p-4">
                {/* TAB 1: TAXI BOOKINGS */}
                {activeTab === "taxi" && (
                  <div>
                    {taxiBookings.length === 0 ? (
                      <div className="text-center py-4 bg-light rounded-3">
                        <div className="fs-3 mb-1">🚕</div>
                        <h6 className="fw-bold text-dark">No Taxi Bookings Yet</h6>
                        <p className="text-muted small mb-0">
                          This user has not placed any taxi booking with email{" "}
                          <strong>{user.email}</strong> or phone{" "}
                          <strong>{user.mobileNumber}</strong> yet.
                        </p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Pickup & Drop
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Date & Time
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Vehicle Type
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Passengers
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary text-end">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {taxiBookings.map((b) => (
                              <tr key={b._id || b.id}>
                                <td className="py-3">
                                  <div className="fw-bold text-dark">
                                    🟢 {b.pickupLocation}
                                  </div>
                                  <div className="text-muted small mt-0.5">
                                    🔴 {b.dropLocation}
                                  </div>
                                </td>
                                <td className="py-3 text-muted small">
                                  <div>📅 {b.pickupDate}</div>
                                  <div>⏰ {b.pickupTime}</div>
                                </td>
                                <td className="py-3 fw-semibold text-dark">
                                  {b.vehicleType}
                                </td>
                                <td className="py-3 text-muted">
                                  👥 {b.passengers || 1} Person(s)
                                </td>
                                <td className="py-3 text-end">
                                  <span
                                    className={
                                      STATUS_BADGE_CLASSES[b.status] ||
                                      "badge text-bg-secondary"
                                    }
                                  >
                                    {b.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: TOURIST PACKAGES */}
                {activeTab === "packages" && (
                  <div>
                    {packages.length === 0 ? (
                      <div className="text-center py-4 bg-light rounded-3">
                        <div className="fs-3 mb-1">🎒</div>
                        <h6 className="fw-bold text-dark">No Package Bookings</h6>
                        <p className="text-muted small mb-0">
                          No tourist package bookings registered for this traveler.
                        </p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Package Title
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Destination
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Duration
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Price
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary text-end">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {packages.map((pkg) => (
                              <tr key={pkg._id || pkg.id}>
                                <td className="py-3">
                                  <div className="fw-bold text-dark">
                                    {pkg.packageTitle || pkg.title}
                                  </div>
                                  <span className="badge bg-light text-secondary border small">
                                    {pkg.category || "Tour Package"}
                                  </span>
                                </td>
                                <td className="py-3 text-muted">
                                  📍 {pkg.destination}
                                </td>
                                <td className="py-3 text-muted small">
                                  ⏱️ {pkg.travelDate ? `📅 ${pkg.travelDate}` : pkg.duration}
                                </td>
                                <td className="py-3 fw-bold text-dark">
                                  ₹{pkg.price ? pkg.price.toLocaleString() : "4,999"}
                                </td>
                                <td className="py-3 text-end">
                                  <span
                                    className={
                                      STATUS_BADGE_CLASSES[pkg.status] ||
                                      "badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill"
                                    }
                                  >
                                    {pkg.status || "Confirmed"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: TOURIST PLACES */}
                {activeTab === "places" && (
                  <div>
                    {places.length === 0 ? (
                      <div className="text-center py-4 bg-light rounded-3">
                        <div className="fs-3 mb-1">📍</div>
                        <h6 className="fw-bold text-dark">No Visited Places</h6>
                        <p className="text-muted small mb-0">
                          No tourist places visited or planned yet.
                        </p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Place Name
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Location
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Date / Time Slot
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary">
                                Entry / Fee
                              </th>
                              <th className="py-2.5 small fw-bold text-secondary text-end">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {places.map((place) => (
                              <tr key={place._id || place.id}>
                                <td className="py-3 fw-bold text-dark">
                                  {place.placeName || place.name}
                                </td>
                                <td className="py-3 text-muted">
                                  📍 {place.location}
                                </td>
                                <td className="py-3">
                                  <span className="badge bg-info-subtle text-info-emphasis border">
                                    {place.visitDate ? `📅 ${place.visitDate} (${place.timeSlot || "Day"})` : (place.category || "Sightseeing")}
                                  </span>
                                </td>
                                <td className="py-3 fw-semibold text-dark">
                                  {place.price ? `₹${place.price}` : "Free"}
                                </td>
                                <td className="py-3 text-end">
                                  <span
                                    className={
                                      STATUS_BADGE_CLASSES[place.status] ||
                                      "badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill"
                                    }
                                  >
                                    {place.status || "Visited"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg p-2">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">
                  ⚠️ Confirm Delete User Account
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setDeleteModal({ isOpen: false, isDeleting: false })
                  }
                  disabled={deleteModal.isDeleting}
                ></button>
              </div>
              <div className="modal-body py-3">
                <p className="mb-2 text-dark">
                  Are you sure you want to permanently delete this user account?
                </p>
                {user && (
                  <div className="p-3 bg-light rounded-3 border mb-3">
                    <div className="fw-bold fs-6 text-dark">{user.name}</div>
                    <div className="text-muted small">{user.email}</div>
                  </div>
                )}
                <p className="text-danger small mb-0">
                  ⚠️ This action will completely remove the user from the database.
                </p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-light rounded-3 fw-semibold px-4"
                  onClick={() =>
                    setDeleteModal({ isOpen: false, isDeleting: false })
                  }
                  disabled={deleteModal.isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-3 fw-semibold px-4"
                  onClick={handleDeleteUser}
                  disabled={deleteModal.isDeleting}
                >
                  {deleteModal.isDeleting ? "Deleting..." : "Yes, Delete User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
