import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddHome() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    homeName: "",
    description: "",
    address: "",
    state: "",
    city: "",
    phone: "",
    bedrooms: "",
    bathrooms: "",
    parkingArea: "",
    rentPerMonth: "",
    totalPrice: "",
    images: [], // array for multiple images
  });

  const [previewImages, setPreviewImages] = useState([]); // to show previews

  // handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle multiple image selection
  const handleImageChange = (e) => {
  const file = e.target.files[0]; // single file
  setFormData({ ...formData, image: file });

  const preview = URL.createObjectURL(file);
  setPreviewImages([preview]);
};


  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((image) => data.append("images", image));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await fetch("http://localhost:5000/homes", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        alert("Home added successfully!");
        navigate("/"); // redirect to homepage
      } else {
        const errText = await res.text();
        alert("Failed to add home: " + errText);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding home");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Add Your Home</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Home Name</label>
            <input
              type="text"
              name="homeName"
              placeholder="Enter home name"
              value={formData.homeName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              placeholder="Describe your home..."
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              style={textareaStyle}
            />
          </div>

          <div style={rowStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Street address"
                value={formData.address}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={halfWidthStyle}>
              <label style={labelStyle}>State</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div style={halfWidthStyle}>
              <label style={labelStyle}>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Contact number"
              value={formData.phone}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Property Details</h3>
            <div style={rowStyle}>
              <div style={halfWidthStyle}>
                <label style={labelStyle}>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  placeholder="Number of bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={halfWidthStyle}>
                <label style={labelStyle}>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  placeholder="Number of bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Parking Area (sq ft)</label>
              <input
                type="number"
                name="parkingArea"
                placeholder="Parking area in square feet"
                value={formData.parkingArea}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Pricing Information</h3>
            <div style={rowStyle}>
              <div style={halfWidthStyle}>
                <label style={labelStyle}>Rent Per Month</label>
                <input
                  type="number"
                  name="rentPerMonth"
                  placeholder="Monthly rent"
                  value={formData.rentPerMonth}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={halfWidthStyle}>
                <label style={labelStyle}>Total Price</label>
                <input
                  type="number"
                  name="totalPrice"
                  placeholder="Total price"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Seller Information</h3>
            <div style={rowStyle}>
              <div style={halfWidthStyle}>
                <label style={labelStyle}>Seller Name</label>
                <input
                  type="text"
                  name="sellerName"
                  placeholder="Your name"
                  value={formData.sellerName || ""}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={halfWidthStyle}>
                <label style={labelStyle}>Seller Email</label>
                <input
                  type="email"
                  name="sellerEmail"
                  placeholder="Your email"
                  value={formData.sellerEmail || ""}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Property Image</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleImageChange}
              required
              style={fileInputStyle}
            />
          </div>

          {/* Preview selected images */}
          {previewImages.length > 0 && (
            <div style={previewContainerStyle}>
              <label style={labelStyle}>Image Preview</label>
              <div style={previewGridStyle}>
                {previewImages.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`preview-${idx}`}
                    style={previewImageStyle}
                  />
                ))}
              </div>
            </div>
          )}

          <button type="submit" style={submitStyle}>
            <span style={buttonTextStyle}>Add Home</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// CSS Styles
const containerStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "20px",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const formContainerStyle = {
  maxWidth: "800px",
  margin: "0 auto",
  background: "rgba(255, 255, 255, 0.95)",
  borderRadius: "20px",
  padding: "40px",
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(10px)",
};

const titleStyle = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#2d3748",
  textAlign: "center",
  marginBottom: "30px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#4a5568",
  marginBottom: "4px",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  border: "2px solid #e2e8f0",
  borderRadius: "12px",
  fontSize: "16px",
  transition: "all 0.3s ease",
  outline: "none",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
  "&:focus": {
    borderColor: "#667eea",
    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
  },
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "100px",
  fontFamily: "inherit",
};

const fileInputStyle = {
  width: "100%",
  padding: "12px",
  border: "2px dashed #cbd5e0",
  borderRadius: "12px",
  backgroundColor: "#f7fafc",
  cursor: "pointer",
  transition: "all 0.3s ease",
  fontSize: "16px",
  color: "#4a5568",
};

const rowStyle = {
  display: "flex",
  gap: "20px",
  alignItems: "flex-end",
};

const halfWidthStyle = {
  flex: "1",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const sectionStyle = {
  background: "rgba(247, 250, 252, 0.5)",
  padding: "24px",
  borderRadius: "16px",
  border: "1px solid #e2e8f0",
};

const sectionTitleStyle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#2d3748",
  marginBottom: "16px",
  paddingBottom: "8px",
  borderBottom: "2px solid #e2e8f0",
};

const previewContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "10px",
};

const previewGridStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const previewImageStyle = {
  width: "100px",
  height: "100px",
  objectFit: "cover",
  borderRadius: "12px",
  border: "2px solid #e2e8f0",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const submitStyle = {
  padding: "16px 32px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.3s ease",
  marginTop: "20px",
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
  },
};

const buttonTextStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};