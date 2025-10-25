import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SellerDashboard.css";

export default function SellerDashboard() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [host, setHost] = useState(null);
  const [homes, setHomes] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  // Fetch dashboard (host + homes)
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`http://localhost:5000/dashboard/${email}`);
        if (!res.ok) throw new Error("Failed to load dashboard");
        const data = await res.json();
        setHost(data.host);
        setHomes(data.homes);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchDashboard();
  }, [email]);

  // Fetch seller booking requests
  useEffect(() => {
    if (host) {
      fetch(`http://localhost:5000/seller-requests/${host.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setRequests(data.requests);
        })
        .catch(console.error);
    }
  }, [host]);

  const handleEdit = (id) => navigate(`/edit-home/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this home?")) return;
    try {
      const res = await fetch(`http://localhost:5000/homes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete home");
      setHomes((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Approve booking and update home status
  const handleApprove = async (bookingId, homeId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/bookings/${bookingId}/confirm`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Failed to approve booking");

      // Remove booking from requests list
      setRequests((prev) => prev.filter((r) => r.id !== bookingId));

      // Update the corresponding home's status
      setHomes((prev) =>
        prev.map((home) =>
          home.id === homeId ? { ...home, status: "Booked" } : home
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/bookings/${bookingId}/reject`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Failed to reject booking");
      setRequests((prev) => prev.filter((r) => r.id !== bookingId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (error)
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  if (!host)
    return <div className="text-center mt-4">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>

      {/* Buyer Requests */}
      <h2 className="text-xl font-semibold mb-2">Buyer Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {requests.map((req) => (
            <div key={req.id} className="border p-3 rounded shadow">
              <p><strong>Home:</strong> {req.homeName}</p>
              <p><strong>Buyer Name:</strong> {req.name}</p>
              <p><strong>Email:</strong> {req.email}</p>
              <p><strong>Phone:</strong> {req.phone}</p>
              <p><strong>Booking Type:</strong> {req.booking_type}</p>
              <p><strong>Status:</strong> {req.status}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleApprove(req.id, req.homeId)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(req.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Host Details */}
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Host Details</h2>
        <p><strong>Name:</strong> {host.name}</p>
        <p><strong>Email:</strong> {host.email}</p>
        <p><strong>Role:</strong> {host.role}</p>
      </div>

      {/* Homes Section */}
      <h2 className="text-xl font-semibold mb-2">Your Homes</h2>
      {homes.length === 0 ? (
        <p>No homes listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {homes.map((home) => (
            <div key={home.id} className="border rounded-lg p-4 shadow">
              <h3 className="text-lg font-semibold">{home.homeName}</h3>
              {home.imagePath && (
                <img
                  src={`http://localhost:5000/uploads/${home.imagePath}`}
                  alt={home.homeName}
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
              <p><strong>Description:</strong> {home.description}</p>
              <p><strong>Address:</strong> {home.address}</p>
              <p><strong>State:</strong> {home.state}</p>
              <p><strong>City:</strong> {home.city}</p>
              <p><strong>Phone:</strong> {home.phone}</p>
              <p><strong>Bedrooms:</strong> {home.bedrooms}</p>
              <p><strong>Bathrooms:</strong> {home.bathrooms}</p>
              <p><strong>Parking Area:</strong> {home.parkingArea}</p>
              <p><strong>Rent Per Month:</strong> {home.rentPerMonth}</p>
              <p><strong>Total Price:</strong> {home.totalPrice}</p>
              <p className="mt-2"><strong>Seller Name:</strong> {home.sellerName}</p>
              <p><strong>Seller Email:</strong> {home.sellerEmail}</p>
              <p className="mt-1">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    home.status === "Booked"
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {home.status}
                </span>
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(home.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(home.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
