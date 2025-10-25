import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function SellerBookingsPage() {
  const { email } = useParams(); // seller email
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/seller/${email}/bookings`);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load bookings");
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
      <h1 style={{ textAlign: "center", color: "#4B0082" }}>📄 Seller Bookings</h1>

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
              }}
            >
              <h3>{b.homeName}</h3>
              <p>📍 {b.city}, {b.state}</p>
              <p>User: {b.userName} ({b.userEmail})</p>
              <p>Booking Type: {b.bookingType}</p>
              <p>
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
                  {b.status.toUpperCase()}
                </span>
              </p>
              {b.paymentId && <p>Payment ID: {b.paymentId}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
