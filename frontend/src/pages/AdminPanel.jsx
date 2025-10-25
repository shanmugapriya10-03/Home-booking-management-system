import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function AdminPanel() {
  const navigate = useNavigate();

  const [overview, setOverview] = useState(null);
  const [homes, setHomes] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [ovRes, homesRes, usersRes, bookingsRes, repRes] = await Promise.all([
        axios.get("http://localhost:5000/admin/overview"),
        axios.get("http://localhost:5000/admin/homes"),
        axios.get("http://localhost:5000/admin/users"),
        axios.get("http://localhost:5000/admin/bookings"),
        axios.get("http://localhost:5000/admin/reports/revenue"),
      ]);
      setOverview(ovRes.data);
      setHomes(homesRes.data);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
      setReport(repRes.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
      setError("Failed to load admin data. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const deleteHome = async (id) => {
    if (!window.confirm("Are you sure you want to delete this home?")) return;
    try {
      await axios.delete(`http://localhost:5000/admin/homes/${id}`);
      setHomes((prev) => prev.filter((h) => h.id !== id));
      alert("Home deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete home");
    }
  };

  const downloadCSV = () => {
    window.location.href = "http://localhost:5000/admin/export/bookings.csv";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const chartData =
    report && report.payments
      ? report.payments
          .slice()
          .reverse()
          .map((r) => ({
            date: new Date(r.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            }),
            revenue: Number(r.revenue) || 0,
            bookings: r.count || 0,
          }))
      : [];

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "homes", label: "Homes", icon: Home },
    { id: "users", label: "Users", icon: Users },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 60, fontFamily: "Inter, Arial, sans-serif" }}>
        Loading admin data...
      </div>
    );
  if (error)
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: 60, fontFamily: "Inter, Arial, sans-serif" }}>
        {error}
      </div>
    );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, Arial, sans-serif", background: "#f8f9fa" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 260 : 80,
          background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)",
          color: "#fff",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {sidebarOpen && (
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Admin Panel</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: 8,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "20px 0", overflowY: "auto" }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: "100%",
                  padding: sidebarOpen ? "14px 20px" : "14px 0",
                  background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  borderLeft: isActive ? "4px solid #fff" : "4px solid transparent",
                  transition: "all 0.2s ease",
                  fontSize: 15,
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon size={22} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: 20, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: sidebarOpen ? "12px 16px" : "12px 0",
              background: "#ef4444",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 12,
              justifyContent: sidebarOpen ? "flex-start" : "center",
              fontSize: 15,
              fontWeight: 600,
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: "auto", padding: 32 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Overview Tab */}
          {activeTab === "overview" && overview && (
            <section>
              <h2 style={{ marginBottom: 24, fontSize: 28, fontWeight: 700, color: "#1f2937" }}>Dashboard Overview</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
                <StatCard title="Homes" value={overview.totalHomes} color="#6c5ce7" />
                <StatCard
                  title="Bookings"
                  value={overview.totalBookings}
                  subtitle={`Pending: ${overview.pendingBookings}`}
                  color="#00b894"
                />
                <StatCard title="Users" value={overview.totalUsers} color="#0984e3" />
                <StatCard
                  title="Revenue (₹)"
                  value={Number(overview.revenue).toLocaleString()}
                  color="#fdcb6e"
                />
                <StatCard title="Pending Homes" value={overview.pendingHomes} color="#fd79a8" />
              </div>

              <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                <h3 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>Revenue - Last 30 Days</h3>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        formatter={(value, name) =>
                          name === "Revenue" ? [`₹${value}`, name] : [value, name]
                        }
                        contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }}
                      />
                      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#6c5ce7" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#00b894" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          )}

          {/* Homes Tab */}
          {activeTab === "homes" && (
            <section>
              <h2 style={{ marginBottom: 24, fontSize: 28, fontWeight: 700, color: "#1f2937" }}>Homes ({homes.length})</h2>
              <div style={{ display: "grid", gap: 16 }}>
                {homes.map((h) => (
                  <div key={h.id} style={cardStyle}>
                    <img
                      src={h.imageUrl || "https://via.placeholder.com/160x100"}
                      alt={h.homeName}
                      style={{ width: 160, height: 100, objectFit: "cover", borderRadius: 8 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <strong style={{ fontSize: 18 }}>{h.homeName}</strong>
                        <span style={statusBadge(h.status)}>{h.status}</span>
                      </div>
                      <div style={{ color: "#6b7280", marginBottom: 8 }}>
                        📍 {h.city}, {h.state}
                      </div>
                      <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                        <div style={{ fontWeight: 700, color: "#1f2937", fontSize: 18 }}>
                          ₹{h.rentPerMonth || h.totalPrice}
                        </div>
                        <div style={{ color: "#6b7280" }}>
                          {h.sellerName} · {h.sellerEmail}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {h.photoUrl && (
                          <a href={h.photoUrl} target="_blank" rel="noreferrer" style={linkBtn}>
                            🖼 Photo
                          </a>
                        )}
                        {h.aadharUrl && (
                          <a href={h.aadharUrl} target="_blank" rel="noreferrer" style={linkBtn}>
                            🪪 Aadhaar
                          </a>
                        )}
                        <button onClick={() => deleteHome(h.id)} style={deleteBtnStyle}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <section>
              <h2 style={{ marginBottom: 24, fontSize: 28, fontWeight: 700, color: "#1f2937" }}>Users ({users.length})</h2>
              <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#f8f9fa" }}>
                    <tr>
                      <th style={thStyle}>ID</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Provider</th>
                      <th style={thStyle}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={tdStyle}>{u.id}</td>
                        <td style={tdStyle}>{u.name}</td>
                        <td style={tdStyle}>{u.email}</td>
                        <td style={tdStyle}>{u.provider}</td>
                        <td style={tdStyle}>
                          <span style={{ ...roleBadge, background: u.role === "admin" ? "#fef3c7" : "#dbeafe", color: u.role === "admin" ? "#92400e" : "#1e40af" }}>
                            {u.role || "user"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <section>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1f2937", margin: 0 }}>Bookings ({bookings.length})</h2>
                <button onClick={downloadCSV} style={exportBtnStyle}>
                  Export CSV
                </button>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {bookings.map((b) => (
                  <div key={b.bookingId} style={cardStyle}>
                    <img
                      src={b.homeImageUrl || "https://via.placeholder.com/140x90"}
                      alt={b.homeName}
                      style={{ width: 140, height: 90, objectFit: "cover", borderRadius: 8 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <strong style={{ fontSize: 18 }}>{b.homeName}</strong>
                          <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                            📍 {b.city}, {b.state}
                          </div>
                          <div style={{ marginTop: 8, color: "#374151" }}>
                            Buyer: {b.userName} ({b.userEmail})
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, fontSize: 16 }}>{b.bookingType}</div>
                          <div style={{ marginTop: 8 }}>
                            <span style={bookingStatusBadge(b.status)}>{b.status}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        {b.photoUrl && (
                          <a href={b.photoUrl} target="_blank" rel="noreferrer" style={linkBtn}>
                            🖼 Photo
                          </a>
                        )}
                        {b.aadharUrl && (
                          <a href={b.aadharUrl} target="_blank" rel="noreferrer" style={linkBtn}>
                            🪪 Aadhaar
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <section>
              <h2 style={{ marginBottom: 24, fontSize: 28, fontWeight: 700, color: "#1f2937" }}>Revenue Reports</h2>
              <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                <div style={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        formatter={(value, name) =>
                          name === "Revenue" ? [`₹${value}`, name] : [value, name]
                        }
                        contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8 }}
                      />
                      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#6c5ce7" strokeWidth={3} dot={{ r: 5 }} />
                      <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#00b894" strokeWidth={3} dot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

// Components & Styles
function StatCard({ title, value, subtitle, color }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#1f2937" }}>{value}</div>
      {subtitle && <div style={{ color: "#9ca3af", marginTop: 6, fontSize: 13 }}>{subtitle}</div>}
    </div>
  );
}

const cardStyle = {
  display: "flex",
  gap: 16,
  padding: 20,
  borderRadius: 12,
  background: "#fff",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  alignItems: "flex-start",
};

const linkBtn = {
  padding: "8px 12px",
  borderRadius: 8,
  background: "#f3f4f6",
  color: "#374151",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
  display: "inline-block",
};

const deleteBtnStyle = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  transition: "background 0.2s ease",
};

const exportBtnStyle = {
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  background: "#6c5ce7",
  color: "#fff",
  cursor: "pointer",
  fontSize: 15,
  fontWeight: 600,
  transition: "background 0.2s ease",
};

const thStyle = {
  padding: "16px",
  textAlign: "left",
  fontSize: 14,
  fontWeight: 600,
  color: "#374151",
};

const tdStyle = {
  padding: "16px",
  fontSize: 14,
  color: "#6b7280",
};

const roleBadge = {
  padding: "4px 12px",
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 600,
};

const statusBadge = (status) => ({
  padding: "4px 12px",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  background: status === "approved" ? "#d1fae5" : status === "pending" ? "#fef3c7" : "#fee2e2",
  color: status === "approved" ? "#065f46" : status === "pending" ? "#92400e" : "#991b1b",
});

const bookingStatusBadge = (status) => ({
  padding: "6px 14px",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  background: status === "paid" ? "#d1fae5" : status === "rejected" ? "#fee2e2" : "#fef3c7",
  color: status === "paid" ? "#065f46" : status === "rejected" ? "#991b1b" : "#92400e",
});