// client/src/pages/ViewRequestDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ConsultantContext } from "../../context/ConsultantContext";
import { toast } from "react-hot-toast";
const ViewRequestDetail = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const { setPendingBookings } = useContext(ConsultantContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`/api/bookings/${bookingId}`);
        setBookingDetails(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        // Handle the error, e.g., display an error message or redirect
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleApprove = async () => {
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: "approved" });
      toast.success("Booking approved successfully!");
      // Optionally: Redirect to AppointmentCalendar or refresh pending bookings list
      setPendingBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
      navigate("/consultant"); // Navigate back to the consultant dashboard after approval/denial
    } catch (error) {
      console.error("Error approving booking:", error);
      // Handle error
    }
  };

  const handleDeny = async () => {
    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      toast.success("Booking denied and deleted.");
      setPendingBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
      navigate("/consultant"); 
    } catch (error) {
      console.error("Error denying booking:", error);
      // Handle error
    }
  };

  return (
    <div>
      <h2>Booking Details</h2>
      {bookingDetails ? (
        <div>
          {/* Display booking details here */}
          <p>Name: {bookingDetails.name}</p>
          <p>Email: {bookingDetails.email}</p>
          <p>Phone Number: {bookingDetails.phoneNumber}</p>
          <p>Identity Card: {bookingDetails.identityCard}</p>
          <p>Address: {bookingDetails.address}</p>
          <p>Date: {bookingDetails.date}</p>
          <p>Time: {bookingDetails.time}</p>
          <button onClick={handleApprove}>Approve</button>
          <button onClick={handleDeny}>Deny</button>
        </div>
      ) : (
        <p>Loading booking details...</p>
      )}
    </div>
  );
};

export default ViewRequestDetail;
