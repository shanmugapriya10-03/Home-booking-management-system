import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SellerDashboard.css";

export default function ApproveRequests() {
  const { email } = useParams(); // Seller/admin email
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch pending requests
  useEffect(() => {
    if (email) fetchRequests();
  }, [email]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/seller-requests/${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (data.success) setRequests(data.requests);
      else setError("No requests found");
    } catch (err) {
      setError("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  // Approve booking
  const handleApprove = async (bookingId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/bookings/${bookingId}/confirm`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Failed to approve booking");
      setRequests((prev) => prev.filter((r) => r.id !== bookingId));
      alert("✅ Booking approved successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Reject booking
  const handleReject = async (bookingId) => {
    try {
      if (!window.confirm("Are you sure you want to reject this booking?")) return;
      const res = await fetch(
        `http://localhost:5000/bookings/${bookingId}/reject`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Failed to reject booking");
      setRequests((prev) => prev.filter((r) => r.id !== bookingId));
      alert("❌ Booking rejected");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading-container">Loading requests...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="approve-requests-container">
      <div className="header-section">
        <h1 className="approve-requests-header">Pending Booking Requests</h1>
        <button 
          onClick={() => navigate(`/dashboard`)} 
          className="dashboard-button"
        >
          🏠 Go to Dashboard
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="no-requests-message">
          <div className="no-requests-icon">📋</div>
          <div>No pending requests</div>
        </div>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <div key={req.id} className="request-card">
              <div className="request-header">
                <h3>{req.homeName}</h3>
                <div
                  className={`request-badge ${
                    req.status === "Confirmed" ? "badge-confirmed" : "badge-pending"
                  }`}
                >
                  {req.status}
                </div>
              </div>

              <div className="request-details">
                <p><strong>Buyer:</strong> {req.name}</p>
                <p><strong>Email:</strong> {req.email}</p>
                <p><strong>Phone:</strong> {req.phone}</p>
                <p><strong>Booking Type:</strong> {req.booking_type}</p>
                <p><strong>Created At:</strong> {new Date(req.createdAt).toLocaleString()}</p>

                {/* Document Icons */}
                <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                  {req.photoUrl && (
                    <div
                      onClick={() => setPreviewImage(req.photoUrl)}
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: "24px",
                        color: "#4B0082",
                      }}
                      title="View Photo"
                    >
                      📷
                      <div style={{ fontSize: "12px" }}>Photo</div>
                    </div>
                  )}

                  {req.aadharUrl && (
                    <div
                      onClick={() => setPreviewImage(req.aadharUrl)}
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: "24px",
                        color: "#008080",
                      }}
                      title="View Aadhar"
                    >
                      🪪
                      <div style={{ fontSize: "12px" }}>Aadhar</div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="actions-container"
                style={{ marginTop: "10px", display: "flex", gap: "10px" }}
              >
                <button onClick={() => handleApprove(req.id)} className="approve-button">
                  ✓ Approve
                </button>
                <button onClick={() => handleReject(req.id)} className="reject-button">
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={previewImage}
            alt="Preview"
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "10px" }}
          />
        </div>
      )}
    </div>
  );
}