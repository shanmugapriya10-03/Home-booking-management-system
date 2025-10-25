import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditHome.css";

export default function EditHome() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    homeName: "",
    description: "",
    address: "",
    street: "",
    landmark: "",
    state: "",
    city: "",
    phone: "",
    imagePath: "",
    bedrooms: "",
    bathrooms: "",
    parkingArea: "",
    rentPerMonth: "",
    totalPrice: "",
    images: "",
    sellerName: "",
    sellerEmail: "",
    status: "rent",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/homes/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data))
      .catch((err) => console.error("Error loading home:", err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/homes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update home");

      alert("✅ Home updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="edit-home-container">
      <h1>Edit Home</h1>
      <form onSubmit={handleSubmit} className="edit-home-form">
        <input name="homeName" value={form.homeName} onChange={handleChange} placeholder="Home Name" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
        <input name="street" value={form.street} onChange={handleChange} placeholder="Street" />
        <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Landmark" />
        <input name="state" value={form.state} onChange={handleChange} placeholder="State" required />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
        <input name="imagePath" value={form.imagePath} onChange={handleChange} placeholder="Main Image Path" />
        <input name="images" value={form.images} onChange={handleChange} placeholder="Extra Images (comma separated)" />
        <input name="bedrooms" value={form.bedrooms} onChange={handleChange} placeholder="Bedrooms" />
        <input name="bathrooms" value={form.bathrooms} onChange={handleChange} placeholder="Bathrooms" />
        <input name="parkingArea" value={form.parkingArea} onChange={handleChange} placeholder="Parking Area" />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>

        {form.status === "rent" ? (
          <input name="rentPerMonth" value={form.rentPerMonth} onChange={handleChange} placeholder="Rent per Month" />
        ) : (
          <input name="totalPrice" value={form.totalPrice} onChange={handleChange} placeholder="Total Price" />
        )}

        <input name="sellerName" value={form.sellerName} onChange={handleChange} placeholder="Seller Name" />
        <input name="sellerEmail" value={form.sellerEmail} onChange={handleChange} placeholder="Seller Email" />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}
