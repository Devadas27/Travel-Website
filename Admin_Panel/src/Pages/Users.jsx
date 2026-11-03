import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";

const API_BASE_URL = "http://localhost:5000/api/user-registration";

const defaultAvatar =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // State for Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    user: null,
    isDeleting: false,
  });

  // 1. Fetch Users from Backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/users`);
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      if (data && data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Delete User Action
  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      const res = await fetch(`${API_BASE_URL}/users/${deleteModal.user._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u._id !== deleteModal.user._id));
      setDeleteModal({ isOpen: false, user: null, isDeleting: false });
      alert("User deleted successfully! 🗑️");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user: " + err.message);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Helper to format avatar URL
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

  // Filter & Search Logic
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.mobileNumber && String(u.mobileNumber).includes(query)) ||
      (u.address && u.address.toLowerCase().includes(query)) ||
      (u.country && u.country.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Online" && u.isOnline) ||
      (statusFilter === "Offline" && !u.isOnline);

    return matchesSearch && matchesStatus;
  });

  // Summary counts
  const totalCount = users.length;
  const onlineCount = users.filter((u) => u.isOnline).length;
  const offlineCount = users.filter((u) => !u.isOnline).length;

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
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Users Management</h2>
            <p className="text-muted mb-0">
              Manage registered users, monitor login activity, and view booking history
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="btn btn-outline-secondary fw-semibold d-inline-flex align-items-center gap-2 align-self-start align-self-md-auto"
            title="Refresh Users"
          >
            🔄 Refresh List
          </button>
        </div>

        {/* Summary Stat Cards */}
        <div className="row g-4 mb-4">
          {/* Card 1: Total Users */}
          <div className="col-12 col-sm-6 col-xl-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4 d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center shrink-0"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: "#CCFBF1",
                    fontSize: "24px",
                  }}
                >
                  👥
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-dark">{totalCount}</h3>
                  <p className="text-muted mb-0 small">Total Registered Users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Logged In / Online */}
          <div className="col-12 col-sm-6 col-xl-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4 d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center shrink-0"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: "#DCFCE7",
                    fontSize: "24px",
                  }}
                >
                  🟢
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-success">{onlineCount}</h3>
                  <p className="text-muted mb-0 small">Currently Logged In</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Logged Out / Offline */}
          <div className="col-12 col-sm-6 col-xl-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4 d-flex align-items-center gap-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center shrink-0"
                  style={{
                    width: "52px",
                    height: "52px",
                    backgroundColor: "#FEE2E2",
                    fontSize: "24px",
                  }}
                >
                  🔴
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-danger">{offlineCount}</h3>
                  <p className="text-muted mb-0 small">Logged Out / Offline</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3">
            <div className="row g-3 align-items-center">
              {/* Search Field */}
              <div className="col-12 col-md-7 col-lg-8">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    🔍
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Search by user name, email, phone number, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="btn btn-outline-secondary border-start-0"
                      onClick={() => setSearchQuery("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="col-12 col-md-5 col-lg-4 d-flex align-items-center justify-content-md-end gap-2">
                <label className="text-muted small fw-semibold text-nowrap mb-0">
                  Status:
                </label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Users ({totalCount})</option>
                  <option value="Online">🟢 Logged In ({onlineCount})</option>
                  <option value="Offline">🔴 Logged Out ({offlineCount})</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table Card */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-teal"
                style={{ color: "#14B8A6" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-2 mb-0">Loading registered users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <div className="display-6 mb-2">👤</div>
              <h5 className="fw-bold text-dark">No Users Found</h5>
              <p className="text-muted mb-0">
                {searchQuery || statusFilter !== "All"
                  ? "No users matched your search criteria."
                  : "No registered users in the database yet."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4 py-3 text-secondary text-uppercase small fw-bold">
                      User
                    </th>
                    <th className="py-3 text-secondary text-uppercase small fw-bold">
                      Email
                    </th>
                    <th className="py-3 text-secondary text-uppercase small fw-bold">
                      Phone Number
                    </th>
                    <th className="py-3 text-secondary text-uppercase small fw-bold">
                      Location
                    </th>
                    <th className="py-3 text-secondary text-uppercase small fw-bold text-center">
                      Login Activity
                    </th>
                    <th className="py-3 text-secondary text-uppercase small fw-bold">
                      Joined Date
                    </th>
                    <th className="pe-4 py-3 text-secondary text-uppercase small fw-bold text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      {/* User Avatar + Clickable Name */}
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={getAvatarUrl(user.image)}
                            alt={user.name}
                            className="rounded-circle object-fit-cover shadow-sm border"
                            style={{ width: "42px", height: "42px" }}
                          />
                          <div>
                            <Link
                              to={`/users/${user._id}`}
                              className="fw-bold text-dark text-decoration-none d-block hover-teal"
                              style={{ color: "#111827" }}
                              title="Click to view full user profile & bookings"
                            >
                              {user.name}
                            </Link>
                            <span
                              className="badge rounded-pill fw-semibold"
                              style={{
                                backgroundColor: "#CCFBF1",
                                color: "#0F766E",
                                fontSize: "10px",
                              }}
                            >
                              Traveler
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 text-muted">{user.email}</td>

                      {/* Phone */}
                      <td className="py-3 text-muted">
                        {user.mobileNumber || "—"}
                      </td>

                      {/* Location */}
                      <td className="py-3 text-muted">
                        {user.address || user.country
                          ? `${user.address ? user.address + ", " : ""}${user.country || "India"}`
                          : "—"}
                      </td>

                      {/* Login Activity Button / Badge */}
                      <td className="py-3 text-center">
                        {user.isOnline ? (
                          <span
                            className="badge px-3 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-1 shadow-sm"
                            style={{
                              backgroundColor: "#DCFCE7",
                              color: "#15803D",
                              border: "1px solid #86EFAC",
                            }}
                          >
                            <span
                              className="rounded-circle bg-success d-inline-block"
                              style={{ width: "8px", height: "8px" }}
                            ></span>
                            Logged In
                          </span>
                        ) : (
                          <span
                            className="badge px-3 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-1"
                            style={{
                              backgroundColor: "#FEE2E2",
                              color: "#B91C1C",
                              border: "1px solid #FCA5A5",
                            }}
                          >
                            <span
                              className="rounded-circle bg-danger d-inline-block"
                              style={{ width: "8px", height: "8px" }}
                            ></span>
                            Logged Out
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 text-muted small">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </td>

                      {/* Actions: View Details & Delete (NO EDIT) */}
                      <td className="pe-4 py-3 text-end">
                        <div className="d-inline-flex gap-2">
                          {/* View Details Button */}
                          <button
                            type="button"
                            onClick={() => navigate(`/users/${user._id}`)}
                            className="btn btn-sm text-white fw-semibold px-3 rounded-3"
                            style={{ backgroundColor: "#14B8A6" }}
                            title="View Full Profile & Bookings"
                          >
                            👁️ View Details
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                user,
                                isDeleting: false,
                              })
                            }
                            className="btn btn-sm btn-outline-danger px-3 rounded-3 fw-semibold"
                            title="Delete User"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.user && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg p-2">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">
                  ⚠️ Confirm Delete User
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setDeleteModal({
                      isOpen: false,
                      user: null,
                      isDeleting: false,
                    })
                  }
                  disabled={deleteModal.isDeleting}
                ></button>
              </div>
              <div className="modal-body py-3">
                <p className="mb-2 text-dark">
                  Are you sure you want to delete the user account for:
                </p>
                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="fw-bold fs-6 text-dark">
                    {deleteModal.user.name}
                  </div>
                  <div className="text-muted small">
                    {deleteModal.user.email}
                  </div>
                  {deleteModal.user.mobileNumber && (
                    <div className="text-muted small">
                      Phone: {deleteModal.user.mobileNumber}
                    </div>
                  )}
                </div>
                <p className="text-danger small mb-0">
                  ⚠️ This action is permanent and cannot be undone.
                </p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-light rounded-3 fw-semibold px-4"
                  onClick={() =>
                    setDeleteModal({
                      isOpen: false,
                      user: null,
                      isDeleting: false,
                    })
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

export default Users;
