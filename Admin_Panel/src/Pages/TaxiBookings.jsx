import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";

const API_BASE_URL = "http://localhost:5000/api/taxi-bookings";

const STATUS_BADGE_CLASSES = {
  Pending: "badge text-bg-warning",
  Confirmed: "badge text-bg-primary",
  Completed: "badge text-bg-success",
  Cancelled: "badge text-bg-danger",
};

const TaxiBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null); // For View Modal

  // 1. Fetch bookings from backend API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const url =
        statusFilter === "All"
          ? API_BASE_URL
          : `${API_BASE_URL}?status=${statusFilter}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch taxi bookings");
      }
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching taxi bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  // 2. Fast Inline Status Update
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update status");
      }

      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => ((b._id || b.id) === id ? updated : b))
      );
    } catch (err) {
      console.error("Error updating booking status:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  // 3. Delete Booking
  const handleDeleteBooking = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this taxi booking record?"
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete booking");
      }

      setBookings((prev) => prev.filter((b) => (b._id || b.id) !== id));
      alert("Taxi booking record deleted successfully! 🗑️");
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking: " + err.message);
    }
  };

  // Summary counts for filter pill badges
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "Confirmed"
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "Completed"
  ).length;

  return (
    <div className="d-flex">
      <Sidebar />

      <div
        className="p-4 bg-light"
        style={{
          flex: 1,
          minHeight: "100vh",
        }}
      >
        {/* Top Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Taxi Bookings</h2>
            <p className="text-muted mb-0">
              Manage online taxi reservations, routes, pickup schedules & driver updates
            </p>
          </div>

          {/* Quick Refresh Button */}
          <button
            type="button"
            className="btn btn-outline-secondary fw-semibold shadow-sm"
            onClick={fetchBookings}
          >
            🔄 Refresh List
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(
            (tab) => {
              const isActive = statusFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`btn btn-sm px-3 py-2 rounded-pill fw-semibold transition ${
                    isActive
                      ? "text-white shadow-sm"
                      : "btn-outline-secondary bg-white"
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: "#14B8A6", borderColor: "#14B8A6" }
                      : {}
                  }
                >
                  {tab === "All" && `All Bookings (${totalCount})`}
                  {tab === "Pending" && `⏳ Pending (${pendingCount})`}
                  {tab === "Confirmed" && `✅ Confirmed (${confirmedCount})`}
                  {tab === "Completed" && `🏁 Completed (${completedCount})`}
                  {tab === "Cancelled" && `❌ Cancelled`}
                </button>
              );
            }
          )}
        </div>

        {/* Table Card */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Passenger</th>
                    <th scope="col">Pickup & Drop Location</th>
                    <th scope="col">Date & Time</th>
                    <th scope="col">Vehicle & Pax</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <div
                          className="spinner-border"
                          style={{ color: "#14B8A6" }}
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mt-2 mb-0">
                          Loading taxi bookings...
                        </p>
                      </td>
                    </tr>
                  ) : bookings.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <div className="display-6 mb-2">🚕</div>
                        <p className="fw-semibold mb-1">
                          No taxi bookings found.
                        </p>
                        <small>
                          New booking requests submitted from Wanderly UI will appear here in real time.
                        </small>
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking, index) => {
                      const bookingId = booking._id || booking.id;

                      return (
                        <tr key={bookingId}>
                          {/* Index */}
                          <td className="text-muted">{index + 1}</td>

                          {/* Passenger Info */}
                          <td>
                            <div className="fw-bold text-dark">
                              {booking.customerName}
                            </div>
                            <div className="small text-secondary">
                              📞 {booking.phone}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "11px" }}
                            >
                              ✉️ {booking.email}
                            </div>
                          </td>

                          {/* Pickup & Drop */}
                          <td>
                            <div className="d-flex align-items-center gap-1.5 small text-dark fw-semibold">
                              <span className="text-success">📍</span>
                              <span>{booking.pickupLocation}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1.5 small text-muted mt-1">
                              <span className="text-danger">🏁</span>
                              <span>{booking.dropLocation}</span>
                            </div>
                          </td>

                          {/* Date & Time */}
                          <td>
                            <div className="fw-semibold text-dark small">
                              📅 {booking.pickupDate}
                            </div>
                            <div className="text-secondary small">
                              ⏰ {booking.pickupTime}
                            </div>
                          </td>

                          {/* Vehicle & Passengers */}
                          <td>
                            <span className="badge bg-light text-dark border">
                              {booking.vehicleType}
                            </span>
                            <div className="small text-muted mt-1">
                              👥 {booking.passengers} Passenger(s)
                            </div>
                          </td>

                          {/* Status with Quick Select */}
                          <td>
                            <select
                              value={booking.status}
                              onChange={(e) =>
                                handleStatusChange(bookingId, e.target.value)
                              }
                              className={`form-select form-select-sm fw-semibold ${
                                booking.status === "Pending"
                                  ? "border-warning text-dark bg-warning-subtle"
                                  : booking.status === "Confirmed"
                                  ? "border-primary text-primary bg-primary-subtle"
                                  : booking.status === "Completed"
                                  ? "border-success text-success bg-success-subtle"
                                  : "border-danger text-danger bg-danger-subtle"
                              }`}
                              style={{ width: "130px", cursor: "pointer" }}
                            >
                              <option value="Pending">⏳ Pending</option>
                              <option value="Confirmed">✅ Confirmed</option>
                              <option value="Completed">🏁 Completed</option>
                              <option value="Cancelled">❌ Cancelled</option>
                            </select>
                          </td>

                          {/* Action Buttons */}
                          <td className="text-end">
                            <div className="d-flex align-items-center justify-content-end gap-1.5">
                              {booking.status === "Pending" && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-success fw-semibold shadow-sm"
                                  style={{ fontSize: "12px" }}
                                  onClick={() => handleStatusChange(bookingId, "Confirmed")}
                                  title="Confirm / Approve Taxi Booking"
                                >
                                  ✅ Approve
                                </button>
                              )}
                              <div className="btn-group btn-group-sm">
                                {/* View Details */}
                                <button
                                  type="button"
                                  className="btn btn-outline-info"
                                  title="View Trip Details"
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  👁️ View
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  title="Delete Record"
                                  onClick={() => handleDeleteBooking(bookingId)}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* View Details Modal */}
        {selectedBooking && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    🚕 Taxi Booking Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedBooking(null)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Booking Reference:</span>
                      <strong className="font-monospace text-dark">
                        #{selectedBooking._id?.slice(-6).toUpperCase()}
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Current Status:</span>
                      <span
                        className={
                          STATUS_BADGE_CLASSES[selectedBooking.status] ||
                          "badge text-bg-secondary"
                        }
                      >
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <h6 className="fw-bold text-dark border-bottom pb-1 mb-2">
                        Passenger Details
                      </h6>
                      <p className="mb-1">
                        <strong>Name:</strong> {selectedBooking.customerName}
                      </p>
                      <p className="mb-1">
                        <strong>Phone:</strong> {selectedBooking.phone}
                      </p>
                      <p className="mb-0">
                        <strong>Email:</strong> {selectedBooking.email}
                      </p>
                    </div>

                    <div className="col-12">
                      <h6 className="fw-bold text-dark border-bottom pb-1 mb-2">
                        Trip Route & Schedule
                      </h6>
                      <p className="mb-1">
                        <strong>📍 Pickup:</strong> {selectedBooking.pickupLocation}
                      </p>
                      <p className="mb-1">
                        <strong>🏁 Drop:</strong> {selectedBooking.dropLocation}
                      </p>
                      <p className="mb-1">
                        <strong>📅 Date:</strong> {selectedBooking.pickupDate}
                      </p>
                      <p className="mb-0">
                        <strong>⏰ Time:</strong> {selectedBooking.pickupTime}
                      </p>
                    </div>

                    <div className="col-12">
                      <h6 className="fw-bold text-dark border-bottom pb-1 mb-2">
                        Vehicle & Requirements
                      </h6>
                      <p className="mb-1">
                        <strong>Vehicle Type:</strong> {selectedBooking.vehicleType}
                      </p>
                      <p className="mb-2">
                        <strong>Passengers:</strong> {selectedBooking.passengers}
                      </p>

                      {selectedBooking.notes && (
                        <div className="p-2 bg-light rounded-2 border">
                          <small className="text-muted d-block fw-bold">
                            Special Requests / Notes:
                          </small>
                          <small className="text-dark">
                            {selectedBooking.notes}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedBooking(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxiBookings;
