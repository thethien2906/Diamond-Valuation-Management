// client/src/pages/ViewRequest.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { UserContext } from "../../context/userContext"; // To get consultant ID

const ViewRequest = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [pendingBookings, setPendingBookings] = useState([]);

  useEffect(() => {
    const fetchPendingBookings = async () => {
      if (!user || !user.UserID) { // Add this check
        console.error("User ID not found");
        return;
      }
      try {
        const response = await axios.get(`/api/consultants/${user.UserID}/pending-bookings`);
        setPendingBookings(response.data);
      } catch (error) {
        console.error("Error fetching pending bookings:", error);
      }
    };

    fetchPendingBookings();
  }, [user]); // Run the effect when the `user` changes

  const handleApprove = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: 'approved' });
      // After approving, update the pendingBookings state to remove this booking
      setPendingBookings(pendingBookings.filter(booking => booking._id !== bookingId));
    } catch (error) {
      console.error("Error approving booking:", error);
    }
  };
  

  const handleDeny = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: 'rejected' });
      // After rejecting, update the pendingBookings state to remove this booking
      setPendingBookings(pendingBookings.filter(booking => booking._id !== bookingId));
    } catch (error) {
      console.error("Error rejecting booking:", error);
    }
  };

  return (
    <div>
      <h2>View Requests</h2>
      {pendingBookings.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Request ID</th>
              <th>Name</th>
              <th>Detail</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingBookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                <td>{booking._id}</td>
                <td>{booking.name}</td>
                <td><button>View Detail</button></td> 
                <td>{booking.status}</td>
                <td>
                  <button onClick={() => handleApprove(booking._id)}>Accept</button>
                  <button onClick={() => handleDeny(booking._id)}>Deny</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending requests.</p>
      )}
    </div>
  );
};

export default ViewRequest;
