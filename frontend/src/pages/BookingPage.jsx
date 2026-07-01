import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookingPage.css";

export default function BookingPage() {
  const { id: homeId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [aadhar, setAadhar] = useState(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [homeDetails, setHomeDetails] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  // ✅ Auto-fill user email from localStorage (same as AddRent page)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.email) {
      setEmail(storedUser.email);
    } else {
      alert("User email not found. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch home details
  useEffect(() => {
    fetch(`http://localhost:5000/homes/${homeId}`)
      .then((res) => res.json())
      .then((data) => setHomeDetails(data))
      .catch((err) => console.error(err));
  }, [homeId]);

  // Send OTP
  const sendOtp = async () => {
    if (!email) return alert("Email not found. Please log in again.");
    try {
      const res = await fetch("http://localhost:5000/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP sent to " + email);
        setOtpSent(true);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:5000/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP verified");
        setOtpVerified(true);
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    }
  };

  // Handle booking (no payment)
  const handleBooking = async () => {
    if (!otpVerified) return alert("Verify OTP first");
    if (!selectedOption) return alert("Select Rent or Buy");

    const formData = new FormData();
    formData.append("homeId", homeId);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("photo", photo);
    formData.append("aadhar", aadhar);
    formData.append("otpVerified", "true");
    formData.append("bookingType", selectedOption);

    try {
      const bookingRes = await fetch("http://localhost:5000/bookings", {
        method: "POST",
        body: formData,
      });
      const bookingData = await bookingRes.json();
      if (bookingData.success) {
        alert("Booking request sent!");
        navigate("/dashboard");
      } else {
        alert("Booking failed: " + bookingData.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error sending booking");
    }
  };

  return (
    <div className="booking-container">
      <h2>Book Home #{homeId}</h2>
      <form className="booking-form" encType="multipart/form-data">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input type="email" value={email} readOnly required />

        <button type="button" onClick={sendOtp} className="btn small">
          Send OTP
        </button>

        {otpSent && (
          <div className="otp-box">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="button" onClick={verifyOtp} className="btn">
              Verify OTP
            </button>
          </div>
        )}

        <label>Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>Upload Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          required
        />

        <label>Upload Aadhaar Card</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setAadhar(e.target.files[0])}
          required
        />

        {/* Rent/Buy selection */}
        <div className="choose-option">
          <button
            type="button"
            className={`btn ${selectedOption === "rent" ? "selected" : ""}`}
            onClick={() => setSelectedOption("rent")}
          >
            Rent
          </button>
          <button
            type="button"
            className={`btn ${selectedOption === "buy" ? "selected" : ""}`}
            onClick={() => setSelectedOption("buy")}
          >
            Buy
          </button>
        </div>

        {selectedOption === "rent" && homeDetails && (
          <p className="price-info">
            Rent Price: ₹{homeDetails.rentPerMonth} / month
          </p>
        )}
        {selectedOption === "buy" && homeDetails && (
          <p className="price-info">Total Price: ₹{homeDetails.totalPrice}</p>
        )}

        <button
          type="button"
          disabled={!otpVerified}
          onClick={handleBooking}
          className="btn confirm"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
