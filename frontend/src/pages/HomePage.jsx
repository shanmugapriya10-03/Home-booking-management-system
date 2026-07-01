import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "./Chatbot";

export default function Home() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [homes, setHomes] = useState([]);
  const [allHomes, setAllHomes] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all homes
  const fetchHomes = () => {
    setIsLoading(true);
    fetch("http://localhost:5000/homes")
      .then((res) => res.json())
      .then((data) => {
        setHomes(data);
        setAllHomes(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching homes:", err);
        setIsLoading(false);
      });
  };

  // Google Translate + Theme
  useEffect(() => {
    fetchHomes();

    const addGoogleTranslate = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.type = "text/javascript";
        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);
      }

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ta,hi,te,ml,kn,ur,gu",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      };
    };

    addGoogleTranslate();

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkTheme(true);
      applyDarkThemeToBody();
    } else {
      applyLightThemeToBody();
    }
  }, []);

  const applyDarkThemeToBody = () => {
    document.body.style.backgroundColor = "#0a0a0a";
    document.body.style.color = "#ffffff";
  };

  const applyLightThemeToBody = () => {
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#1a1a1a";
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    newTheme ? applyDarkThemeToBody() : applyLightThemeToBody();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = () => {
    if (!searchCity.trim()) setHomes(allHomes);
    else {
      setHomes(
        allHomes.filter((home) =>
          home.city.toLowerCase().includes(searchCity.toLowerCase())
        )
      );
    }
  };

  const handleViewMap = (home) => {
    const queryParts = [];
    if (home.street) queryParts.push(home.street);
    if (home.city) queryParts.push(home.city);
    const query = encodeURIComponent(queryParts.join(", "));
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const handleAddToCart = (home) => {
    if (!user) {
      alert("Please login to add homes to your cart.");
      return;
    }

    fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: user.email,
        home_id: home.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(
          data.success
            ? `${home.homeName} added to your cart!`
            : data.message
        );
      })
      .catch((err) => console.error("Error adding to cart:", err));
  };

  const themeStyles = {
    light: {
      background: "#ffffff",
      text: "#1a1a1a",
      cardBackground: "#ffffff",
      cardBorder: "#f0f0f0",
      navBackground: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      inputBackground: "#ffffff",
      inputText: "#1a1a1a",
      inputBorder: "#e8e8e8",
      profileMenuBackground: "#ffffff",
      profileMenuText: "#1a1a1a",
      searchBackground: "#ffffff",
      filterBackground: "#f8f9fa",
      buttonHover: "rgba(102, 126, 234, 0.08)",
      sidebarBackground: "#ffffff",
      sidebarBorder: "#f0f0f0",
      accent: "#667eea",
      secondary: "#764ba2",
      success: "#10b981",
      warning: "#f59e0b",
      muted: "#6b7280",
    },
    dark: {
      background: "#0a0a0a",
      text: "#ffffff",
      cardBackground: "#1a1a1a",
      cardBorder: "#2a2a2a",
      navBackground: "linear-gradient(135deg, #4a3f9e 0%, #2c244f 100%)",
      inputBackground: "#2a2a2a",
      inputText: "#ffffff",
      inputBorder: "#3a3a3a",
      profileMenuBackground: "#2a2a2a",
      profileMenuText: "#ffffff",
      searchBackground: "#1a1a1a",
      filterBackground: "#2a2a2a",
      buttonHover: "rgba(255, 255, 255, 0.08)",
      sidebarBackground: "#1a1a1a",
      sidebarBorder: "#2a2a2a",
      accent: "#8b5cf6",
      secondary: "#a855f7",
      success: "#10b981",
      warning: "#f59e0b",
      muted: "#9ca3af",
    },
  };

  const currentTheme = isDarkTheme ? themeStyles.dark : themeStyles.light;

  // Menu items configuration
  const menuItems = user ? [
    { icon: "📊", text: "Dashboard", path: `/user-dashboard/${user.email}` },
    { icon: "🛒", text: "My Favorites", path: `/cart/${user.email}` },
    { icon: "💳", text: "Payments", path: `/payments/${user.email}` },
    { icon: "📅", text: "Bookings", path: `/payment-bookings/${user.email}` },
    { icon: "🏡", text: "Rent Property", path: "/add-home-rent" },
    { icon: "🏠", text: "Sell Property", path: "/add-home-buy" },
    { icon: "⚙️", text: "Manage Listings", path: `/manage-homes/${user.email}` },
    { icon: "✅", text: "Approvals", path: `/approve-requests/${user.email}` },
    { icon: "🔒", text: "Logout", action: handleLogout }
  ] : [
    { icon: "🔐", text: "Sign In", path: "/login" },
    { icon: "📝", text: "Create Account", path: "/signup" }
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: currentTheme.background,
        color: currentTheme.text,
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      <style>
        {`
          * { 
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease; 
          }
          .home-card-image { 
            width: 100%; 
            height: 220px; 
            object-fit: cover; 
            border-radius: 12px 12px 0 0; 
            transition: transform 0.5s ease; 
          }
          .property-action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 10px 16px;
            border: none;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            background: ${currentTheme.cardBackground};
            color: ${currentTheme.text};
            border: 1.5px solid ${currentTheme.cardBorder};
            flex: 1;
            min-width: 0;
          }
          .property-action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            border-color: ${currentTheme.accent};
          }
          .property-action-btn.primary {
            background: linear-gradient(135deg, ${currentTheme.accent} 0%, ${currentTheme.secondary} 100%);
            color: white;
            border: none;
          }
          .card-actions-container {
            display: flex;
            gap: 8px;
            margin-top: 15px;
          }
          .theme-toggle {
            background: ${currentTheme.filterBackground};
            color: ${currentTheme.text};
            border: 1.5px solid ${currentTheme.cardBorder};
            border-radius: 10px;
            padding: 8px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          .theme-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(0,0,0,0.15);
            border-color: ${currentTheme.accent};
          }
          .goog-te-combo {
            background-color: ${currentTheme.inputBackground} !important;
            color: ${currentTheme.inputText} !important;
            border: 1.5px solid ${currentTheme.inputBorder} !important;
            border-radius: 8px !important;
            padding: 8px !important;
          }
          .home-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.15) !important;
          }
          .home-card:hover .home-card-image {
            transform: scale(1.05);
          }
          .profile-menu-item:hover {
            background: ${currentTheme.buttonHover};
            border-radius: 8px;
            transform: translateX(4px);
          }
          
          /* Sidebar overlay */
          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(4px);
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }

          .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}
      </style>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div 
          className="sidebar-overlay"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: showSidebar ? 0 : "-320px",
          width: "300px",
          height: "100vh",
          background: currentTheme.sidebarBackground,
          borderRight: `1px solid ${currentTheme.sidebarBorder}`,
          boxShadow: "15px 0 30px rgba(0,0,0,0.1)",
          zIndex: 1000,
          transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <div style={{ 
          textAlign: "right", 
          padding: "15px 15px 10px 15px",
          borderBottom: `1px solid ${currentTheme.cardBorder}`
        }}>
          <button
            onClick={() => setShowSidebar(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: currentTheme.text,
              padding: "6px 10px",
              borderRadius: "8px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = currentTheme.buttonHover;
              e.target.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
              e.target.style.transform = "rotate(0deg)";
            }}
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div style={{ 
            padding: "15px", 
            borderBottom: `1px solid ${currentTheme.cardBorder}`,
            textAlign: "center"
          }}>
            <div style={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
              borderRadius: "15px", 
              padding: "20px 15px",
              color: "white",
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)"
            }}>
              <div style={{ 
                width: "60px", 
                height: "60px", 
                borderRadius: "50%", 
                background: "rgba(255,255,255,0.2)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: "24px",
                backdropFilter: "blur(10px)"
              }}>
                👤
              </div>
              <p style={{ fontWeight: "700", margin: "0 0 4px 0", fontSize: "16px" }}>{user.name}</p>
              <p style={{ fontSize: "12px", opacity: 0.9, margin: 0, wordBreak: "break-all" }}>{user.email}</p>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <ul style={{ listStyle: "none", padding: "15px 0", margin: 0 }}>
          {menuItems.map((item, index) => (
            <li 
              key={index} 
              style={{
                padding: "12px 20px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "14px",
                fontWeight: "500",
                borderBottom: `1px solid ${currentTheme.cardBorder}`,
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                }
                setShowSidebar(false);
              }}
              className="profile-menu-item"
            >
              <span style={{ marginRight: "12px", fontSize: "16px", width: "20px" }}>{item.icon}</span>
              {item.text}
            </li>
          ))}
        </ul>

        {/* Theme Toggle in Sidebar */}
        <div style={{ 
          padding: "20px", 
          borderTop: `1px solid ${currentTheme.cardBorder}`,
          position: "absolute",
          bottom: 0,
          width: "100%",
          boxSizing: "border-box"
        }}>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {isDarkTheme ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        transform: showSidebar ? "translateX(300px)" : "translateX(0)",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {/* Navbar */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 30px",
            background: currentTheme.navBackground,
            color: "white",
            boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {user && (
              <div style={{ position: "relative" }}>
                <div
                  style={{ 
                    cursor: "pointer", 
                    fontSize: "20px", 
                    background: "rgba(255,255,255,0.15)", 
                    borderRadius: "10px", 
                    width: "40px", 
                    height: "40px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(255,255,255,0.2)"
                  }}
                  onClick={() => setShowSidebar(!showSidebar)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)";
                    e.target.style.background = "rgba(255,255,255,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.background = "rgba(255,255,255,0.15)";
                  }}
                >
                  ☰
                </div>
              </div>
            )}
            
            <div style={{ 
              background: "rgba(255,255,255,0.15)", 
              borderRadius: "12px", 
              padding: "8px 16px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: "20px", 
                fontWeight: "800", 
                background: "linear-gradient(45deg, #fff, #e0e0e0)", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.3px"
              }}>
                🏠 EliteHome
              </h2>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button className="theme-toggle" onClick={toggleTheme} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
              {isDarkTheme ? "☀️ Light" : "🌙 Dark"}
            </button>

            <div style={{ 
              background: "rgba(255,255,255,0.1)", 
              borderRadius: "10px", 
              padding: "4px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <div id="google_translate_element"></div>
            </div>
            
            {!user && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "10px",
                    padding: "8px 20px",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(10px)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.background = "rgba(255,255,255,0.3)";
                    e.target.style.boxShadow = "0 6px 15px rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.background = "rgba(255,255,255,0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    color: "#667eea",
                    border: "none",
                    borderRadius: "10px",
                    padding: "8px 20px",
                    cursor: "pointer",
                    fontWeight: "700",
                    transition: "all 0.3s ease",
                    boxShadow: "0 3px 12px rgba(255,255,255,0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.background = "white";
                    e.target.style.boxShadow = "0 6px 20px rgba(255,255,255,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.background = "rgba(255,255,255,0.9)";
                    e.target.style.boxShadow = "0 3px 12px rgba(255,255,255,0.3)";
                  }}
                >
                  Join Free
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div style={{
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "60px 20px",
          textAlign: "center",
          marginBottom: "50px",
          position: "relative",
          minHeight: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{ maxWidth: "700px", position: "relative", zIndex: 2 }} className="fade-in-up">
            <div style={{ 
              background: "rgba(255,255,255,0.1)", 
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "15px",
              padding: "8px 16px",
              display: "inline-block",
              marginBottom: "12px"
            }}>
              <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "1px" }}>PREMIUM HOMES</span>
            </div>
            <h1 style={{ 
              fontSize: "2.5rem", 
              fontWeight: "800", 
              marginBottom: "15px",
              lineHeight: "1.1",
              letterSpacing: "-1px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
            }}>
              Discover Your
              <span style={{ 
                display: "block", 
                background: "linear-gradient(45deg, #fff, #e0e0e0)", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent",
              }}> Dream Property</span>
            </h1>
            <p style={{ 
              fontSize: "1rem", 
              marginBottom: "30px",
              opacity: 0.95,
              lineHeight: "1.5",
              fontWeight: "300",
              maxWidth: "500px",
              margin: "0 auto 30px"
            }}>
              Find exclusive properties, luxury homes, and perfect investment opportunities in prime locations
            </p>

            {/* Search Bar */}
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center",
              maxWidth: "500px",
              margin: "0 auto",
              background: "rgba(255,255,255,0.95)",
              borderRadius: "12px",
              padding: "4px",
              boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.3)"
            }}>
              <div style={{ display: "flex", alignItems: "center", flex: 1, padding: "0 12px" }}>
                <span style={{ color: "#667eea", fontSize: "16px", marginRight: "8px" }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    fontSize: "14px",
                    backgroundColor: "transparent",
                    color: "#1a1a1a",
                    border: "none",
                    outline: "none",
                    fontWeight: "500"
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: "700",
                  transition: "all 0.3s ease",
                  fontSize: "14px",
                  boxShadow: "0 3px 12px rgba(102, 126, 234, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 3px 12px rgba(102, 126, 234, 0.4)";
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div style={{ maxWidth: "1400px", margin: "0 auto 60px", padding: "0 30px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              fontWeight: "800", 
              marginBottom: "8px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Featured Properties
            </h2>
            <p style={{ 
              fontSize: "0.9rem", 
              color: currentTheme.muted, 
              maxWidth: "500px", 
              margin: "0 auto",
              lineHeight: "1.5"
            }}>
              Handpicked selection of premium properties
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center",
            gap: "6px",
            marginBottom: "30px",
            flexWrap: "wrap"
          }}>
            {[
              { key: "all", label: "All"},
              { key: "rent", label: "For Rent", icon: "🔑" },
              { key: "sale", label: "For Sale", icon: "💰" }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 18px",
                  background: filterType === filter.key 
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                    : currentTheme.filterBackground,
                  color: filterType === filter.key ? "white" : currentTheme.text,
                  border: filterType === filter.key ? "none" : `1.5px solid ${currentTheme.cardBorder}`,
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  transition: "all 0.3s ease",
                  boxShadow: filterType === filter.key ? "0 4px 15px rgba(102, 126, 234, 0.4)" : "0 2px 8px rgba(0,0,0,0.05)"
                }}
                onMouseEnter={(e) => {
                  if (filterType !== filter.key) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (filterType !== filter.key) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                  }
                }}
              >
                <span style={{ fontSize: "14px" }}>{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>

          {/* Properties Grid - Increased card width and spacing */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "30px",
          }}>
            {isLoading ? (
              <div style={{ 
                gridColumn: "1 / -1", 
                textAlign: "center", 
                padding: "60px" 
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  border: `3px solid ${currentTheme.cardBorder}`,
                  borderTop: `3px solid #667eea`,
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto"
                }}></div>
                <p style={{ 
                  marginTop: "12px", 
                  fontSize: "14px", 
                  color: currentTheme.text,
                  fontWeight: "500"
                }}>
                  Loading properties...
                </p>
              </div>
            ) : homes
              .filter((home) => {
                if (filterType === "all") return true;
                if (filterType === "rent") return home.status?.toLowerCase() === "rent";
                if (filterType === "sale") return home.status?.toLowerCase() === "sale";
                return true;
              })
              .map((home, index) => (
                <div
                  key={home.id}
                  className="home-card fade-in-up"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    backgroundColor: currentTheme.cardBackground,
                    border: `1px solid ${currentTheme.cardBorder}`,
                    color: currentTheme.text,
                    boxShadow: "0 3px 15px rgba(0,0,0,0.08)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    margin: "5px",
                  }}
                >
                  {/* Property Image Section */}
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={`http://localhost:5000/uploads/${home.imagePath}`}
                      alt={home.homeName}
                      className="home-card-image"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`;
                      }}
                    />
                    
                    {/* Property Type Badge */}
                    <div style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: home.status?.toLowerCase() === "rent" ? "#10b981" : "#f59e0b",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "10px",
                      fontWeight: "700",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      letterSpacing: "0.5px"
                    }}>
                      {home.status?.toLowerCase() === "rent" ? "FOR RENT" : "FOR SALE"}
                    </div>

                    {/* Price Tag */}
                    <div style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      background: "rgba(0,0,0,0.8)",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "700",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      {home.status?.toLowerCase() === "rent"
                        ? `₹${home.rentPerMonth?.toLocaleString()}/month`
                        : `₹${home.totalPrice?.toLocaleString()}`}
                    </div>
                  </div>
                  
                  {/* Property Details - Only Name, Contact, Location */}
                  <div style={{ padding: "20px" }}>
                    {/* Property Name */}
                    <h3 style={{ 
                      margin: "0 0 10px 0", 
                      fontSize: "18px", 
                      fontWeight: "700",
                      color: currentTheme.text,
                      lineHeight: "1.3"
                    }}>
                      {home.homeName}
                    </h3>

                    {/* Location */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", color: currentTheme.muted }}>
                      <span style={{ fontSize: "13px" }}>📍</span>
                      <span style={{ fontSize: "13px", fontWeight: "500" }}>{home.city}, {home.state}</span>
                    </div>

                    {/* Contact Number */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "18px" }}>
                      <span style={{ fontSize: "13px", color: currentTheme.accent }}>📞</span>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: currentTheme.text }}>{home.phone}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="card-actions-container">
                      <button
                        className="property-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMap(home);
                        }}
                      >
                        
                        Map
                      </button>
                      <button
                        className="property-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/home/${home.id}`);
                        }}
                      >
                        
                        Details
                      </button>
                      <button
                        className="property-action-btn primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(home);
                        }}
                      >
                        
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {!isLoading && homes.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🏠</div>
              <h3 style={{ color: currentTheme.text, fontSize: "16px", marginBottom: "8px" }}>No properties found</h3>
              <p style={{ color: currentTheme.muted, fontSize: "12px" }}>Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        <div style={{ position: "fixed", bottom: "15px", right: "15px", zIndex: 500 }}>
          <Chatbot homes={homes} onSelectHome={() => {}} />
        </div>
      </div>
    </div>
  );
}