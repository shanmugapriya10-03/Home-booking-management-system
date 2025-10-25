import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HomeDetails.css";

export default function HomeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [isBookedPaid, setIsBookedPaid] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const user = JSON.parse(localStorage.getItem("user"));

  // Check theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkTheme(savedTheme === "dark");
  }, []);

  // Fetch home details
  useEffect(() => {
    fetch(`http://localhost:5000/homes/${id}`)
      .then((res) => res.json())
      .then((data) => setHome(data))
      .catch((err) => console.error("Error fetching home:", err));
  }, [id]);

  // Fetch comments
  useEffect(() => {
    fetch(`http://localhost:5000/comments/${id}`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [id]);

  // Fetch booking status for this home
  useEffect(() => {
    fetch(`http://localhost:5000/bookings/home/${id}`)
      .then((res) => res.json())
      .then((bookings) => {
        const paidBooking = bookings.find(b => b.status === "paid");
        setIsBookedPaid(Boolean(paidBooking));
      })
      .catch((err) => console.error("Error fetching bookings:", err));
  }, [id]);

  // Submit comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText) return;

    fetch("http://localhost:5000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        home_id: id,
        username: user ? user.name : "User",
        comment: commentText,
        rating: rating,
      }),
    })
      .then((res) => res.json())
      .then((newComment) => {
        setComments([newComment, ...comments]);
        setCommentText("");
        setRating(5);
      })
      .catch((err) => console.error("Error posting comment:", err));
  };

  // Booking
  const handleBooking = () => {
    navigate(`/booking/${id}`);
  };

  const themeStyles = {
    light: {
      background: "#f8fafc",
      text: "#1e293b",
      cardBackground: "#ffffff",
      cardBorder: "#e2e8f0",
      inputBackground: "#ffffff",
      inputText: "#1e293b",
      inputBorder: "#cbd5e1",
      buttonPrimary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      buttonSecondary: "linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%)",
      buttonSuccess: "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
      buttonDanger: "linear-gradient(135deg, #e17055 0%, #d63031 100%)",
      accent: "#667eea",
      muted: "#64748b"
    },
    dark: {
      background: "#0f172a",
      text: "#f1f5f9",
      cardBackground: "#1e293b",
      cardBorder: "#334155",
      inputBackground: "#334155",
      inputText: "#f1f5f9",
      inputBorder: "#475569",
      buttonPrimary: "linear-gradient(135deg, #4a3f9e 0%, #2c244f 100%)",
      buttonSecondary: "linear-gradient(135deg, #086cb7 0%, #5b4cd4 100%)",
      buttonSuccess: "linear-gradient(135deg, #009975 0%, #008066 100%)",
      buttonDanger: "linear-gradient(135deg, #c1583d 0%, #b82a2a 100%)",
      accent: "#818cf8",
      muted: "#94a3b8"
    },
  };

  const currentTheme = isDarkTheme ? themeStyles.dark : themeStyles.light;

  if (!home) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: currentTheme.background,
      color: currentTheme.text
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "60px",
          height: "60px",
          border: `4px solid ${currentTheme.cardBorder}`,
          borderTop: `4px solid ${currentTheme.accent}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 24px auto"
        }}></div>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "600" }}>Loading Property</h3>
        <p style={{ margin: 0, color: currentTheme.muted }}>Getting the perfect home details ready for you...</p>
      </div>
    </div>
  );

  const mapBaseURL = "https://www.google.com/maps/search/";

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
      background: currentTheme.background,
      color: currentTheme.text,
      minHeight: "100vh",
      transition: "all 0.3s ease"
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .fade-in { animation: fadeIn 0.6s ease-out; }
          @keyframes fadeIn { 
            from { opacity: 0; transform: translateY(30px); } 
            to { opacity: 1; transform: translateY(0); } 
          }
          .slide-in { animation: slideIn 0.5s ease-out; }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}
      </style>

      {/* Header Section */}
      <div style={{
        background: currentTheme.cardBackground,
        borderBottom: `1px solid ${currentTheme.cardBorder}`,
        padding: "24px 0",
        marginBottom: "32px"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: "transparent",
                color: currentTheme.text,
                border: `1px solid ${currentTheme.cardBorder}`,
                borderRadius: "8px",
                padding: "10px 20px",
                cursor: "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = currentTheme.buttonSecondary;
                e.target.style.color = "white";
                e.target.style.borderColor = "transparent";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = currentTheme.text;
                e.target.style.borderColor = currentTheme.cardBorder;
              }}
            >
              <span style={{ fontSize: "18px" }}>←</span>
              Back to Listings
            </button>

            <div style={{ textAlign: "center", flex: 1 }}>
              <h1 style={{
                margin: "0 0 4px 0",
                fontSize: "28px",
                fontWeight: "700",
                background: currentTheme.buttonPrimary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                {home.homeName}
              </h1>
              <p style={{
                margin: 0,
                color: currentTheme.muted,
                fontSize: "16px",
                fontWeight: "500"
              }}>
                {home.city}, {home.state}
              </p>
            </div>

            <div style={{
              background: "rgba(102, 126, 234, 0.1)",
              color: currentTheme.accent,
              padding: "12px 20px",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "18px",
              border: `1px solid rgba(102, 126, 234, 0.2)`
            }}>
              {home.rentPerMonth ? 
                `₹${home.rentPerMonth?.toLocaleString()}/month` : 
                `₹${home.totalPrice?.toLocaleString()}`
              }
            </div>
          </div>
        </div>
      </div>

      <div className="fade-in" style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px 40px 24px"
      }}>
        
        {/* Main Content Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: "32px",
          alignItems: "start"
        }}>
          
          {/* Left Column - Image and Details */}
          <div>
            {/* Image Gallery */}
            <div style={{
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              marginBottom: "32px",
              background: currentTheme.cardBackground,
              border: `1px solid ${currentTheme.cardBorder}`
            }}>
              <img
                src={`http://localhost:5000/uploads/${home.imagePath}`}
                alt={home.homeName}
                style={{
                  width: "100%",
                  height: "480px",
                  objectFit: "cover",
                  display: "block"
                }}
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/800x480/667eea/ffffff?text=${encodeURIComponent(home.homeName)}`;
                }}
              />
            </div>

            {/* Tabs Navigation */}
            <div style={{
              display: "flex",
              gap: "8px",
              marginBottom: "24px",
              background: currentTheme.cardBackground,
              padding: "8px",
              borderRadius: "12px",
              border: `1px solid ${currentTheme.cardBorder}`
            }}>
              {[
                { id: "details", label: "Property Details", icon: "📋" },
                { id: "location", label: "Location", icon: "📍" },
                { id: "reviews", label: `Reviews (${comments.length})`, icon: "⭐" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    background: activeTab === tab.id ? currentTheme.buttonPrimary : "transparent",
                    color: activeTab === tab.id ? "white" : currentTheme.text,
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "14px",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="slide-in">
              {activeTab === "details" && (
                <div style={{
                  background: currentTheme.cardBackground,
                  borderRadius: "16px",
                  padding: "32px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  border: `1px solid ${currentTheme.cardBorder}`
                }}>
                  <h3 style={{
                    margin: "0 0 24px 0",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: currentTheme.text
                  }}>
                    Property Overview
                  </h3>

                  <p style={{
                    fontSize: "16px",
                    lineHeight: "1.7",
                    color: currentTheme.muted,
                    margin: "0 0 32px 0"
                  }}>
                    {home.description}
                  </p>

                  {/* Features Grid */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "24px",
                    marginBottom: "32px"
                  }}>
                    <FeatureCard 
                      icon="🛏️" 
                      label="Bedrooms" 
                      value={home.bedrooms} 
                      theme={currentTheme} 
                    />
                    <FeatureCard 
                      icon="🚿" 
                      label="Bathrooms" 
                      value={home.bathrooms} 
                      theme={currentTheme} 
                    />
                    <FeatureCard 
                      icon="🅿️" 
                      label="Parking" 
                      value={home.parkingArea} 
                      theme={currentTheme} 
                    />
                    <FeatureCard 
                      icon="📐" 
                      label="Type" 
                      value={home.rentPerMonth ? "For Rent" : "For Sale"} 
                      theme={currentTheme} 
                    />
                  </div>

                  {/* Seller Information */}
                  <div style={{
                    background: "rgba(102, 126, 234, 0.05)",
                    borderRadius: "12px",
                    padding: "24px",
                    border: `1px solid rgba(102, 126, 234, 0.1)`
                  }}>
                    <h4 style={{
                      margin: "0 0 16px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: currentTheme.text
                    }}>
                      Seller Information
                    </h4>
                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                      <InfoItem 
                        icon="👤" 
                        label="Name" 
                        value={home.sellerName} 
                        theme={currentTheme} 
                      />
                      <InfoItem 
                        icon="📧" 
                        label="Email" 
                        value={home.sellerEmail} 
                        theme={currentTheme} 
                      />
                      <InfoItem 
                        icon="📞" 
                        label="Phone" 
                        value={home.phone} 
                        theme={currentTheme} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "location" && (
                <div style={{
                  background: currentTheme.cardBackground,
                  borderRadius: "16px",
                  padding: "32px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  border: `1px solid ${currentTheme.cardBorder}`
                }}>
                  <h3 style={{
                    margin: "0 0 24px 0",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: currentTheme.text
                  }}>
                    Location & Nearby Places
                  </h3>

                  <div style={{
                    background: "rgba(102, 126, 234, 0.05)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "24px",
                    border: `1px solid rgba(102, 126, 234, 0.1)`
                  }}>
                    <div style={detailItemStyle}>
                      <span style={iconStyle}>📍</span>
                      <div>
                        <div style={detailLabelStyle}>Full Address</div>
                        <div style={detailValueStyle}>
                          {home.address}
                          {home.street && `, ${home.street}`}
                          {home.landmark && ` (Near ${home.landmark})`}
                        </div>
                        <div style={{...detailValueStyle, fontWeight: "600", marginTop: "4px"}}>
                          {home.city}, {home.state}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 style={{
                    margin: "0 0 16px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: currentTheme.text
                  }}>
                    Explore Nearby
                  </h4>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "12px"
                  }}>
                    {["school", "college", "hospital", "mall", "airport", "hotel", "restaurant", "park"].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          const queryParts = [type];
                          if (home.landmark) queryParts.push(home.landmark);
                          if (home.street) queryParts.push(home.street);
                          if (home.address) queryParts.push(home.address);
                          if (home.city) queryParts.push(home.city);
                          const url = mapBaseURL + encodeURIComponent(queryParts.join(" "));
                          window.open(url, "_blank");
                        }}
                        style={{
                          padding: "12px 16px",
                          background: currentTheme.buttonSecondary,
                          color: "white",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "500",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          justifyContent: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>
                          {type === "school" && "🏫"}
                          {type === "college" && "🎓"}
                          {type === "hospital" && "🏥"}
                          {type === "mall" && "🛍️"}
                          {type === "airport" && "✈️"}
                          {type === "hotel" && "🏨"}
                          {type === "restaurant" && "🍴"}
                          {type === "park" && "🌳"}
                        </span>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div style={{
                  background: currentTheme.cardBackground,
                  borderRadius: "16px",
                  padding: "32px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  border: `1px solid ${currentTheme.cardBorder}`
                }}>
                  <h3 style={{
                    margin: "0 0 24px 0",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: currentTheme.text
                  }}>
                    Customer Reviews
                  </h3>

                  {/* Review Form */}
                  <form onSubmit={handleCommentSubmit} style={{
                    background: "rgba(102, 126, 234, 0.05)",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "32px",
                    border: `1px solid rgba(102, 126, 234, 0.1)`
                  }}>
                    <h4 style={{
                      margin: "0 0 16px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: currentTheme.text
                    }}>
                      Share Your Experience
                    </h4>
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows="4"
                      placeholder="Tell us about your experience with this property..."
                      style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: "8px",
                        border: `1px solid ${currentTheme.inputBorder}`,
                        background: currentTheme.inputBackground,
                        color: currentTheme.inputText,
                        marginBottom: "16px",
                        resize: "vertical",
                        fontFamily: "inherit",
                        fontSize: "14px",
                        lineHeight: "1.5"
                      }}
                      required
                    />
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                      flexWrap: "wrap"
                    }}>
                      <label style={{
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        Your Rating:
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: `1px solid ${currentTheme.inputBorder}`,
                            background: currentTheme.inputBackground,
                            color: currentTheme.inputText,
                            fontWeight: "500"
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((r) => (
                            <option key={r} value={r}>{r} ⭐</option>
                          ))}
                        </select>
                      </label>
                      <button type="submit" style={{
                        padding: "12px 24px",
                        background: currentTheme.buttonPrimary,
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}>
                        Submit Review
                      </button>
                    </div>
                  </form>

                  {/* Reviews List */}
                  <div>
                    {comments.length === 0 ? (
                      <div style={{
                        textAlign: "center",
                        padding: "60px 40px",
                        color: currentTheme.muted
                      }}>
                        <div style={{ fontSize: "64px", marginBottom: "16px" }}>💬</div>
                        <h4 style={{
                          margin: "0 0 8px 0",
                          fontSize: "20px",
                          fontWeight: "600",
                          color: currentTheme.text
                        }}>
                          No Reviews Yet
                        </h4>
                        <p style={{ margin: 0, lineHeight: "1.6" }}>
                          Be the first to share your experience with this property!
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {comments.map((c) => (
                          <div key={c.id} style={{
                            background: "rgba(0,0,0,0.02)",
                            borderRadius: "12px",
                            padding: "24px",
                            border: `1px solid ${currentTheme.cardBorder}`,
                            transition: "all 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}>
                            <div style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "12px"
                            }}>
                              <div>
                                <p style={{
                                  margin: "0 0 4px 0",
                                  fontWeight: "600",
                                  fontSize: "16px",
                                  color: currentTheme.text
                                }}>
                                  {c.username}
                                </p>
                                <div style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px"
                                }}>
                                  <div style={{
                                    background: "rgba(102, 126, 234, 0.1)",
                                    color: currentTheme.accent,
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                    fontSize: "14px",
                                    fontWeight: "600"
                                  }}>
                                    {c.rating} ⭐
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p style={{
                              margin: "0",
                              color: currentTheme.text,
                              lineHeight: "1.6",
                              fontSize: "15px"
                            }}>
                              {c.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Action Panel */}
          <div style={{ position: "sticky", top: "24px" }}>
            <div style={{
              background: currentTheme.cardBackground,
              borderRadius: "20px",
              padding: "32px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              border: `1px solid ${currentTheme.cardBorder}`,
              position: "relative"
            }}>
              {/* Status Badge */}
              <div style={{
                position: "absolute",
                top: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                background: home.status === "booked" || isBookedPaid ? 
                  currentTheme.buttonDanger : 
                  home.status === "pending" ? 
                  "linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)" : 
                  currentTheme.buttonSuccess,
                color: home.status === "pending" ? "#2d3436" : "white",
                padding: "8px 20px",
                borderRadius: "20px",
                fontWeight: "700",
                fontSize: "14px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 10
              }}>
                {home.status === "booked" || isBookedPaid ? "🔒 NOT AVAILABLE" :
                 home.status === "pending" ? "⏳ PENDING APPROVAL" :
                 "✅ AVAILABLE"}
              </div>

              {/* Price Highlight */}
              <div style={{ textAlign: "center", marginBottom: "24px", paddingTop: "12px" }}>
                <div style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: currentTheme.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "8px"
                }}>
                  {home.rentPerMonth ? "Monthly Rent" : "Total Price"}
                </div>
                <div style={{
                  fontSize: "36px",
                  fontWeight: "800",
                  background: currentTheme.buttonPrimary,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: "1"
                }}>
                  {home.rentPerMonth ? 
                    `₹${home.rentPerMonth?.toLocaleString()}` : 
                    `₹${home.totalPrice?.toLocaleString()}`
                  }
                </div>
                {home.rentPerMonth && (
                  <div style={{
                    fontSize: "14px",
                    color: currentTheme.muted,
                    fontWeight: "500"
                  }}>
                    per month
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {!(home.status === "booked" || isBookedPaid || home.status === "pending") && (
                  <button 
                    onClick={handleBooking}
                    style={{
                      padding: "16px 24px",
                      background: currentTheme.buttonSuccess,
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>🏠</span>
                    Book This Property
                  </button>
                )}

                {/* Message Seller */}
                {user ? (
                  showEmailForm ? (
                    <div style={{
                      background: "rgba(102, 126, 234, 0.05)",
                      borderRadius: "12px",
                      padding: "20px",
                      border: `1px solid rgba(102, 126, 234, 0.1)`
                    }}>
                      <h4 style={{
                        margin: "0 0 12px 0",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: currentTheme.text
                      }}>
                        Message Seller
                      </h4>
                      <textarea
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                        placeholder="Type your message to the seller..."
                        rows="3"
                        style={{
                          width: "100%",
                          marginBottom: "12px",
                          padding: "12px",
                          borderRadius: "8px",
                          border: `1px solid ${currentTheme.inputBorder}`,
                          background: currentTheme.inputBackground,
                          color: currentTheme.inputText,
                          resize: "vertical",
                          fontFamily: "inherit",
                          fontSize: "14px"
                        }}
                        required
                      />
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button 
                          type="button"
                          onClick={async (e) => {
                            e.preventDefault();
                            if (!emailText.trim()) return;

                            try {
                              const res = await fetch(
                                "http://localhost:5000/send-doubt-email",
                                {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    senderEmail: user.email,
                                    receiverEmail: home.sellerEmail,
                                    subject: `Question about ${home.homeName}`,
                                    message: emailText,
                                  }),
                                }
                              );
                              const data = await res.json();
                              if (data.success) {
                                alert("Email sent to seller!");
                                setEmailText("");
                                setShowEmailForm(false);
                              } else {
                                alert("Failed to send email: " + data.error);
                              }
                            } catch (err) {
                              console.error(err);
                              alert("Error sending email");
                            }
                          }}
                          style={{
                            padding: "10px 16px",
                            background: currentTheme.buttonSecondary,
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                            flex: 1
                          }}
                        >
                          Send
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setShowEmailForm(false)}
                          style={{
                            padding: "10px 16px",
                            background: "transparent",
                            color: currentTheme.text,
                            border: `1px solid ${currentTheme.cardBorder}`,
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                            flex: 1
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowEmailForm(true)}
                      style={{
                        padding: "14px 20px",
                        background: currentTheme.buttonPrimary,
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>📧</span>
                      Message Seller
                    </button>
                  )
                ) : (
                  <div style={{
                    background: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)",
                    color: "#2d3436",
                    padding: "16px",
                    borderRadius: "12px",
                    textAlign: "center",
                    fontWeight: "500",
                    fontSize: "14px"
                  }}>
                    Please log in to message the seller
                  </div>
                )}

                {/* Quick Info */}
                <div style={{
                  background: "rgba(0,0,0,0.02)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginTop: "12px"
                }}>
                  <h4 style={{
                    margin: "0 0 12px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: currentTheme.text
                  }}>
                    Quick Info
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <QuickInfoItem label="Property Type" value={home.rentPerMonth ? "Rental" : "For Sale"} theme={currentTheme} />
                    <QuickInfoItem label="Bedrooms" value={home.bedrooms} theme={currentTheme} />
                    <QuickInfoItem label="Bathrooms" value={home.bathrooms} theme={currentTheme} />
                    <QuickInfoItem label="Parking" value={home.parkingArea} theme={currentTheme} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
const FeatureCard = ({ icon, label, value, theme }) => (
  <div style={{
    background: "rgba(102, 126, 234, 0.05)",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    border: `1px solid rgba(102, 126, 234, 0.1)`,
    transition: "all 0.2s ease"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.background = "rgba(102, 126, 234, 0.05)";
  }}>
    <div style={{ fontSize: "32px", marginBottom: "8px" }}>{icon}</div>
    <div style={{
      fontSize: "12px",
      fontWeight: "600",
      color: theme.muted,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "4px"
    }}>
      {label}
    </div>
    <div style={{
      fontSize: "18px",
      fontWeight: "700",
      color: theme.text
    }}>
      {value}
    </div>
  </div>
);

const InfoItem = ({ icon, label, value, theme }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <span style={{ fontSize: "20px" }}>{icon}</span>
    <div>
      <div style={{
        fontSize: "12px",
        fontWeight: "600",
        color: theme.muted,
        textTransform: "uppercase",
        letterSpacing: "0.5px"
      }}>
        {label}
      </div>
      <div style={{
        fontSize: "14px",
        fontWeight: "500",
        color: theme.text
      }}>
        {value}
      </div>
    </div>
  </div>
);

const QuickInfoItem = ({ label, value, theme }) => (
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: `1px solid ${theme.cardBorder}`
  }}>
    <span style={{
      fontSize: "14px",
      color: theme.muted,
      fontWeight: "500"
    }}>
      {label}
    </span>
    <span style={{
      fontSize: "14px",
      color: theme.text,
      fontWeight: "600"
    }}>
      {value}
    </span>
  </div>
);

// Reusable style objects
const detailItemStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px"
};

const iconStyle = {
  fontSize: "20px",
  width: "24px",
  textAlign: "center",
  flexShrink: 0
};

const detailLabelStyle = {
  fontSize: "12px",
  color: "#888",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "4px"
};

const detailValueStyle = {
  fontSize: "14px",
  fontWeight: "500",
  color: "inherit",
  lineHeight: "1.4"
};