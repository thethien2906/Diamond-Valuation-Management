// client/src/pages/AppointmentCalendar.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { Link } from "react-router-dom";

const AppointmentCalendar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const fetchApprovedBookings = async () => {
    try {
      const response = await axios.get(
        `/api/consultants/${user.userID}/appointments`
      );
      setApprovedBookings(response.data);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Handle error (display error message to user)
    }
  };

  const handleRefresh = () => {
    fetchApprovedBookings(); // Call the fetch function when the button is clicked
  };

  const handleViewDetail = (bookingId) => {
    navigate(`/consultant/requests/${bookingId}`);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>

      <h2>Approved Appointments</h2>
      {!showTable && <button onClick={handleRefresh}>Refresh</button>}

      {showTable && ( // Conditionally render the table
        <>
          {approvedBookings.length === 0 ? (
            <p>No approved appointments.</p>
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
                {approvedBookings.map((booking, index) => (
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

export default AppointmentCalendar;

