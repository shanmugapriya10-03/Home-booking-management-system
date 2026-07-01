import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./PaymentPage.css";

export default function PaymentPage() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user/${email}/bookings`);
        const uniqueBookings = [];
        const ids = new Set();
        for (const b of res.data) {
          if (!ids.has(b.id)) {
            ids.add(b.id);
            uniqueBookings.push(b);
          }
        }
        setBookings(uniqueBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [email]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Razorpay online payment
  const handlePayment = async (booking) => {
    const res = await loadRazorpayScript();
    if (!res) return alert("Failed to load Razorpay SDK.");

    try {
      const amount =
        booking.bookingType === "buy"
          ? booking.totalPrice * 100
          : booking.rentPerMonth * 100;

      const { data: order } = await axios.post("http://localhost:5000/create-order", {
        amount,
        currency: "INR",
      });

      const options = {
        key: "rzp_test_RMCjWSeoFogW8b",
        amount: order.amount,
        currency: "INR",
        name: booking.homeName,
        description: `Payment for ${booking.bookingType}`,
        image: booking.imagePath || "/placeholder.jpg",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post("http://localhost:5000/payment/success", {
              bookingId: booking.id,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              paymentType: "Online",
            });

            setBookings((prev) =>
              prev.map((b) =>
                b.id === booking.id
                  ? { ...b, status: "paid", paymentId: response.razorpay_payment_id }
                  : b
              )
            );
            alert("✅ Online Payment Successful!");
          } catch (err) {
            console.error("Error saving payment:", err);
            alert("Payment completed, but saving failed.");
          }
        },
        prefill: { email: booking.email || email },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed: " + err.message);
    }
  };

  // ✅ Cash on Payment Handler
  const handleCashPayment = async (booking) => {
    if (!window.confirm("Are you sure you want to request Cash Payment?")) return;

    try {
      await axios.post("http://localhost:5000/payment/cash", { bookingId: booking.id });

      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: "pending-cash" } : b
        )
      );

      alert("💵 Seller has been notified about your cash payment request!");
    } catch (err) {
      console.error("Error requesting cash payment:", err);
      alert("Failed to request cash payment.");
    }
  };

  // ✅ Receipt printing
  const handleReceipt = (booking) => {
    const win = window.open("", "_blank", "width=800,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { color: #333; }
            .info { margin: 6px 0; }
          </style>
        </head>
        <body>
          <h2>Payment Receipt</h2>
          <p class="info"><strong>Home:</strong> ${booking.homeName}</p>
          <p class="info"><strong>Type:</strong> ${booking.bookingType}</p>
          <p class="info"><strong>Amount Paid:</strong> ₹${
            booking.bookingType === "buy" ? booking.totalPrice : booking.rentPerMonth
          }</p>
          <p class="info"><strong>Status:</strong> ${booking.status}</p>
          <p class="info"><strong>Payment ID:</strong> ${booking.paymentId || "N/A"}</p>
          <p class="info"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  if (loading) return <div className="loading-container">Loading bookings...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="payment-page-container">
      <div className="payment-header">
        <h1 className="payment-title">💳 Payment Page</h1>
        <button 
          onClick={() => navigate(`/dashboard`)} 
          className="dashboard-nav-button"
        >
          🏠 Go to Dashboard
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings-message">
          <div className="no-bookings-icon">📦</div>
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <div className="booking-image-container">
                <img
                  src={b.imagePath || "/placeholder.jpg"}
                  alt={b.homeName}
                  className="booking-image"
                />
                <div className={`status-badge status-${b.status}`}>
                  {b.status}
                </div>
              </div>

              <div className="booking-content">
                <h3 className="booking-title">{b.homeName}</h3>
                <p className="booking-location">📍 {b.city}, {b.state}</p>
                <p className="booking-price">
                  💰{" "}
                  {b.bookingType === "buy"
                    ? `₹${b.totalPrice}`
                    : `₹${b.rentPerMonth} / month`}
                </p>
                <p className="booking-type">
                  <span className="type-label">Type:</span> 
                  <span className={`type-value type-${b.bookingType}`}>
                    {b.bookingType === "buy" ? "Purchase" : "Rent"}
                  </span>
                </p>
              </div>

              <div className="booking-actions">
                {b.status === "approved" && (
                  <>
                    <button
                      onClick={() => handlePayment(b)}
                      className="payment-btn online-payment-btn"
                    >
                      💳 Pay Online
                    </button>

                    <button
                      onClick={() => handleCashPayment(b)}
                      className="payment-btn cash-payment-btn"
                    >
                      💵 Cash Payment
                    </button>
                  </>
                )}

                {b.status === "paid" && (
                  <button
                    onClick={() => handleReceipt(b)}
                    className="payment-btn receipt-btn"
                  >
                    📄 Download Receipt
                  </button>
                )}

                {b.status === "pending-cash" && (
                  <div className="pending-cash-notice">
                    ⏳ Cash payment request sent to seller
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}