import React from "react";

const TouristPackagesTable = ({
  packages,
  handleDeletePackage,
  handleEditPackage,
  handleViewPackage,
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="mb-4">
          <h5 className="fw-bold mb-1">Tourist Packages List</h5>
          <p className="text-muted mb-0">
            View, manage, edit and delete all travel packages
          </p>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Package</th>
                <th scope="col">Destination</th>
                <th scope="col">Category</th>
                <th scope="col">Duration</th>
                <th scope="col">Price</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {packages.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <p className="mb-1 fw-semibold">No tourist packages found in database.</p>
                    <small>
                      Click "+ Add Tourist Package" button above to create your first package!
                    </small>
                  </td>
                </tr>
              ) : (
                packages.map((pkg, index) => {
                  const pkgId = pkg._id || pkg.id;
                  const imageUrl = pkg.image
                    ? pkg.image.startsWith("http")
                      ? pkg.image
                      : `http://localhost:5000${pkg.image}`
                    : null;

                  return (
                    <tr key={pkgId}>
                      <td className="text-muted">{index + 1}</td>

                      {/* Package Name & Image */}
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={pkg.title}
                              className="rounded-3 shadow-sm"
                              style={{
                                width: "48px",
                                height: "48px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-3 bg-light d-flex align-items-center justify-content-center text-secondary fw-bold"
                              style={{ width: "48px", height: "48px", fontSize: "18px" }}
                            >
                              🧳
                            </div>
                          )}
                          <div>
                            <div className="fw-semibold text-dark">{pkg.title}</div>
                            {pkg.isFeatured && (
                              <span
                                className="badge rounded-pill text-white mt-1"
                                style={{ backgroundColor: "#F59E0B", fontSize: "10px" }}
                              >
                                ★ Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Destination */}
                      <td>
                        <span className="text-secondary">📍 {pkg.destination}</span>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="badge bg-light text-dark border">
                          {pkg.category}
                        </span>
                      </td>

                      {/* Duration */}
                      <td>
                        <small className="text-muted">⏱️ {pkg.duration}</small>
                      </td>

                      {/* Price */}
                      <td>
                        {pkg.discountPrice && pkg.discountPrice > 0 ? (
                          <div>
                            <strong className="text-success">₹{pkg.discountPrice}</strong>
                            <div>
                              <small className="text-decoration-line-through text-muted">
                                ₹{pkg.price}
                              </small>
                            </div>
                          </div>
                        ) : (
                          <strong className="text-dark">₹{pkg.price}</strong>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={
                            pkg.status === "Active"
                              ? "badge text-bg-success"
                              : "badge text-bg-secondary"
                          }
                        >
                          {pkg.status}
                        </span>
                      </td>

                      {/* Action Buttons: View, Edit, Delete */}
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          {/* View */}
                          <button
                            type="button"
                            className="btn btn-outline-info"
                            title="View Details"
                            onClick={() => handleViewPackage(pkg)}
                          >
                            👁️ View
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            title="Edit Package"
                            onClick={() => handleEditPackage(pkg)}
                          >
                            ✏️ Edit
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            title="Delete Package"
                            onClick={() => handleDeletePackage(pkgId)}
                          >
                            🗑️ Delete
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

export default TouristPackagesTable;