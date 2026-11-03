import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";
import TouristPlaceTable from "../Components/TouristPlaces/TouristPlaceTable";
import TouristPlaceForm from "../Components/TouristPlaces/TouristPlaceForm";
import PlaceBookingsTable from "../Components/TouristPlaces/PlaceBookingsTable";

const API_BASE_URL = "http://localhost:5000/api/tourist-places";
const BOOKINGS_API_URL = "http://localhost:5000/api/place-bookings";

const TouristPlaces = () => {
  const [activeTab, setActiveTab] = useState("places"); // "places" | "bookings"
  const [places, setPlaces] = useState([]);
  const [placeBookings, setPlaceBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editPlace, setEditPlace] = useState(null);

  // 1. Fetch All Places from Backend on Load
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) {
        throw new Error("Failed to fetch tourist places");
      }
      const data = await res.json();
      setPlaces(data);
    } catch (err) {
      console.error("Error fetching places:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Place Bookings from Backend
  const fetchPlaceBookings = async () => {
    try {
      const res = await fetch(BOOKINGS_API_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPlaceBookings(data);
        }
      }
    } catch (err) {
      console.error("Error fetching place bookings:", err);
    }
  };

  useEffect(() => {
    fetchPlaces();
    fetchPlaceBookings();
  }, []);

  // 3. Add New Tourist Place (Sends FormData with Image)
  const handleAddPlace = async (newPlace) => {
    try {
      const formData = new FormData();
      formData.append("name", newPlace.name);
      formData.append("location", newPlace.location);
      formData.append("category", newPlace.category);
      formData.append("duration", newPlace.duration);
      formData.append("price", newPlace.price);
      formData.append("description", newPlace.description);
      formData.append("status", newPlace.status);

      if (newPlace.image) {
        formData.append("image", newPlace.image);
      }

      const res = await fetch(API_BASE_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to add tourist place");
      }

      const savedPlace = await res.json();
      setPlaces([savedPlace, ...places]);
      setShowForm(false);
      alert("Tourist place added successfully!");
    } catch (err) {
      console.error("Error adding place:", err);
      alert("Failed to add place: " + err.message);
    }
  };

  // 4. Edit Tourist Place
  const handleEditPlace = (place) => {
    setEditPlace(place);
    setShowForm(true);
  };

  // 5. Update Tourist Place (Sends FormData)
  const handleUpdatePlace = async (updatedPlace) => {
    try {
      const placeId = updatedPlace.id || updatedPlace._id;
      const formData = new FormData();
      formData.append("name", updatedPlace.name);
      formData.append("location", updatedPlace.location);
      formData.append("category", updatedPlace.category);
      formData.append("duration", updatedPlace.duration);
      formData.append("price", updatedPlace.price);
      formData.append("description", updatedPlace.description);
      formData.append("status", updatedPlace.status);

      // Only append if user picked a new image file
      if (updatedPlace.image instanceof File) {
        formData.append("image", updatedPlace.image);
      }

      const res = await fetch(`${API_BASE_URL}/${placeId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update tourist place");
      }

      const updated = await res.json();
      setPlaces(
        places.map((place) =>
          (place.id || place._id) === placeId ? updated : place
        )
      );

      setEditPlace(null);
      setShowForm(false);
      alert("Tourist place updated successfully!");
    } catch (err) {
      console.error("Error updating place:", err);
      alert("Failed to update place: " + err.message);
    }
  };

  // 6. Delete Tourist Place
  const handleDeletePlace = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this tourist place?")
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete tourist place");
      }

      setPlaces(places.filter((place) => (place.id || place._id) !== id));
      alert("Tourist place deleted successfully!");
    } catch (err) {
      console.error("Error deleting place:", err);
      alert("Failed to delete place: " + err.message);
    }
  };

  // 7. Handle Status Change for Place Bookings (Approve / Confirm / Cancel)
  const handlePlaceBookingStatusChange = async (id, newStatus) => {
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
      setPlaceBookings((prev) =>
        prev.map((b) => ((b._id || b.id) === id ? updated : b))
      );
    } catch (err) {
      console.error("Error updating place booking status:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  // 8. Delete Place Booking Record
  const handleDeletePlaceBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this place booking?")) {
      return;
    }

    try {
      const res = await fetch(`${BOOKINGS_API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete place booking");
      }

      setPlaceBookings((prev) => prev.filter((b) => (b._id || b.id) !== id));
      alert("Place booking deleted successfully!");
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking: " + err.message);
    }
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditPlace(null);
  };

  const pendingBookingsCount = placeBookings.filter(
    (b) => b.status === "Pending"
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
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">Tourist Places & Bookings</h2>
            <p className="text-muted mb-0">
              Manage destination spots and review tourist entry bookings
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            {activeTab === "places" && (
              <button
                className="btn text-white fw-semibold shadow-sm"
                style={{
                  backgroundColor: "#14B8A6",
                }}
                onClick={() => {
                  setEditPlace(null);
                  setShowForm(true);
                }}
              >
                + Add Tourist Place
              </button>
            )}

            <button
              type="button"
              className="btn btn-outline-secondary fw-semibold shadow-sm"
              onClick={() => {
                fetchPlaces();
                fetchPlaceBookings();
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
            onClick={() => setActiveTab("places")}
            className={`btn fw-semibold px-4 py-2 rounded-pill ${
              activeTab === "places"
                ? "text-white shadow-sm"
                : "btn-outline-secondary bg-white"
            }`}
            style={
              activeTab === "places"
                ? { backgroundColor: "#14B8A6", borderColor: "#14B8A6" }
                : {}
            }
          >
            📍 Tourist Places Catalog ({places.length})
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
            📑 Place Bookings ({placeBookings.length})
            {pendingBookingsCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {pendingBookingsCount}
              </span>
            )}
          </button>
        </div>

        {/* Form Modal / Component */}
        {showForm && (
          <TouristPlaceForm
            handleClose={handleCloseForm}
            handleAddPlace={handleAddPlace}
            editPlace={editPlace}
            handleUpdatePlace={handleUpdatePlace}
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
            <p className="text-muted mt-2">Loading data...</p>
          </div>
        ) : activeTab === "places" ? (
          /* Table: Tourist Places Catalog */
          <TouristPlaceTable
            places={places}
            handleDeletePlace={handleDeletePlace}
            handleEditPlace={handleEditPlace}
          />
        ) : (
          /* Table: Place Bookings */
          <PlaceBookingsTable
            bookings={placeBookings}
            handleStatusChange={handlePlaceBookingStatusChange}
            handleDeleteBooking={handleDeletePlaceBooking}
          />
        )}
      </div>
    </div>
  );
};

export default TouristPlaces;
