import React, { useState } from "react";

export default function Chatbot({ homes, onSelectHome }) {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! I can help you find homes. Try asking like — '2 bedrooms in Kovilpatti under 5000 for rent'",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: input }]);
    const query = input.toLowerCase();
    setInput("");
    setLoading(true);

    try {
      const uniqueHomes = Array.from(
        new Map(homes.map((h) => [`${h.homeName}_${h.address}`, h])).values()
      );

      // Extract filters from text
      const bedroomMatch = query.match(/(\d+)\s*bed/i);
      const priceMatch = query.match(/(?:below|under|less than)\s*(\d+)/i);
      const cityMatch = homes.find((h) =>
        query.includes(h.city.toLowerCase())
      );
      const typeMatch = query.includes("rent")
        ? "rent"
        : query.includes("sale")
        ? "sale"
        : null;

      const bedroomFilter = bedroomMatch ? parseInt(bedroomMatch[1]) : null;
      const priceFilter = priceMatch ? parseInt(priceMatch[1]) : null;

      const filtered = uniqueHomes.filter((home) => {
        const combined = Object.values(home)
          .join(" ")
          .toLowerCase();

        const bedroomCond = bedroomFilter
          ? parseInt(home.bedrooms) === bedroomFilter
          : true;
        const priceCond = priceFilter
          ? parseFloat(home.rentPerMonth || home.totalPrice) <= priceFilter
          : true;
        const cityCond = cityMatch
          ? home.city.toLowerCase() === cityMatch.city.toLowerCase()
          : true;
        const typeCond = typeMatch
          ? home.status?.toLowerCase() === typeMatch
          : true;

        return combined.includes(query) || (bedroomCond && priceCond && cityCond && typeCond);
      });

      if (filtered.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: `🏡 Found ${filtered.length} homes matching your search:`,
            homes: filtered,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "😕 No homes match your criteria." },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Error while filtering homes." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        fontFamily: "sans-serif",
      }}
    >
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "#6c5ce7",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "26px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          💬
        </button>
      ) : (
        <div
          style={{
            width: "320px",
            height: "400px",
            border: "1px solid #ccc",
            background: "white",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#6c5ce7",
              color: "white",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <span>🏠 HomeBot</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              background: "#fafafa",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: msg.from === "bot" ? "left" : "right",
                  marginBottom: "10px",
                }}
              >
                <p
                  style={{
                    background: msg.from === "bot" ? "#f0f0f0" : "#d1f1ff",
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    maxWidth: "85%",
                    wordWrap: "break-word",
                  }}
                >
                  {msg.text}
                </p>

                {msg.homes && msg.homes.length > 0 && (
                  <div style={{ marginTop: "8px" }}>
                    {msg.homes.map((home) => (
                      <div
                        key={home.id}
                        onClick={() => onSelectHome(home)}
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          margin: "5px 0",
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "0.3s",
                          background: "white",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        <strong>{home.homeName}</strong> <br />
                        {home.city} • {home.bedrooms} bedrooms <br />
                        💰 ₹{home.rentPerMonth || home.totalPrice}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <p>🤖 Bot is typing...</p>}
          </div>

          {/* Input */}
          <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              style={{
                flex: 1,
                padding: "8px",
                border: "none",
                outline: "none",
                fontSize: "14px",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              style={{
                background: "#6c5ce7",
                color: "white",
                border: "none",
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
