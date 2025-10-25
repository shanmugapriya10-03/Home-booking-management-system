import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function PaymentBookings() {
  const { email } = useParams(); // seller email
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!email) {
      setError("Seller email not provided in URL");
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        console.log(`Fetching bookings for seller: ${email}`);
        const res = await axios.get(
          `http://localhost:5000/seller/${encodeURIComponent(email)}/bookings`
        );
        console.log("Bookings fetched:", res.data);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        if (err.response) {
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          setError("No response from server. Is backend running?");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [email]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading bookings...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "30px", fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#4B0082" }}>
        💰 Seller Payment Bookings
      </h1>

      {bookings.length === 0 ? (
        <p style={{ textAlign: "center" }}>No bookings found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {bookings.map((b) => (
            <div
              key={b.bookingId}
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease-in-out",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {b.imageUrl && (
                <img
                  src={b.imageUrl}
                  alt={b.homeName}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
              )}

              <h3>{b.homeName}</h3>
              <p>
                📍 {b.city}, {b.state}
              </p>
              <p>
                User: {b.userName} ({b.userEmail})
              </p>
              <p>Phone: {b.phone}</p>
              <p>Booking Type: {b.bookingType}</p>

              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                {b.photoUrl && (
                  <button
                    onClick={() => setPreviewImage(b.photoUrl)}
                    style={{
                      background: "#4B0082",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    🖼️ View Photo
                  </button>
                )}

                {b.aadharUrl && (
                  <button
                    onClick={() => setPreviewImage(b.aadharUrl)}
                    style={{
                      background: "#008080",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    🪪 View Aadhar
                  </button>
                )}
              </div>

              <p style={{ marginTop: "10px" }}>
                Status:{" "}
                <span
                  style={{
                    fontWeight: "600",
                    color:
                      b.status === "paid"
                        ? "#16a34a"
                        : b.status === "pending-cash"
                        ? "#ca8a04"
                        : "#3b82f6",
                  }}
                >
                  {b.status?.toUpperCase()}
                </span>
              </p>

              {b.paymentId && <p>Payment ID: {b.paymentId}</p>}
            </div>
          ))}
        </div>
      )}

      {/* 🔍 Image Preview Modal */}
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
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(255,255,255,0.5)",
            }}
          />
        </div>
      )}
    </div>
  );
}
