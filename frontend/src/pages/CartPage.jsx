import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CartPage() {
  const { email } = useParams();
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items for this user
  useEffect(() => {
    fetch(`http://localhost:5000/cart/${email}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, [email]);

  // Remove item from cart
  const handleRemove = (homeId) => {
    fetch(`http://localhost:5000/cart/${email}/${homeId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCartItems(cartItems.filter((item) => item.id !== homeId));
        } else {
          alert("Error removing from cart");
        }
      })
      .catch((err) => console.error("Error removing from cart:", err));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {cartItems.map((home) => (
            <div
              key={home.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                width: "300px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={`http://localhost:5000/uploads/${home.imagePath}`}
                alt={home.homeName}
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <h3>{home.homeName}</h3>
              <p>{home.city}, {home.state}</p>
              <p>💰 {home.rentPerMonth} / month</p>
              <button
                onClick={() => handleRemove(home.id)}
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  background: "#d63031",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
