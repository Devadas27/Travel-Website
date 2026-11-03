import React, { useEffect, useState } from "react";

const TouristPlaceForm = ({
  handleClose,
  handleAddPlace,
  editPlace,
  handleUpdatePlace,
}) => {
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState({
    name: "",
    location: "",
    category: "",
    duration: "",
    price: "",
    description: "",
    status: "Active",
    image: null,
  });

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

  // Load selected place when editing
  useEffect(() => {
    if (editPlace) {
      setInput({
        name: editPlace.name || "",
        location: editPlace.location || "",
        category: editPlace.category || "",
        duration: editPlace.duration || "",
        price: editPlace.price || "",
        description: editPlace.description || "",
        status: editPlace.status || "Active",
        image: editPlace.image || null,
        id: editPlace._id || editPlace.id,
      });
    } else {
      setInput({
        name: "",
        location: "",
        category: "",
        duration: "",
        price: "",
        description: "",
        status: "Active",
        image: null,
      });
    }
  }, [editPlace]);

  // Handle input change
  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image
  const handleImageChange = (e) => {
    setInput({
      ...input,
      image: e.target.files[0],
    });
  };

  // Reset form
  const resetForm = () => {
    setInput({
      name: "",
      location: "",
      category: "",
      duration: "",
      price: "",
      description: "",
      status: "Active",
      image: null,
    });
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editPlace) {
      handleUpdatePlace(input);
    } else {
      handleAddPlace(input);
    }

    resetForm();
  };

  // Cancel
  const handleCancel = () => {
    resetForm();
    handleClose();
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        {/* Heading */}
        <h5 className="fw-bold mb-1">
          {editPlace ? "Edit Tourist Place" : "Add Tourist Place"}
        </h5>

        <p className="text-muted mb-4">
          {editPlace
            ? "Update tourist place details"
            : "Add a new tourist place to Wanderly"}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Place Name */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Place Name</label>
              <input
                type="text"
                name="name"
                value={input.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter place name"
                required
              />
            </div>

            {/* Location */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Location</label>
              <input
                type="text"
                name="location"
                value={input.location}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter location"
                required
              />
            </div>

            {/* Category */}
            <div className="col-md-6">
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
                    <option value="Beach">Beach</option>
                    <option value="Hill Station">Hill Station</option>
                    <option value="Mountains">Mountains</option>
                    <option value="Snowfall">Snowfall</option>
                    <option value="Backwaters">Backwaters</option>
                    <option value="Waterfalls">Waterfalls</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Historical Places">Historical Places</option>
                    <option value="Adventure">Adventure</option>
                  </>
                )}
                {/* Ensure current category is selectable even if deleted or not in list */}
                {input.category &&
                  !categories.some((c) => c.name === input.category) && (
                    <option value={input.category}>{input.category}</option>
                  )}
              </select>
            </div>

            {/* Duration */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Duration</label>
              <input
                type="text"
                name="duration"
                value={input.duration}
                onChange={handleChange}
                className="form-control"
                placeholder="Example: 2 Days"
                required
              />
            </div>

            {/* Price */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">Price</label>
              <input
                type="number"
                name="price"
                value={input.price}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter price"
                required
              />
            </div>

            {/* Status */}
            <div className="col-md-6">
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

            {/* Image */}
            <div className="col-12">
              <label className="form-label fw-semibold">Place Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control"
              />
              <small className="text-muted">
                Upload a JPG, PNG or WEBP image
              </small>
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                value={input.description}
                onChange={handleChange}
                className="form-control"
                rows="4"
                placeholder="Enter tourist place description"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2 mt-4">
            <button
              type="submit"
              className="btn text-white fw-semibold px-4"
              style={{
                backgroundColor: "#14B8A6",
              }}
            >
              {editPlace ? "Update Tourist Place" : "Add Tourist Place"}
            </button>

            <button
              type="button"
              className="btn btn-light px-4"
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

export default TouristPlaceForm;
