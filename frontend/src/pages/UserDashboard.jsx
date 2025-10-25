import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function UserDashboard() {
  const { email } = useParams();
  const userEmail = decodeURIComponent(email);

  const [hostData, setHostData] = useState(null);
  const [homes, setHomes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("Dashboard");

  useEffect(() => {
    if (!userEmail) return;

    const fetchDashboard = async () => {
      try {
        const encodedEmail = encodeURIComponent(userEmail);

        const hostRes = await axios.get(
          `http://localhost:5000/dashboard/${encodedEmail}`
        );
        setHostData(hostRes.data.host);
        setHomes(hostRes.data.homes);

        const bookingsRes = await axios.get(
          `http://localhost:5000/user/${encodedEmail}/bookings`
        );
        setBookings(bookingsRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [userEmail]);

  if (loading) return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      fontSize: "18px",
      color: "#4B0082"
    }}>
      Loading...
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <div style={{
            backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR35H4mYbz3HmTDVFTIHPncbcuXke7nK_bd_g&s')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: "12px",
            padding: "30px",
            minHeight: "400px",
            position: "relative"
          }}>
            {/* Overlay for better text readability */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              borderRadius: "12px"
            }}></div>
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <h3 style={{ 
                color: "#4B0082", 
                marginBottom: "10px",
                fontSize: "28px",
                fontWeight: "600"
              }}>
                Welcome to Your Dashboard, {hostData?.name}!
              </h3>
              <p style={{ 
                marginTop: "10px", 
                color: "#666",
                fontSize: "16px",
                lineHeight: "1.5"
              }}>
                Manage your homes and bookings efficiently. You can add new homes, track your bookings, and update your profile all in one place.
              </p>

              <div style={{ 
                display: "flex", 
                gap: "20px", 
                marginTop: "30px", 
                flexWrap: "wrap" 
              }}>
                {/* Total Homes */}
                <div style={{
                  backgroundColor: "#fff",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  flex: "1 1 200px",
                  borderLeft: "4px solid #4B0082",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }} className="dashboard-card">
                  <h4 style={{ 
                    color: "#4B0082", 
                    marginBottom: "10px",
                    fontSize: "18px"
                  }}>Total Homes</h4>
                  <p style={{ 
                    fontSize: "32px", 
                    fontWeight: "bold",
                    color: "#4B0082",
                    margin: 0
                  }}>{homes.length}</p>
                </div>

                {/* Total Bookings */}
                <div style={{
                  backgroundColor: "#fff",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  flex: "1 1 200px",
                  borderLeft: "4px solid #FFD700",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }} className="dashboard-card">
                  <h4 style={{ 
                    color: "#4B0082", 
                    marginBottom: "10px",
                    fontSize: "18px"
                  }}>Total Bookings</h4>
                  <p style={{ 
                    fontSize: "32px", 
                    fontWeight: "bold",
                    color: "#4B0082",
                    margin: 0
                  }}>{bookings.length}</p>
                </div>

                {/* App Info */}
                <div style={{
                  backgroundColor: "#fff",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  flex: "1 1 200px",
                  borderLeft: "4px solid #32CD32",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }} className="dashboard-card">
                  <h4 style={{ 
                    color: "#4B0082", 
                    marginBottom: "10px",
                    fontSize: "18px"
                  }}>About App</h4>
                  <p style={{ 
                    fontSize: "14px", 
                    color: "#555",
                    lineHeight: "1.4"
                  }}>
                    This application allows users to list homes for rent or sale and manage their bookings conveniently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "My Homes":
        return homes.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: "#666"
          }}>
            <p style={{ fontSize: "18px" }}>You have not added any homes yet.</p>
          </div>
        ) : (
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "20px",
            padding: "10px 0"
          }}>
            {homes.map((home) => (
              <div key={home.id} style={{ 
                border: "1px solid #e0e0e0", 
                padding: "15px", 
                width: "280px", 
                borderRadius: "12px", 
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }} className="home-card">
                <img
                  src={home.imagePath ? `http://localhost:5000/uploads/${home.imagePath}` : ""}
                  alt={home.homeName}
                  style={{ 
                    width: "100%", 
                    height: "160px", 
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "12px"
                  }}
                />
                <h4 style={{ 
                  margin: "8px 0",
                  color: "#4B0082",
                  fontSize: "18px"
                }}>{home.homeName}</h4>
                <p style={{ 
                  margin: "4px 0",
                  color: "#666"
                }}>{home.city}, {home.state}</p>
                <p style={{ 
                  margin: "4px 0",
                  color: "#333"
                }}><strong>Status:</strong> {home.status}</p>
                <p style={{ 
                  margin: "4px 0",
                  color: "#333",
                  fontWeight: "bold"
                }}>{home.rentPerMonth ? `$${home.rentPerMonth}/month` : "For Sale"}</p>
              </div>
            ))}
          </div>
        );

      case "My Bookings":
        return bookings.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: "#666"
          }}>
            <p style={{ fontSize: "18px" }}>You have not booked any homes yet.</p>
          </div>
        ) : (
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              fontSize: "14px"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#4B0082" }}>
                  <th style={{ 
                    border: "1px solid #ddd", 
                    padding: "12px", 
                    textAlign: "left",
                    color: "#fff",
                    fontWeight: "600"
                  }}>Home Name</th>
                  <th style={{ 
                    border: "1px solid #ddd", 
                    padding: "12px", 
                    textAlign: "left",
                    color: "#fff",
                    fontWeight: "600"
                  }}>City</th>
                  <th style={{ 
                    border: "1px solid #ddd", 
                    padding: "12px", 
                    textAlign: "left",
                    color: "#fff",
                    fontWeight: "600"
                  }}>Status</th>
                  <th style={{ 
                    border: "1px solid #ddd", 
                    padding: "12px", 
                    textAlign: "left",
                    color: "#fff",
                    fontWeight: "600"
                  }}>Booking Type</th>
                  <th style={{ 
                    border: "1px solid #ddd", 
                    padding: "12px", 
                    textAlign: "left",
                    color: "#fff",
                    fontWeight: "600"
                  }}>Image</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} style={{ 
                    borderBottom: "1px solid #e0e0e0",
                    transition: "background-color 0.2s ease"
                  }} className="booking-row">
                    <td style={{ 
                      border: "1px solid #e0e0e0", 
                      padding: "12px",
                      color: "#333"
                    }}>{booking.homeName}</td>
                    <td style={{ 
                      border: "1px solid #e0e0e0", 
                      padding: "12px",
                      color: "#666"
                    }}>{booking.city}</td>
                    <td style={{ 
                      border: "1px solid #e0e0e0", 
                      padding: "12px",
                      color: "#333"
                    }}>{booking.status}</td>
                    <td style={{ 
                      border: "1px solid #e0e0e0", 
                      padding: "12px",
                      color: "#666"
                    }}>{booking.bookingType}</td>
                    <td style={{ 
                      border: "1px solid #e0e0e0", 
                      padding: "12px"
                    }}>
                      {booking.imagePath ? (
                        <img
                          src={booking.imagePath.startsWith("http") ? booking.imagePath : `http://localhost:5000/uploads/${booking.imagePath}`}
                          alt={booking.homeName}
                          style={{ 
                            width: "100px", 
                            height: "60px", 
                            objectFit: "cover",
                            borderRadius: "4px"
                          }}
                        />
                      ) : "No Image"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "Profile":
        return (
          <div>
            <h3 style={{ 
              color: "#4B0082",
              marginBottom: "25px",
              fontSize: "28px",
              fontWeight: "600"
            }}>Profile Details</h3>
            
            <div style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              marginBottom: "25px",
              maxWidth: "500px"
            }}>
              <p style={{ 
                margin: "12px 0",
                fontSize: "16px",
                padding: "8px 0",
                borderBottom: "1px solid #f0f0f0"
              }}>
                <strong style={{ 
                  color: "#4B0082",
                  display: "inline-block",
                  width: "120px"
                }}>Name:</strong> 
                <span style={{ color: "#333" }}>{hostData?.name}</span>
              </p>
              <p style={{ 
                margin: "12px 0",
                fontSize: "16px",
                padding: "8px 0",
                borderBottom: "1px solid #f0f0f0"
              }}>
                <strong style={{ 
                  color: "#4B0082",
                  display: "inline-block",
                  width: "120px"
                }}>Email:</strong> 
                <span style={{ color: "#333" }}>{userEmail}</span>
              </p>
            </div>

            <div style={{ 
              display: "flex", 
              gap: "20px", 
              flexWrap: "wrap" 
            }}>
              {/* Total Homes Card */}
              <div style={{
                backgroundColor: "#fff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                flex: "1 1 200px",
                borderLeft: "4px solid #4B0082",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                minWidth: "220px"
              }} className="dashboard-card">
                <h4 style={{ 
                  color: "#4B0082", 
                  marginBottom: "15px",
                  fontSize: "18px",
                  textAlign: "center"
                }}>Total Homes</h4>
                <p style={{ 
                  fontSize: "36px", 
                  fontWeight: "bold",
                  color: "#4B0082",
                  margin: 0,
                  textAlign: "center"
                }}>{homes.length}</p>
              </div>

              {/* Total Bookings Card */}
              <div style={{
                backgroundColor: "#fff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                flex: "1 1 200px",
                borderLeft: "4px solid #FFD700",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                minWidth: "220px"
              }} className="dashboard-card">
                <h4 style={{ 
                  color: "#4B0082", 
                  marginBottom: "15px",
                  fontSize: "18px",
                  textAlign: "center"
                }}>Total Bookings</h4>
                <p style={{ 
                  fontSize: "36px", 
                  fontWeight: "bold",
                  color: "#4B0082",
                  margin: 0,
                  textAlign: "center"
                }}>{bookings.length}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ 
        width: "280px", 
        backgroundColor: "#4B0082", 
        color: "#fff", 
        padding: "25px",
        boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ 
          color: "#FFD700", 
          marginBottom: "10px",
          fontSize: "24px"
        }}>User Panel</h2>
        <p style={{ 
          color: "#e0e0e0",
          marginBottom: "30px",
          fontSize: "16px"
        }}>{hostData?.name}</p>
        <nav style={{ marginTop: "30px" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {["Dashboard", "My Homes", "My Bookings", "Profile"].map((section) => (
              <li 
                key={section} 
                onClick={() => setActiveSection(section)} 
                style={{ 
                  marginBottom: "15px", 
                  cursor: "pointer", 
                  fontWeight: activeSection === section ? "600" : "normal",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  backgroundColor: activeSection === section ? "#5A1A9C" : "transparent",
                  transition: "background-color 0.3s ease",
                  fontSize: "16px"
                }}
                className="nav-item"
              >
                {section}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        padding: "30px", 
        backgroundColor: "#f8f9fa",
        minHeight: "100vh"
      }}>
        {renderSection()}
      </main>

      <style>{`
        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .home-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.12);
        }
        
        .booking-row:hover {
          background-color: #f8f8f8;
        }
        
        .nav-item:hover {
          background-color: #5A1A9C !important;
        }
      `}</style>
    </div>
  );
}