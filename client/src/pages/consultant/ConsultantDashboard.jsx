// client/src/pages/ConsultantDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { Link } from "react-router-dom";
const ConsultantDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [showTable, setShowTable] = useState(false); 

  const fetchPendingBookings = async () => {
    try {
      const response = await axios.get(
        `/api/consultants/${user.userID}/pending-bookings` // Make sure this matches your backend endpoint
      );
      setPendingBookings(response.data); // Update the state with fetched data
      setShowTable(true); // Show the table after fetching
    } catch (error) {
      console.error("Error fetching booking requests:", error);
      // Handle error (display error message to user)
    }
  };

  const handleRefresh = () => {
    fetchPendingBookings(); // Call the fetch function when the button is clicked
  };
  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout"); 
      setUser(null);
      localStorage.removeItem("user"); // Clear user data from localStorage
      navigate("/login"); 
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout errors if necessary
    }
  };

  const handleViewDetail = (bookingId) => {
    navigate(`/consultant/requests/${bookingId}`); 
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/consultant/appointments">View Appointment Calendar</Link>
      <h2>Pending Requests</h2>
      {!showTable && <button onClick={handleRefresh}>Refresh</button>}

      {showTable && ( // Conditionally render the table
        <>
          {pendingBookings.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Request ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingBookings.map((booking, index) => (
                  <tr key={booking._id}>
                    <td>{index + 1}</td>
                    <td>{booking._id}</td>
                    <td>{booking.name}</td>
                    <td>{booking.phoneNumber}</td>
                    <td>
                    <Link to={`/consultant/requests/${booking._id}`}>  
                        View Detail 
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default ConsultantDashboard;
