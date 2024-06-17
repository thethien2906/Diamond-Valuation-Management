import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { UserContext } from "../../context/userContext"; // To get consultant ID

const ViewRequest = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedBookings = async () => {
      if (!user || !user.userID) {
        console.error("User context:", user); // Debug logging
        return;
      }
      try {
        const response = await axios.get(`/api/consultants/${user.userID}/appointments`);
        setApprovedBookings(response.data);
      } catch (error) {
        console.error("Error fetching approved bookings:", error);
        setError("Error fetching approved bookings");
      }
    };

    fetchApprovedBookings();
  }, [user]);

  const handleViewReceipt = async (bookingId) => {
    try {
      navigate(`/receipt/${bookingId}`);
    } catch (error) {
      console.error("Error viewing receipt:", error);
      setError("Error viewing receipt");
    }
  };
  

  const handleRemove = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: 'removed' });
      setApprovedBookings(approvedBookings.filter(booking => booking._id !== bookingId));
    } catch (error) {
      console.error("Error removing booking:", error);
      setError("Error removing booking");
    }
  };

  return (
    <div>
      <h2>View Requests</h2>
      {error && <p className="error">{error}</p>}
      {approvedBookings.length > 0 ? (
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
            {approvedBookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                <td>{booking._id}</td>
                <td>{booking.name}</td>
                <td><button>View Detail</button></td>
                <td>{booking.status}</td>
                <td>
                  <button onClick={() => handleViewReceipt(booking._id)}>View Receipt</button>
                  <button onClick={() => handleRemove(booking._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No approved requests.</p>
      )}
    </div>
  );
};

export default ViewRequest;
