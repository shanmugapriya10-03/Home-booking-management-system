import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentBookings() {
  const { email } = useParams();
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          background: "white",
          padding: "40px 60px",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          textAlign: "center"
        }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }} />
          <p style={{
            fontSize: "18px",
            color: "#333",
            fontWeight: "500"
          }}>Loading bookings...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          textAlign: "center",
          maxWidth: "500px"
        }}>
          <div style={{
            fontSize: "60px",
            marginBottom: "20px"
          }}>⚠️</div>
          <h2 style={{
            color: "#dc2626",
            marginBottom: "10px",
            fontSize: "24px"
          }}>Error</h2>
          <p style={{ color: "#666", lineHeight: "1.6" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(rgba(102, 126, 234, 0.85), rgba(219, 206, 233, 0.85)), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5-Kxv2-Vu4f0QPxzWNDnePzjiVKPTNFDl1g&s')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      padding: "40px 20px",
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {/* Header Section */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          padding: "30px 40px",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <h1 style={{
              color: "#4B0082",
              fontSize: "32px",
              fontWeight: "700",
              margin: "0 0 8px 0",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <span style={{
                fontSize: "40px",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              }}>💰</span>
              Payment Bookings
            </h1>
            <p style={{
              color: "#666",
              margin: 0,
              fontSize: "14px"
            }}>
              Seller: {email}
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "14px 28px",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
            }}
          >
            <span>📊</span> Dashboard
          </button>
        </div>

        {/* Bookings Grid */}
        {bookings.length === 0 ? (
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            padding: "60px 40px",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "80px", marginBottom: "20px" }}>📋</div>
            <h2 style={{ color: "#4B0082", marginBottom: "10px" }}>No Bookings Yet</h2>
            <p style={{ color: "#666" }}>Bookings will appear here once customers make reservations.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "30px"
          }}>
            {bookings.map((b) => (
              <div
                key={b.bookingId}
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.15)";
                }}
              >
                {/* Image Section */}
                {b.imageUrl && (
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={b.imageUrl}
                      alt={b.homeName}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        transition: "transform 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                    <div style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      background: b.status === "paid" ? "#16a34a" : b.status === "pending-cash" ? "#ca8a04" : "#3b82f6",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                    }}>
                      {b.status}
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <div style={{ padding: "24px" }}>
                  <h3 style={{
                    color: "#1f2937",
                    fontSize: "20px",
                    fontWeight: "700",
                    margin: "0 0 12px 0"
                  }}>
                    {b.homeName}
                  </h3>

                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "20px"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#6b7280",
                      fontSize: "14px"
                    }}>
                      <span>📍</span>
                      <span>{b.city}, {b.state}</span>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#6b7280",
                      fontSize: "14px"
                    }}>
                      <span>👤</span>
                      <span>{b.userName}</span>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#6b7280",
                      fontSize: "14px"
                    }}>
                      <span>📧</span>
                      <span style={{ wordBreak: "break-all" }}>{b.userEmail}</span>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#6b7280",
                      fontSize: "14px"
                    }}>
                      <span>📱</span>
                      <span>{b.phone}</span>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#6b7280",
                      fontSize: "14px"
                    }}>
                      <span>🏷️</span>
                      <span>{b.bookingType}</span>
                    </div>

                    {b.paymentId && (
                      <div style={{
                        background: "#f3f4f6",
                        padding: "10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#4b5563",
                        marginTop: "8px"
                      }}>
                        <strong>Payment ID:</strong> {b.paymentId}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                  }}>
                    {b.photoUrl && (
                      <button
                        onClick={() => setPreviewImage(b.photoUrl)}
                        style={{
                          flex: "1",
                          minWidth: "120px",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 16px rgba(102, 126, 234, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                        }}
                      >
                        🖼️ Photo
                      </button>
                    )}

                    {b.aadharUrl && (
                      <button
                        onClick={() => setPreviewImage(b.aadharUrl)}
                        style={{
                          flex: "1",
                          minWidth: "120px",
                          background: "linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)",
                          color: "white",
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 12px rgba(20, 184, 166, 0.3)"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 16px rgba(20, 184, 166, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(20, 184, 166, 0.3)";
                        }}
                      >
                        🪪 Aadhar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
            animation: "fadeIn 0.3s ease"
          }}
        >
          <div style={{
            position: "relative",
            maxWidth: "90%",
            maxHeight: "90%",
            animation: "scaleIn 0.3s ease"
          }}>
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: "absolute",
                top: "-50px",
                right: "0",
                background: "white",
                color: "#333",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                fontSize: "24px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.background = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "white";
              }}
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
              }}
            />
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { transform: scale(0.9); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}