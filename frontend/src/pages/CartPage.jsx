import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CartPage() {
  const { email } = useParams();
  const navigate = useNavigate();
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQn0ePiOobeBAKy43USeCGTsDSvLF9kpYJvlouabObZws8qMfWgX05Z1w1uzd0ddfkL2M&usqp=CAU')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      padding: "40px 20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: "relative"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          marginBottom: "30px"
        }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#2d3436",
            margin: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
            flexWrap: "wrap"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              🛒 Your Cart
              {cartItems.length > 0 && (
                <span style={{
                  fontSize: "1rem",
                  background: "#667eea",
                  color: "white",
                  padding: "5px 15px",
                  borderRadius: "20px",
                  fontWeight: "600"
                }}>
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
              }}
            >
              🏠 Go to Dashboard
            </button>
          </h2>
        </div>

        {cartItems.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "60px 30px",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🛍️</div>
            <p style={{
              fontSize: "1.5rem",
              color: "#636e72",
              margin: "0"
            }}>Your cart is empty.</p>
            <p style={{
              fontSize: "1rem",
              color: "#b2bec3",
              marginTop: "10px"
            }}>Start adding homes to see them here!</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "25px"
          }}>
            {cartItems.map((home) => (
              <div
                key={home.id}
                style={{
                  background: "white",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={`http://localhost:5000/uploads/${home.imagePath}`}
                    alt={home.homeName}
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>

                <div style={{ padding: "20px" }}>
                  <h3 style={{
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    color: "#2d3436",
                    margin: "0 0 10px 0",
                    lineHeight: "1.3"
                  }}>
                    {home.homeName}
                  </h3>

                  <p style={{
                    fontSize: "0.95rem",
                    color: "#636e72",
                    margin: "0 0 15px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}>
                    📍 {home.city}, {home.state}
                  </p>

                  <p style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#667eea",
                    margin: "0 0 20px 0"
                  }}>
                    💰 {home.rentPerMonth} / month
                  </p>

                  <button
                    onClick={() => handleRemove(home.id)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(238, 90, 111, 0.3)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(238, 90, 111, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 15px rgba(238, 90, 111, 0.3)";
                    }}
                  >
                    ❌ Remove from Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}