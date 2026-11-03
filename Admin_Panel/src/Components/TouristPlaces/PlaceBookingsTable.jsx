import React, { useState } from "react";

const STATUS_BADGES = {
  Pending: "badge bg-warning-subtle text-warning-emphasis border border-warning-subtle",
  Confirmed: "badge bg-success-subtle text-success border border-success-subtle",
  Cancelled: "badge bg-danger-subtle text-danger border border-danger-subtle",
};

const PlaceBookingsTable = ({
  bookings = [],
  handleStatusChange,
  handleDeleteBooking,
  loading = false,
}) => {
  const [filter, setFilter] = useState("All");

  const filteredBookings =
    filter === "All"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        {/* Header & Filter Row */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h5 className="fw-bold mb-1">Tourist Place Bookings</h5>
            <p className="text-muted mb-0 small">
              Manage visitor reservations, entry passes & approvals
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="d-flex gap-2">
            {[
              { id: "All", label: `All (${totalCount})` },
              { id: "Pending", label: `⏳ Pending (${pendingCount})` },
              { id: "Confirmed", label: `✅ Confirmed (${confirmedCount})` },
              { id: "Cancelled", label: `❌ Cancelled (${cancelledCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`btn btn-sm px-3 py-1.5 rounded-pill fw-semibold ${
                  filter === tab.id
                    ? "text-white"
                    : "btn-outline-secondary bg-white"
                }`}
                style={
                  filter === tab.id
                    ? { backgroundColor: "#14B8A6", borderColor: "#14B8A6" }
                    : {}
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th className="small fw-bold text-secondary">#ID</th>
                <th className="small fw-bold text-secondary">Customer</th>
                <th className="small fw-bold text-secondary">Place</th>
                <th className="small fw-bold text-secondary">Visit Date & Slot</th>
                <th className="small fw-bold text-secondary">Visitors</th>
                <th className="small fw-bold text-secondary">Price</th>
                <th className="small fw-bold text-secondary">Status</th>
                <th className="small fw-bold text-secondary text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <p className="mb-1 fw-semibold">No bookings found in this category.</p>
                    <small>When visitors book a place on the website, it will show up here.</small>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const bookingId = b._id || b.id;
                  const displayId = `PL-${String(bookingId).slice(-4).toUpperCase()}`;
                  const placeImg = b.placeImage
                    ? b.placeImage.startsWith("http")
                      ? b.placeImage
                      : `http://localhost:5000${b.placeImage.startsWith("/") ? "" : "/"}${b.placeImage}`
                    : "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80";

                  return (
                    <tr key={bookingId}>
                      {/* Booking ID */}
                      <td className="fw-bold text-secondary small">
                        {displayId}
                      </td>

                      {/* Customer Info */}
                      <td>
                        <div className="fw-bold text-dark small">{b.customerName}</div>
                        <div className="text-muted small">{b.email}</div>
                        {b.phone && <div className="text-secondary small">📞 {b.phone}</div>}
                      </td>

                      {/* Place Info */}
                      <td>
                        <div className="d-flex align-items-center gap-2.5">
                          <img
                            src={placeImg}
                            alt={b.placeName}
                            className="rounded-3 shadow-sm object-fit-cover"
                            style={{ width: "45px", height: "45px" }}
                          />
                          <div>
                            <div className="fw-bold text-dark small">{b.placeName}</div>
                            <div className="text-muted small">📍 {b.location}</div>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time Slot */}
                      <td>
                        <div className="fw-semibold text-dark small">📅 {b.visitDate}</div>
                        {b.timeSlot && <div className="text-muted small">⏰ {b.timeSlot}</div>}
                      </td>

                      {/* Visitors */}
                      <td>
                        <span className="badge bg-light text-dark border">
                          👥 {b.visitors || 1} Person(s)
                        </span>
                      </td>

                      {/* Price */}
                      <td className="fw-bold text-dark small">
                        ₹{b.price ? b.price.toLocaleString() : "Free"}
                      </td>

                      {/* Status + Quick Select */}
                      <td>
                        <div className="d-flex flex-column gap-1.5">
                          <span
                            className={`${
                              STATUS_BADGES[b.status] || "badge bg-secondary"
                            } px-2.5 py-1 text-center`}
                            style={{ width: "fit-content" }}
                          >
                            {b.status}
                          </span>
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(bookingId, e.target.value)}
                            className="form-select form-select-sm small text-secondary py-0.5"
                            style={{ width: "115px", fontSize: "12px", cursor: "pointer" }}
                          >
                            <option value="Pending">⏳ Pending</option>
                            <option value="Confirmed">✅ Confirmed</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="text-end">
                        <div className="d-flex align-items-center justify-content-end gap-1.5">
                          {b.status === "Pending" && (
                            <button
                              type="button"
                              className="btn btn-sm btn-success fw-semibold shadow-sm"
                              style={{ fontSize: "12px" }}
                              onClick={() => handleStatusChange(bookingId, "Confirmed")}
                              title="Confirm / Approve Booking"
                            >
                              ✅ Approve
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteBooking(bookingId)}
                            title="Delete Booking Record"
                          >
                            🗑️
                          </button>
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
  );
};

export default PlaceBookingsTable;
