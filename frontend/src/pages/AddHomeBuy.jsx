import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddHomeBuy.css";

export default function AddHomeBuy() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    homeName: "",
    description: "",
    address: "",
    street: "",          // ✅ Added street
    landmark: "",        // ✅ landmark
    state: "",
    city: "",
    phone: "",
    bedrooms: "",
    bathrooms: "",
    parkingArea: "",
    totalPrice: "",
    image: null,
    sellerName: "",
    status: "sale",
  });

  const [previewImage, setPreviewImage] = useState(null);

  // 🧩 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📸 Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 🚀 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add a home.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "image" && formData.image) {
        data.append("image", formData.image);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await fetch("http://localhost:5000/homes", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        alert("🏡 Home for Sale added successfully!");
        navigate("/dashboard");
      } else {
        const errText = await res.text();
        alert("Failed to add home: " + errText);
      }
    } catch (err) {
      console.error("Error adding home:", err);
      alert("Server Error");
    }
  };

  return (
    <div className="AddHomeBuy-container">
      <div style={{ maxWidth: "500px", width: "100%" }}>
        <h2>Add Home for Sale</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="homeName"
            placeholder="Home Name"
            value={formData.homeName}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Door No / Building"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="landmark"
            placeholder="Landmark"
            value={formData.landmark}
            onChange={handleChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="bedrooms"
            placeholder="Bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="bathrooms"
            placeholder="Bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="parkingArea"
            placeholder="Parking Area (sqft)"
            value={formData.parkingArea}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="totalPrice"
            placeholder="Total Price (₹)"
            value={formData.totalPrice}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="sellerName"
            placeholder="Your Name"
            value={formData.sellerName}
            onChange={handleChange}
            required
          />
          <input type="file" name="image" onChange={handleImageChange} required />

          {previewImage && (
            <img
              src={previewImage}
              alt="preview"
              style={{
                width: "150px",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            />
          )}

          <button type="submit" style={{ marginTop: "15px" }}>
            Add Home for Sale
          </button>
        </form>
      </div>
    </div>
  );
}
