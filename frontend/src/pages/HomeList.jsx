import React, { useEffect, useState } from "react";

const HomeList = () => {
  const [show, setShow] = useState("homes"); // "homes" or "bookings"
  const [homes, setHomes] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchHomes();
    fetchBookings();
  }, []);

  const fetchHomes = () => {
    // Using fetch instead of axios for demo
    fetch("http://localhost:5000/api/homes")
      .then(res => res.json())
      .then(data => setHomes(data))
      .catch(err => console.log(err));
  };

  const fetchBookings = () => {
    // Using fetch instead of axios for demo
    fetch("http://localhost:5000/api/bookings")
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.log(err));
  };

  // Logout function
  const handleLogout = () => {
    // Show confirmation
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear any stored authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userSession');
      sessionStorage.clear();
      
      // Show logout message
      alert('You have been successfully logged out!');
      
      // Redirect to login page
      window.location.href = '/login'; // Change this to your actual login route
      // Alternative for React Router: navigate('/login');
    }
  };

  // Download function for CSV
  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert('No data available to download');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      backgroundColor: 'white',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    headerTitle: {
      color: '#333',
      fontSize: '28px',
      fontWeight: '700',
      margin: 0
    },
    logoutButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(220,53,69,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    logoutButtonHover: {
      backgroundColor: '#c82333',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 6px rgba(220,53,69,0.4)'
    },
    toggleContainer: {
      marginBottom: '30px',
      textAlign: 'center'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    toggleButton: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,123,255,0.3)'
    },
    toggleButtonHover: {
      backgroundColor: '#0056b3',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,123,255,0.4)'
    },
    downloadButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(40,167,69,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    downloadButtonHover: {
      backgroundColor: '#218838',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(40,167,69,0.4)'
    },
    sectionContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    heading: {
      color: '#333',
      fontSize: '24px',
      fontWeight: '600',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
      margin: 0
    },
    tableContainer: {
      overflowX: 'auto',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
      backgroundColor: 'white'
    },
    tableHeader: {
      backgroundColor: '#007bff',
      color: 'white',
      fontWeight: '600',
      textAlign: 'left'
    },
    tableHeaderCell: {
      padding: '12px 8px',
      borderRight: '1px solid rgba(255,255,255,0.2)',
      fontSize: '13px',
      fontWeight: '600'
    },
    tableRow: {
      transition: 'background-color 0.2s ease'
    },
    tableRowEven: {
      backgroundColor: '#f8f9fa'
    },
    tableRowHover: {
      backgroundColor: '#e3f2fd'
    },
    tableCell: {
      padding: '10px 8px',
      borderRight: '1px solid #dee2e6',
      borderBottom: '1px solid #dee2e6',
      fontSize: '13px',
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    statusActive: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500'
    },
    statusInactive: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500'
    }
  };

  // Sample data for demo (since API calls won't work in this environment)
  const sampleHomes = [
    {
      id: 1,
      homeName: "Cozy Family House",
      description: "Beautiful 3-bedroom house with modern amenities",
      address: "123 Main Street",
      state: "CA",
      city: "Los Angeles",
      phone: "555-0123",
      bedrooms: 3,
      bathrooms: 2,
      parkingArea: "2 Car Garage",
      rentPerMonth: "$2500",
      totalPrice: "$450000",
      sellerName: "John Doe",
      sellerEmail: "john@example.com",
      status: "active"
    },
    {
      id: 2,
      homeName: "Modern Apartment",
      description: "Spacious downtown apartment with city views",
      address: "456 Oak Avenue",
      state: "NY",
      city: "New York",
      phone: "555-0456",
      bedrooms: 2,
      bathrooms: 1,
      parkingArea: "Street Parking",
      rentPerMonth: "$3200",
      totalPrice: "$650000",
      sellerName: "Jane Smith",
      sellerEmail: "jane@example.com",
      status: "inactive"
    }
  ];

  const sampleBookings = [
    {
      id: 1,
      homeId: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "555-7890",
      bookingType: "Rental",
      status: "confirmed",
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      homeId: 2,
      name: "Bob Wilson",
      email: "bob@example.com",
      phone: "555-3456",
      bookingType: "Purchase",
      status: "pending",
      createdAt: "2024-01-16T14:15:00Z"
    }
  ];

  // Use sample data if API data is empty
  const displayHomes = homes.length > 0 ? homes : sampleHomes;
  const displayBookings = bookings.length > 0 ? bookings : sampleBookings;

  return (
    <div style={styles.container}>
      {/* Header with Logout Button */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          style={styles.logoutButton}
          onMouseOver={(e) => Object.assign(e.target.style, styles.logoutButtonHover)}
          onMouseOut={(e) => Object.assign(e.target.style, styles.logoutButton)}
        >
          🚪 Logout
        </button>
      </div>

      {/* Toggle Buttons */}
      <div style={styles.toggleContainer}>
        <div style={styles.buttonGroup}>
          {show === "homes" ? (
            <button 
              onClick={() => setShow("bookings")}
              style={styles.toggleButton}
              onMouseOver={(e) => Object.assign(e.target.style, styles.toggleButtonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, styles.toggleButton)}
            >
              Show Bookings
            </button>
          ) : (
            <button 
              onClick={() => setShow("homes")}
              style={styles.toggleButton}
              onMouseOver={(e) => Object.assign(e.target.style, styles.toggleButtonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, styles.toggleButton)}
            >
              Show Homes
            </button>
          )}
        </div>
      </div>

      {/* Homes Table */}
      {show === "homes" && (
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.heading}>All Homes Added</h2>
            <button
              onClick={() => downloadCSV(displayHomes, 'homes-data.csv')}
              style={styles.downloadButton}
              onMouseOver={(e) => Object.assign(e.target.style, styles.downloadButtonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, styles.downloadButton)}
            >
              ⬇ Download Homes Data
            </button>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>ID</th>
                  <th style={styles.tableHeaderCell}>Home Name</th>
                  <th style={styles.tableHeaderCell}>Description</th>
                  <th style={styles.tableHeaderCell}>Address</th>
                  <th style={styles.tableHeaderCell}>State</th>
                  <th style={styles.tableHeaderCell}>City</th>
                  <th style={styles.tableHeaderCell}>Phone</th>
                  <th style={styles.tableHeaderCell}>Bedrooms</th>
                  <th style={styles.tableHeaderCell}>Bathrooms</th>
                  <th style={styles.tableHeaderCell}>Parking Area</th>
                  <th style={styles.tableHeaderCell}>Rent/Month</th>
                  <th style={styles.tableHeaderCell}>Total Price</th>
                  <th style={styles.tableHeaderCell}>Seller Name</th>
                  <th style={styles.tableHeaderCell}>Seller Email</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                </tr>
              </thead>
              <tbody>
                {displayHomes.map((home, index) => (
                  <tr 
                    key={home.id}
                    style={{
                      ...styles.tableRow,
                      ...(index % 2 === 0 ? styles.tableRowEven : {})
                    }}
                    onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.tableRowHover)}
                    onMouseOut={(e) => Object.assign(e.currentTarget.style, {
                      ...styles.tableRow,
                      ...(index % 2 === 0 ? styles.tableRowEven : {})
                    })}
                  >
                    <td style={styles.tableCell}>{home.id}</td>
                    <td style={styles.tableCell} title={home.homeName}>{home.homeName}</td>
                    <td style={styles.tableCell} title={home.description}>{home.description}</td>
                    <td style={styles.tableCell} title={home.address}>{home.address}</td>
                    <td style={styles.tableCell}>{home.state}</td>
                    <td style={styles.tableCell}>{home.city}</td>
                    <td style={styles.tableCell}>{home.phone}</td>
                    <td style={styles.tableCell}>{home.bedrooms}</td>
                    <td style={styles.tableCell}>{home.bathrooms}</td>
                    <td style={styles.tableCell}>{home.parkingArea}</td>
                    <td style={styles.tableCell}>{home.rentPerMonth}</td>
                    <td style={styles.tableCell}>{home.totalPrice}</td>
                    <td style={styles.tableCell} title={home.sellerName}>{home.sellerName}</td>
                    <td style={styles.tableCell} title={home.sellerEmail}>{home.sellerEmail}</td>
                    <td style={styles.tableCell}>
                      <span style={home.status === 'active' ? styles.statusActive : styles.statusInactive}>
                        {home.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      {show === "bookings" && (
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.heading}>All Bookings</h2>
            <button
              onClick={() => downloadCSV(displayBookings, 'bookings-data.csv')}
              style={styles.downloadButton}
              onMouseOver={(e) => Object.assign(e.target.style, styles.downloadButtonHover)}
              onMouseOut={(e) => Object.assign(e.target.style, styles.downloadButton)}
            >
              ⬇ Download Bookings Data
            </button>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>ID</th>
                  <th style={styles.tableHeaderCell}>Home ID</th>
                  <th style={styles.tableHeaderCell}>Name</th>
                  <th style={styles.tableHeaderCell}>Email</th>
                  <th style={styles.tableHeaderCell}>Phone</th>
                  <th style={styles.tableHeaderCell}>Booking Type</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                  <th style={styles.tableHeaderCell}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {displayBookings.map((b, index) => (
                  <tr 
                    key={b.id}
                    style={{
                      ...styles.tableRow,
                      ...(index % 2 === 0 ? styles.tableRowEven : {})
                    }}
                    onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.tableRowHover)}
                    onMouseOut={(e) => Object.assign(e.currentTarget.style, {
                      ...styles.tableRow,
                      ...(index % 2 === 0 ? styles.tableRowEven : {})
                    })}
                  >
                    <td style={styles.tableCell}>{b.id}</td>
                    <td style={styles.tableCell}>{b.homeId}</td>
                    <td style={styles.tableCell} title={b.name}>{b.name}</td>
                    <td style={styles.tableCell} title={b.email}>{b.email}</td>
                    <td style={styles.tableCell}>{b.phone}</td>
                    <td style={styles.tableCell}>{b.bookingType}</td>
                    <td style={styles.tableCell}>
                      <span style={b.status === 'confirmed' ? styles.statusActive : styles.statusInactive}>
                        {b.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{new Date(b.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeList;