import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar/Sidebar";

const API_BASE_URL = "http://localhost:5000/api/categories";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  // Form State: Exactly 2 inputs as requested (Name & optional Image)
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch all categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditCategory(null);
    setName("");
    setImage(null);
    setPreviewUrl(null);
    setShowModal(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (cat) => {
    setEditCategory(cat);
    setName(cat.name || "");
    setImage(null);
    setPreviewUrl(
      cat.image
        ? cat.image.startsWith("http")
          ? cat.image
          : `http://localhost:5000${cat.image}`
        : null
    );
    setShowModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditCategory(null);
    setName("");
    setImage(null);
    setPreviewUrl(null);
  };

  // Handle Image File Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 2. Submit Form (Save / Update Category)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      if (image instanceof File) {
        formData.append("image", image);
      }

      const url = editCategory
        ? `${API_BASE_URL}/${editCategory._id || editCategory.id}`
        : API_BASE_URL;
      const method = editCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save category");
      }

      const savedCategory = await res.json();

      if (editCategory) {
        setCategories((prev) =>
          prev.map((c) =>
            (c._id || c.id) === (editCategory._id || editCategory.id)
              ? savedCategory
              : c
          )
        );
        alert("Category updated successfully! ✅");
      } else {
        setCategories((prev) => [savedCategory, ...prev]);
        alert("Category added successfully! 🎉");
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Failed to save category: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Delete Category
  const handleDeleteCategory = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? Tourist places or packages using this category will not be affected."
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
        throw new Error(errData.message || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => (c._id || c.id) !== id));
      alert("Category deleted successfully! 🗑️");
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category: " + err.message);
    }
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
            <h2 className="fw-bold mb-1">Categories</h2>
            <p className="text-muted mb-0">
              Manage travel categories for Tourist Places & Tourist Packages
            </p>
          </div>

          {/* Add Category Button */}
          <button
            type="button"
            className="btn text-white fw-semibold shadow-sm"
            style={{ backgroundColor: "#14B8A6" }}
            onClick={handleOpenAddModal}
          >
            + Add Category
          </button>
        </div>

        {/* Categories Table Card */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">All Categories ({categories.length})</h5>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={fetchCategories}
              >
                🔄 Refresh
              </button>
            </div>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Category</th>
                    <th scope="col">Created Date</th>
                    <th scope="col" className="text-end">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div
                          className="spinner-border"
                          style={{ color: "#14B8A6" }}
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted mt-2 mb-0">Loading categories...</p>
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">
                        <div className="display-6 mb-2">🏷️</div>
                        <p className="fw-semibold mb-1">No categories found in database.</p>
                        <small>
                          Click the "+ Add Category" button above to create your first category!
                        </small>
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat, index) => {
                      const catId = cat._id || cat.id;
                      const imageUrl = cat.image
                        ? cat.image.startsWith("http")
                          ? cat.image
                          : `http://localhost:5000${cat.image}`
                        : null;

                      return (
                        <tr key={catId}>
                          <td className="text-muted">{index + 1}</td>

                          {/* Category Image & Name */}
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={cat.name}
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
                                  className="rounded-3 bg-light d-flex align-items-center justify-content-center text-secondary fw-bold border"
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    fontSize: "20px",
                                  }}
                                >
                                  🏷️
                                </div>
                              )}
                              <div>
                                <span className="fw-bold text-dark fs-6">
                                  {cat.name}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Created Date */}
                          <td className="text-muted">
                            {cat.createdAt
                              ? new Date(cat.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>

                          {/* Actions */}
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              {/* Edit */}
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                title="Edit Category"
                                onClick={() => handleOpenEditModal(cat)}
                              >
                                ✏️ Edit
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                title="Delete Category"
                                onClick={() => handleDeleteCategory(catId)}
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

        {/* =================================================== */}
        {/* ADD / EDIT CATEGORY MODAL (Only 2 Inputs: Name & Image) */}
        {/* =================================================== */}
        {showModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    {editCategory ? "✏️ Edit Category" : "🏷️ Add New Category"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body p-4">
                    <p className="text-muted small mb-4">
                      {editCategory
                        ? "Update category name and optional image below"
                        : "Enter category name and upload an optional image"}
                    </p>

                    {/* INPUT 1: Category Name (Required) */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Category Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="e.g. Hill Station, Beach, Snowfall, Wildlife"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>

                    {/* INPUT 2: Category Image (Optional) */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Category Image <small className="text-muted fw-normal">(Optional)</small>
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleImageChange}
                      />
                      <small className="text-muted">
                        Supports JPG, PNG, WEBP (Max 5MB)
                      </small>
                    </div>

                    {/* Live Image Preview if selected */}
                    {previewUrl && (
                      <div className="mt-3 p-2 border rounded-3 bg-light d-flex align-items-center gap-3">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="rounded-2 shadow-sm"
                          style={{
                            width: "70px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <small className="fw-bold d-block text-dark">
                            Image Preview
                          </small>
                          <small className="text-muted">
                            {image instanceof File
                              ? image.name
                              : "Current category image"}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer border-0 pt-0">
                    <button
                      type="button"
                      className="btn btn-light px-4 border"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn text-white px-4 fw-semibold"
                      style={{ backgroundColor: "#14B8A6" }}
                    >
                      {submitting
                        ? "Saving..."
                        : editCategory
                        ? "Update Category"
                        : "Save Category"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
