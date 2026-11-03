import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import TouristPackagesTable from "../Components/TouristPackages/TouristPackagesTable";
import TouristPackagesForm from "../Components/TouristPackages/TouristPackagesForm";
import PackageBookingsTable from "../Components/TouristPackages/PackageBookingsTable";

const API_BASE_URL = "http://localhost:5000/api/tourist-packages";
const BOOKINGS_API_URL = "http://localhost:5000/api/package-bookings";

const TouristPackages = () => {
  const [activeTab, setActiveTab] = useState("packages"); // "packages" | "bookings"
  const [packages, setPackages] = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editPackage, setEditPackage] = useState(null);
  const [viewPackage, setViewPackage] = useState(null); // For View Modal

  // 1. Fetch all packages from backend on component mount
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) {
        throw new Error("Failed to fetch tourist packages");
      }
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch package bookings
  const fetchPackageBookings = async () => {
    try {
      const res = await fetch(BOOKINGS_API_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPackageBookings(data);
        }
      }
    } catch (err) {
      console.error("Error fetching package bookings:", err);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchPackageBookings();
  }, []);

  // Handle status change for package bookings (Approve / Confirm / Cancel)
  const handlePackageBookingStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${BOOKINGS_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update booking status");
      }

      const updated = await res.json();
      setPackageBookings((prev) =>
        prev.map((b) => ((b._id || b.id) === id ? updated : b))
      );
    } catch (err) {
      console.error("Error updating package booking status:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  // Delete package booking record
  const handleDeletePackageBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package booking?")) {
      return;
    }

    try {
      const res = await fetch(`${BOOKINGS_API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete package booking");
      }

      setPackageBookings((prev) => prev.filter((b) => (b._id || b.id) !== id));
      alert("Package booking deleted successfully!");
    } catch (err) {
      console.error("Error deleting package booking:", err);
      alert("Failed to delete booking: " + err.message);
    }
  };

  // 2. Add New Tourist Package (POST with FormData)
  const handleAddPackage = async (newPkg) => {
    try {
      const formData = new FormData();
      formData.append("title", newPkg.title);
      formData.append("destination", newPkg.destination);
      formData.append("category", newPkg.category);
      formData.append("duration", newPkg.duration);
      formData.append("price", newPkg.price);
      formData.append("discountPrice", newPkg.discountPrice || 0);
      formData.append("groupSize", newPkg.groupSize || "1-10 Persons");
      formData.append("status", newPkg.status);
      formData.append("isFeatured", newPkg.isFeatured);
      formData.append("description", newPkg.description || "");

      if (newPkg.image) {
        formData.append("image", newPkg.image);
      }

      const res = await fetch(API_BASE_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add tourist package");
      }

      const savedPackage = await res.json();
      setPackages([savedPackage, ...packages]);
      setShowForm(false);
      alert("Tourist package published successfully! 🎉");
    } catch (err) {
      console.error("Error adding package:", err);
      alert("Failed to add package: " + err.message);
    }
  };

  // 3. Edit Tourist Package (Open form populated)
  const handleEditPackage = (pkg) => {
    setEditPackage(pkg);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 4. Update Tourist Package (PUT with FormData)
  const handleUpdatePackage = async (updatedPkg) => {
    try {
      const pkgId = updatedPkg.id || updatedPkg._id;
      const formData = new FormData();
      formData.append("title", updatedPkg.title);
      formData.append("destination", updatedPkg.destination);
      formData.append("category", updatedPkg.category);
      formData.append("duration", updatedPkg.duration);
      formData.append("price", updatedPkg.price);
      formData.append("discountPrice", updatedPkg.discountPrice || 0);
      formData.append("groupSize", updatedPkg.groupSize || "1-10 Persons");
      formData.append("status", updatedPkg.status);
      formData.append("isFeatured", updatedPkg.isFeatured);
      formData.append("description", updatedPkg.description || "");

      // Append image only if a new file was chosen
      if (updatedPkg.image instanceof File) {
        formData.append("image", updatedPkg.image);
      }

      const res = await fetch(`${API_BASE_URL}/${pkgId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update package");
      }

      const updated = await res.json();
      setPackages(
        packages.map((pkg) =>
          (pkg._id || pkg.id) === pkgId ? updated : pkg
        )
      );

      setEditPackage(null);
      setShowForm(false);
      alert("Tourist package updated successfully! ✅");
    } catch (err) {
      console.error("Error updating package:", err);
      alert("Failed to update package: " + err.message);
    }
  };

  // 5. Delete Tourist Package (DELETE)
  const handleDeletePackage = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this tourist package? This cannot be undone."
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
        throw new Error(errData.message || "Failed to delete package");
      }

      setPackages(packages.filter((pkg) => (pkg._id || pkg.id) !== id));
      alert("Tourist package deleted successfully! 🗑️");
    } catch (err) {
      console.error("Error deleting package:", err);
      alert("Failed to delete package: " + err.message);
    }
  };

  // 6. View Details Modal Handler
  const handleViewPackage = (pkg) => {
    setViewPackage(pkg);
  };

  const handleCloseViewModal = () => {
    setViewPackage(null);
  };

  // Close Form handler
  const handleCloseForm = () => {
    setShowForm(false);
    setEditPackage(null);
  };

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
            <h2 className="fw-bold mb-1">Tourist Packages & Bookings</h2>
            <p className="text-muted mb-0">
              Manage tour packages, pricing, durations and customer bookings
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            {activeTab === "packages" && (
              <button
                className="btn text-white fw-semibold shadow-sm"
                style={{ backgroundColor: "#14B8A6" }}
                onClick={() => {
                  setEditPackage(null);
                  setShowForm(true);
                }}
              >
                + Add Tourist Package
              </button>
            )}

            <button
              type="button"
              className="btn btn-outline-secondary fw-semibold shadow-sm"
              onClick={() => {
                fetchPackages();
                fetchPackageBookings();
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex gap-2 mb-4 border-bottom pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("packages")}
            className={`btn fw-semibold px-4 py-2 rounded-pill ${
              activeTab === "packages"
                ? "text-white shadow-sm"
                : "btn-outline-secondary bg-white"
            }`}
            style={
              activeTab === "packages"
                ? { backgroundColor: "#14B8A6", borderColor: "#14B8A6" }
                : {}
            }
          >
            🧳 Tour Packages Catalog ({packages.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`btn fw-semibold px-4 py-2 rounded-pill position-relative ${
              activeTab === "bookings"
                ? "text-white shadow-sm"
                : "btn-outline-secondary bg-white"
            }`}
            style={
              activeTab === "bookings"
                ? { backgroundColor: "#14B8A6", borderColor: "#14B8A6" }
                : {}
            }
          >
            📑 Package Bookings ({packageBookings.length})
            {packageBookings.filter((b) => b.status === "Pending").length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {packageBookings.filter((b) => b.status === "Pending").length}
              </span>
            )}
          </button>
        </div>

        {/* Form Modal / Section */}
        {showForm && (
          <TouristPackagesForm
            handleClose={handleCloseForm}
            handleAddPackage={handleAddPackage}
            editPackage={editPackage}
            handleUpdatePackage={handleUpdatePackage}
          />
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-teal"
              style={{ color: "#14B8A6" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2">Loading tourist packages...</p>
          </div>
        ) : activeTab === "packages" ? (
          /* Packages Table */
          <TouristPackagesTable
            packages={packages}
            handleDeletePackage={handleDeletePackage}
            handleEditPackage={handleEditPackage}
            handleViewPackage={handleViewPackage}
          />
        ) : (
          /* Package Bookings Table */
          <PackageBookingsTable
            bookings={packageBookings}
            handleStatusChange={handlePackageBookingStatusChange}
            handleDeleteBooking={handleDeletePackageBooking}
          />
        )}

        {/* View Package Details Modal */}
        {viewPackage && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">Package Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseViewModal}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* Image */}
                    <div className="col-md-5">
                      {viewPackage.image ? (
                        <img
                          src={
                            viewPackage.image.startsWith("http")
                              ? viewPackage.image
                              : `http://localhost:5000${viewPackage.image}`
                          }
                          alt={viewPackage.title}
                          className="img-fluid rounded-3 shadow-sm w-100"
                          style={{ maxHeight: "250px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="bg-light rounded-3 d-flex align-items-center justify-content-center text-secondary fw-bold"
                          style={{ height: "200px", fontSize: "36px" }}
                        >
                          🧳
                        </div>
                      )}

                      <div className="mt-3 text-center">
                        <span
                          className={
                            viewPackage.status === "Active"
                              ? "badge text-bg-success px-3 py-2"
                              : "badge text-bg-secondary px-3 py-2"
                          }
                        >
                          Status: {viewPackage.status}
                        </span>

                        {viewPackage.isFeatured && (
                          <span
                            className="badge text-white px-3 py-2 ms-2"
                            style={{ backgroundColor: "#F59E0B" }}
                          >
                            ★ Featured Package
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="col-md-7">
                      <h4 className="fw-bold mb-2">{viewPackage.title}</h4>
                      <p className="text-secondary mb-3">
                        📍 <strong>Destination:</strong> {viewPackage.destination}
                      </p>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <small className="text-muted d-block">Category</small>
                          <span className="badge bg-light text-dark border">
                            {viewPackage.category}
                          </span>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Duration</small>
                          <strong>{viewPackage.duration}</strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Group Size</small>
                          <span>{viewPackage.groupSize || "1-10 Persons"}</span>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Pricing</small>
                          {viewPackage.discountPrice && viewPackage.discountPrice > 0 ? (
                            <div>
                              <span className="text-success fw-bold fs-5">
                                ₹{viewPackage.discountPrice}
                              </span>{" "}
                              <small className="text-decoration-line-through text-muted">
                                ₹{viewPackage.price}
                              </small>
                            </div>
                          ) : (
                            <span className="fw-bold fs-5 text-dark">
                              ₹{viewPackage.price}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <h6 className="fw-bold mb-1">Description & Itinerary:</h6>
                        <p className="text-muted small mb-0" style={{ whiteSpace: "pre-line" }}>
                          {viewPackage.description || "No description provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                      handleCloseViewModal();
                      handleEditPackage(viewPackage);
                    }}
                  >
                    ✏️ Edit This Package
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseViewModal}
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

export default TouristPackages;