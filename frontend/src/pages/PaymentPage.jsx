import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function PaymentPage() {
  const { email } = useParams();
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

    // Optionally update UI
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

  if (loading)
    return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading bookings...</div>;

  if (error)
    return <div style={{ textAlign: "center", color: "red", marginTop: "100px" }}>{error}</div>;

  return (
    <div style={{ padding: "30px", fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#4B0082" }}>💳 Payment Page</h1>
      {bookings.length === 0 ? (
        <p style={{ textAlign: "center" }}>No bookings found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "25px",
            marginTop: "30px",
          }}
        >
          {bookings.map((b) => (
            <div
              key={b.id}
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              }}
            >
              {/* 🏡 Home Image */}
              <img
                src={b.imagePath || "/placeholder.jpg"}
                alt={b.homeName}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "10px",
                }}
              />

              <h3 style={{ color: "#333" }}>{b.homeName}</h3>
              <p>📍 {b.city}, {b.state}</p>
              <p>
                💰{" "}
                {b.bookingType === "buy"
                  ? `₹${b.totalPrice}`
                  : `₹${b.rentPerMonth} / month`}
              </p>
              <p>Status: <b>{b.status}</b></p>

              {b.status === "approved" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button
                    onClick={() => handlePayment(b)}
                    style={{
                      background: "#4B0082",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px",
                      cursor: "pointer",
                    }}
                  >
                    💳 Pay Online
                  </button>

                  <button
                    onClick={() => handleCashPayment(b)}
                    style={{
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      padding: "12px",
                      cursor: "pointer",
                    }}
                  >
                    💵 Cash on Pay
                  </button>
                </div>
              )}

              {b.status === "paid" && (
                <button
                  onClick={() => handleReceipt(b)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  📄 Download Receipt
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
