import React from "react";

const TouristPlaceTable = ({ places, handleDeletePlace, handleEditPlace }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="mb-4">
          <h5 className="fw-bold mb-1">Tourist Places</h5>
          <p className="text-muted mb-0">Manage all tourist places</p>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Place</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {places.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <p className="mb-0">No tourist places found in database.</p>
                    <small>
                      Click "+ Add Tourist Place" button to add your first
                      place!
                    </small>
                  </td>
                </tr>
              ) : (
                places.map((place, index) => {
                  const placeId = place._id || place.id;
                  const imageUrl = place.image
                    ? place.image.startsWith("http")
                      ? place.image
                      : `http://localhost:5000${place.image}`
                    : null;

                  return (
                    <tr key={placeId}>
                      <td>{index + 1}</td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={place.name}
                              className="rounded-2"
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          )}
                          <strong>{place.name}</strong>
                        </div>
                      </td>

                      <td>{place.location}</td>

                      <td>
                        <span className="badge bg-light text-dark">
                          {place.category}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            place.status === "Active"
                              ? "badge text-bg-success"
                              : "badge text-bg-secondary"
                          }
                        >
                          {place.status}
                        </span>
                      </td>

                      <td>
                        {/* Edit */}
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditPlace(place)}
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeletePlace(placeId)}
                        >
                          Delete
                        </button>
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

export default TouristPlaceTable;
