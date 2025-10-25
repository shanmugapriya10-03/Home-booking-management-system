import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chatbot from "./Chatbot";

export default function Home() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
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
    document.body.style.backgroundColor = "#0f0f0f";
    document.body.style.color = "#ffffff";
  };

  const applyLightThemeToBody = () => {
    document.body.style.backgroundColor = "#f8f9fa";
    document.body.style.color = "#333333";
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
      background: "#f8f9fa",
      text: "#2d3436",
      cardBackground: "#ffffff",
      cardBorder: "#e0e0e0",
      navBackground: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      inputBackground: "#ffffff",
      inputText: "#2d3436",
      inputBorder: "#ddd",
      profileMenuBackground: "#ffffff",
      profileMenuText: "#2d3436",
      searchBackground: "#ffffff",
      filterBackground: "#ffffff",
      buttonHover: "rgba(108, 92, 231, 0.1)",
    },
    dark: {
      background: "#0f0f0f",
      text: "#ffffff",
      cardBackground: "#1e1e1e",
      cardBorder: "#333",
      navBackground: "linear-gradient(135deg, #4a3f9e 0%, #2c244f 100%)",
      inputBackground: "#2d2d2d",
      inputText: "#ffffff",
      inputBorder: "#444",
      profileMenuBackground: "#2d2d2d",
      profileMenuText: "#ffffff",
      searchBackground: "#1a1a1a",
      filterBackground: "#1a1a1a",
      buttonHover: "rgba(255, 255, 255, 0.1)",
    },
  };

  const currentTheme = isDarkTheme ? themeStyles.dark : themeStyles.light;

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        backgroundColor: currentTheme.background,
        color: currentTheme.text,
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      <style>
        {`
          * { transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease; }
          .home-card-image { width: 100%; height: 200px; object-fit: cover; border-radius: 12px 12px 0 0; transition: transform 0.3s ease; }
          .equal-button { width: 120px; height: 42px; border: none; border-radius: 12px; cursor: pointer; color: white; font-size: 14px; font-weight: 600; margin: 0 5px; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15); position: relative; overflow: hidden; }
          .equal-button::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: rgba(255,255,255,0.2); transition: left 0.3s ease; }
          .equal-button:hover::before { left: 100%; }
          .equal-button:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 6px 20px rgba(0,0,0,0.25); }
          .card-button-container { display: flex; justify-content: center; gap: 10px; margin-top: 15px; flex-wrap: wrap; }
          .theme-toggle { background: ${isDarkTheme ? "rgba(243, 156, 18, 0.9)" : "rgba(45, 52, 54, 0.9)"}; color: white; border: none; border-radius: 25px; padding: 10px 20px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
          .theme-toggle:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
          .goog-te-combo { background-color: ${currentTheme.inputBackground} !important; color: ${currentTheme.inputText} !important; border: 1px solid ${currentTheme.inputBorder} !important; border-radius: 8px !important; padding: 8px !important; }
          .goog-te-menu-value span { color: ${currentTheme.inputText} !important; }
          .goog-te-menu2 { background-color: ${currentTheme.cardBackground} !important; border: 1px solid ${currentTheme.cardBorder} !important; border-radius: 8px !important; }
          .goog-te-menu2-item div { color: ${currentTheme.text} !important; }
          .home-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important; }
          .home-card:hover .home-card-image { transform: scale(1.05); }
          .profile-menu-item:hover { background: ${currentTheme.buttonHover}; border-radius: 6px; }
        `}
      </style>

      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 40px",
          background: currentTheme.navBackground,
          color: "white",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user && (
            <div style={{ position: "relative", marginRight: "12px" }}>
              <div
                style={{ 
                  cursor: "pointer", 
                  fontSize: "28px", 
                  background: "rgba(255,255,255,0.1)", 
                  borderRadius: "50%", 
                  width: "44px", 
                  height: "44px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s ease"
                }}
                onClick={() => setShowProfile(!showProfile)}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.1)";
                  e.target.style.background = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.background = "rgba(255,255,255,0.1)";
                }}
              >
                ☰
              </div>

              {showProfile && (
                <div
                  style={{
                    ...profileMenu,
                    background: currentTheme.profileMenuBackground,
                    color: currentTheme.profileMenuText,
                    border: `1px solid ${currentTheme.cardBorder}`,
                    backdropFilter: "blur(20px)",
                    left: "0",
                    right: "auto",
                  }}
                >
                  <div style={{ padding: "16px", borderBottom: `1px solid ${currentTheme.cardBorder}` }}>
                    <p style={{ fontWeight: "bold", margin: "0 0 4px 0", fontSize: "16px" }}>{user.name}</p>
                    <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>{user.email}</p>
                  </div>
                  <ul style={{ listStyle: "none", padding: "8px", margin: 0 }}>
                    {[
                      { icon: "📄", text: "My Dashboard", path: `/user-dashboard/${user.email}` },
                      { icon: "🛒", text: "Cart", path: `/cart/${user.email}` },
                      { icon: "💳", text: "Payments", path: `/payments/${user.email}` },
                      { icon: "💰", text: "Payment Bookings", path: `/payment-bookings/${user.email}` },
                      { icon: "🏡", text: "Add Home for Rent", path: "/add-home-rent" },
                      { icon: "🏠", text: "Add Home for Sale", path: "/add-home-buy" },
                      { icon: "🧰", text: "Manage Homes", path: `/manage-homes/${user.email}` },
                      { icon: "✅", text: "Approve Requests", path: `/approve-requests/${user.email}` },
                      { icon: "🔒", text: "Logout", action: handleLogout }
                    ].map((item, index) => (
                      <li 
                        key={index} 
                        style={menuItemStyle} 
                        onClick={item.action || (() => navigate(item.path))}
                        className="profile-menu-item"
                      >
                        <span style={{ marginRight: "10px" }}>{item.icon}</span>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div style={{ 
            background: "rgba(255,255,255,0.2)", 
            borderRadius: "12px", 
            padding: "8px 12px",
            backdropFilter: "blur(10px)"
          }}>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", background: "linear-gradient(45deg, #fff, #e0e0e0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              🏠 HomeBooking
            </h2>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkTheme ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <div style={{ 
            background: "rgba(255,255,255,0.1)", 
            borderRadius: "8px", 
            padding: "4px",
            backdropFilter: "blur(8px)"
          }}>
            <div id="google_translate_element"></div>
          </div>
          
          {!user && (
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "rgba(9, 132, 227, 0.9)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(9, 132, 227, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(9, 132, 227, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 8px rgba(9, 132, 227, 0.3)";
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                style={{
                  background: "rgba(0, 184, 148, 0.9)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0, 184, 148, 0.3)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0, 184, 148, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 8px rgba(0, 184, 148, 0.3)";
                }}
              >
                Signup
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <div style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw17r6Zr9jjP50rZp9_POXgyMvBFNCwriAiA&s")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        padding: "100px 20px",
        textAlign: "center",
        borderRadius: "0 0 30px 30px",
        marginBottom: "40px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        position: "relative",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        {/* Overlay for better text readability */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)",
          borderRadius: "0 0 30px 30px",
          zIndex: 1
        }}></div>
        
        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "800px" }}>
          <h1 style={{ 
            fontSize: "3.5rem", 
            fontWeight: "800", 
            marginBottom: "20px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
          }}>
            Find Your Dream Home
          </h1>
          <p style={{ 
            fontSize: "1.3rem", 
            marginBottom: "40px",
            opacity: 0.95,
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            lineHeight: "1.6"
          }}>
            Discover the perfect property for rent or sale in your preferred location
          </p>

          {/* Search Bar */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            maxWidth: "600px",
            margin: "0 auto",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "50px",
            padding: "8px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
          }}>
            <input
              type="text"
              placeholder="Search by city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              style={{
                flex: 1,
                padding: "16px 24px",
                fontSize: "16px",
                backgroundColor: "transparent",
                color: "#2d3436",
                border: "none",
                borderRadius: "50px",
                outline: "none",
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="equal-button"
              style={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50px",
                margin: "0",
                padding: "12px 30px"
              }}
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: "30px",
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        flexWrap: "wrap"
      }}>
        {[
          { key: "all", label: "All Homes" },
          { key: "rent", label: "For Rent" },
          { key: "sale", label: "For Sale" }
        ].map((filter) => (
          <button
            key={filter.key}
            className="equal-button"
            style={{ 
              background: filterType === filter.key 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                : currentTheme.filterBackground,
              color: filterType === filter.key ? "white" : currentTheme.text,
              border: filterType === filter.key ? "none" : `1px solid ${currentTheme.cardBorder}`,
              width: "140px"
            }}
            onClick={() => setFilterType(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Home Cards */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        flexWrap: "wrap",
        padding: "20px 40px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div style={{
              width: "50px",
              height: "50px",
              border: `4px solid ${currentTheme.cardBorder}`,
              borderTop: `4px solid #667eea`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto"
            }}></div>
            <p style={{ marginTop: "20px", fontSize: "18px" }}>Loading properties...</p>
          </div>
        ) : homes
          .filter((home) => {
            if (filterType === "all") return true;
            if (filterType === "rent") return home.status?.toLowerCase() === "rent";
            if (filterType === "sale") return home.status?.toLowerCase() === "sale";
            return true;
          })
          .map((home) => (
            <div
              key={home.id}
              className="home-card"
              style={{
                ...cardStyle,
                backgroundColor: currentTheme.cardBackground,
                border: `1px solid ${currentTheme.cardBorder}`,
                color: currentTheme.text,
                boxShadow: isDarkTheme
                  ? "0 4px 12px rgba(0,0,0,0.3)"
                  : "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={`http://localhost:5000/uploads/${home.imagePath}`}
                  alt={home.homeName}
                  className="home-card-image"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x200/667eea/ffffff?text=${encodeURIComponent(home.homeName)}`;
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: home.status?.toLowerCase() === "rent" ? "#00b894" : "#e17055",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                }}>
                  {home.status?.toLowerCase() === "rent" ? "FOR RENT" : "FOR SALE"}
                </div>
              </div>
              
              <div style={{ padding: "20px" }}>
                <h3 style={{ 
                  margin: "0 0 10px 0", 
                  fontSize: "20px", 
                  fontWeight: "700",
                  color: currentTheme.text
                }}>
                  {home.homeName}
                </h3>
                <p style={{ 
                  margin: "0 0 12px 0", 
                  color: "#888",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  minHeight: "40px"
                }}>
                  {home.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ color: "#667eea" }}>📍</span>
                  <span style={{ fontSize: "14px" }}>{home.city}, {home.state}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ color: "#667eea" }}>📞</span>
                  <span style={{ fontSize: "14px" }}>{home.phone}</span>
                </div>
                <div style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: home.status?.toLowerCase() === "rent" ? "#00b894" : "#e17055",
                  marginBottom: "15px"
                }}>
                  {home.status?.toLowerCase() === "rent"
                    ? `₹${home.rentPerMonth?.toLocaleString()}/month`
                    : `₹${home.totalPrice?.toLocaleString()}`}
                </div>

                <div className="card-button-container">
                  <button
                    className="equal-button"
                    onClick={() => handleViewMap(home)}
                    style={{ 
                      background: "linear-gradient(135deg, #0984e3 0%, #6c5ce7 100%)",
                      fontWeight: "700"
                    }}
                  >
                    📍 Map
                  </button>
                  <button
                    className="equal-button"
                    onClick={() => navigate(`/home/${home.id}`)}
                    style={{ 
                      background: "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
                      fontWeight: "700"
                    }}
                  >
                    👀 View
                  </button>
                  <button
                    className="equal-button"
                    onClick={() => handleAddToCart(home)}
                    style={{ 
                      background: "linear-gradient(135deg, #e17055 0%, #d63031 100%)",
                      fontWeight: "700"
                    }}
                  >
                    🛒 Add
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {!isLoading && homes.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🏠</div>
          <h3 style={{ color: currentTheme.text }}>No properties found</h3>
          <p style={{ color: "#888" }}>Try adjusting your search criteria</p>
        </div>
      )}

      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 500 }}>
        <Chatbot homes={homes} onSelectHome={() => {}} />
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

// Enhanced Styles
const cardStyle = {
  width: "340px",
  minHeight: "480px",
  borderRadius: "16px",
  textAlign: "left",
  transition: "all 0.3s ease",
  overflow: "hidden",
  cursor: "pointer",
};

const profileMenu = {
  position: "absolute",
  top: "50px",
  right: "0",
  width: "260px",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  zIndex: 200,
  transition: "all 0.3s ease",
  overflow: "hidden",
};

const menuItemStyle = {
  padding: "12px 16px",
  cursor: "pointer",
  transition: "0.2s",
  fontSize: "14px",
  fontWeight: "500",
  borderBottom: "1px solid #eee",
  listStyle: "none",
  display: "flex",
  alignItems: "center",
};