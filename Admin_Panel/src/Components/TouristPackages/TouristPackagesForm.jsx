import React, { useEffect, useState } from "react";

const TouristPackagesForm = ({
  handleClose,
  handleAddPackage,
  editPackage,
  handleUpdatePackage,
}) => {
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState({
    title: "",
    destination: "",
    category: "Family",
    duration: "",
    price: "",
    discountPrice: "",
    groupSize: "1-10 Persons",
    description: "",
    status: "Active",
    isFeatured: false,
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCategories(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Load selected package data when editing
  useEffect(() => {
    if (editPackage) {
      setInput({
        id: editPackage._id || editPackage.id,
        title: editPackage.title || "",
        destination: editPackage.destination || "",
        category: editPackage.category || "Family",
        duration: editPackage.duration || "",
        price: editPackage.price || "",
        discountPrice: editPackage.discountPrice || "",
        groupSize: editPackage.groupSize || "1-10 Persons",
        description: editPackage.description || "",
        status: editPackage.status || "Active",
        isFeatured: Boolean(editPackage.isFeatured),
        image: editPackage.image || null,
      });

      if (editPackage.image) {
        setPreviewUrl(
          editPackage.image.startsWith("http")
            ? editPackage.image
            : `http://localhost:5000${editPackage.image}`,
        );
      } else {
        setPreviewUrl(null);
      }
    } else {
      resetForm();
    }
  }, [editPackage]);

  // Handle standard input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload with live local preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Reset form
  const resetForm = () => {
    setInput({
      title: "",
      destination: "",
      category: "Family",
      duration: "",
      price: "",
      discountPrice: "",
      groupSize: "1-10 Persons",
      description: "",
      status: "Active",
      isFeatured: false,
      image: null,
    });
    setPreviewUrl(null);
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editPackage) {
      handleUpdatePackage(input);
    } else {
      handleAddPackage(input);
    }

    resetForm();
  };

  // Cancel form
  const handleCancel = () => {
    resetForm();
    handleClose();
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">
              {editPackage ? "Edit Tourist Package" : "Add New Tourist Package"}
            </h5>
            <p className="text-muted mb-0">
              {editPackage
                ? "Update tour itinerary, pricing, and package details"
                : "Fill in the details below to publish a new travel package"}
            </p>
          </div>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleCancel}
          ></button>
        </div>

        <hr className="my-3 text-secondary opacity-25" />

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Title */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Package Title *</label>
              <input
                type="text"
                name="title"
                value={input.title}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Munnar Scenic Hill Escape"
                required
              />
            </div>

            {/* Destination */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Destination *</label>
              <input
                type="text"
                name="destination"
                value={input.destination}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Munnar, Kerala"
                required
              />
            </div>

            {/* Category */}
            <div className="col-md-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label fw-semibold mb-0">Category *</label>
                <a
                  href="/categories"
                  className="small text-decoration-none fw-semibold"
                  style={{ color: "#14B8A6" }}
                  title="Add or manage categories"
                >
                  + Add Category
                </a>
              </div>
              <select
                name="category"
                value={input.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">-- Select Category --</option>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat._id || cat.id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Family">Family</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Beach">Beach</option>
                    <option value="Hill Station">Hill Station</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Historical">Historical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Backwaters">Backwaters</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Budget">Budget</option>
                  </>
                )}
                {/* Ensure existing package category is selectable even if deleted or not in list */}
                {input.category &&
                  !categories.some((c) => c.name === input.category) && (
                    <option value={input.category}>{input.category}</option>
                  )}
              </select>
            </div>

            {/* Duration */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Duration *</label>
              <input
                type="text"
                name="duration"
                value={input.duration}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. 4 Days / 3 Nights"
                required
              />
            </div>

            {/* Group Size */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Group Size</label>
              <input
                type="text"
                name="groupSize"
                value={input.groupSize}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. 2-6 Persons"
              />
            </div>

            {/* Regular Price */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={input.price}
                onChange={handleChange}
                className="form-control"
                placeholder="Regular price e.g. 15000"
                min="0"
                required
              />
            </div>

            {/* Discount / Offer Price */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Discounted Price (₹)
              </label>
              <input
                type="number"
                name="discountPrice"
                value={input.discountPrice}
                onChange={handleChange}
                className="form-control"
                placeholder="Offer price e.g. 12999 (optional)"
                min="0"
              />
            </div>

            {/* Status */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Status</label>
              <select
                name="status"
                value={input.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Image Upload + Live Preview */}
            <div className="col-md-8">
              <label className="form-label fw-semibold">Package Image</label>
              <input
                type="file"
                name="image"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImageChange}
                className="form-control"
              />
              <small className="text-muted">
                Supported formats: JPG, PNG, WEBP (Max 5MB)
              </small>
            </div>

            {/* Featured Checkbox */}
            <div className="col-md-4 d-flex align-items-center mt-4">
              <div className="form-check form-switch pt-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeaturedSwitch"
                  checked={input.isFeatured}
                  onChange={handleChange}
                  className="form-check-input"
                  role="switch"
                  style={{ cursor: "pointer" }}
                />
                <label
                  className="form-check-label fw-semibold ms-2"
                  htmlFor="isFeaturedSwitch"
                  style={{ cursor: "pointer" }}
                >
                  Featured on Homepage ⭐
                </label>
              </div>
            </div>

            {/* Image Preview Thumbnail */}
            {previewUrl && (
              <div className="col-12">
                <div className="d-flex align-items-center gap-3 p-2 border rounded-3 bg-light">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="rounded-2 shadow-sm"
                    style={{
                      width: "90px",
                      height: "65px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <span className="badge bg-secondary mb-1">
                      Image Preview
                    </span>
                    <div className="small text-muted">
                      {input.image instanceof File
                        ? input.image.name
                        : "Current package image"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                Package Description & Highlights
              </label>
              <textarea
                name="description"
                value={input.description}
                onChange={handleChange}
                className="form-control"
                rows="4"
                placeholder="Include travel details, key attractions, inclusions, meals, and hotel stay information..."
              ></textarea>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mt-4">
            <button
              type="submit"
              className="btn text-white fw-semibold px-4"
              style={{ backgroundColor: "#14B8A6" }}
            >
              {editPackage ? "Update Package" : "Publish Package"}
            </button>

            <button
              type="button"
              className="btn btn-light px-4 border"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TouristPackagesForm;
