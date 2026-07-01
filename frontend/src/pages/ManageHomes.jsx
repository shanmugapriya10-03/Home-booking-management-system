import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ManageHomes.css";

export default function ManageHomes() {
  const { email } = useParams(); // seller email
  const navigate = useNavigate();
  const [homes, setHomes] = useState([]);
  const [error, setError] = useState("");

  // Fetch all homes of the logged-in seller
  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await fetch(`http://localhost:5000/dashboard/${email}`);
        if (!res.ok) throw new Error("Failed to load homes");
        const data = await res.json();
        setHomes(data.homes); // Only seller's homes
      } catch (err) {
        setError(err.message);
      }
    };
    fetchHomes();
  }, [email]);

  // Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/edit-home/${id}`);
  };

  // Delete a home
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this home?")) return;
    try {
      const res = await fetch(`http://localhost:5000/homes/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete home");
      setHomes((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'status-available';
      case 'sold':
        return 'status-sold';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-available';
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!homes) return <div className="loading-message">Loading homes...</div>;

  return (
    <div className="manage-homes-container">
      <div className="header-section">
        <h1 className="manage-homes-header">Manage My Homes</h1>
        <button 
          onClick={() => navigate(`/dashboard`)} 
          className="dashboard-button"
        >
          ← Go to Dashboard
        </button>
      </div>

      {homes.length === 0 ? (
        <div className="no-homes-message">
          <div className="no-homes-icon">🏠</div>
          <div className="no-homes-text">No homes listed yet</div>
          <div className="no-homes-subtext">Start by adding your first property</div>
        </div>
      ) : (
        <div className="homes-grid">
          {homes.map((home) => (
            <div key={home.id} className="home-card">
              <div className="home-image-container">
                {home.imagePath ? (
                  <img
                    src={`http://localhost:5000/uploads/${home.imagePath}`}
                    alt={home.homeName}
                    className="home-image"
                  />
                ) : (
                  <div className="image-fallback">
                    🏠
                  </div>
                )}
              </div>
              
              <div className="home-content">
                <h3 className="home-name">{home.homeName}</h3>
                <p className="home-description">{home.description}</p>
                
                <div className="home-details-grid">
                  <div className="home-detail">
                    <span className="detail-label">Address</span>
                    <span className="detail-value">{home.address}, {home.city}, {home.state}</span>
                  </div>
                  <div className="home-detail">
                    <span className="detail-label">Bedrooms</span>
                    <span className="detail-value">{home.bedrooms}</span>
                  </div>
                  <div className="home-detail">
                    <span className="detail-label">Bathrooms</span>
                    <span className="detail-value">{home.bathrooms}</span>
                  </div>
                </div>

                <div className="price-section">
                  <div className="home-detail">
                    <span className="detail-label">Rent Per Month</span>
                    <span className="detail-value rent-price">₹{home.rentPerMonth}</span>
                  </div>
                  <div className="home-detail">
                    <span className="detail-label">Total Price</span>
                    <span className="detail-value total-price">₹{home.totalPrice}</span>
                  </div>
                </div>

                <div className={`home-status ${getStatusClass(home.status)}`}>
                  {home.status}
                </div>

                <div className="actions-container">
                  <button
                    onClick={() => handleEdit(home.id)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(home.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}