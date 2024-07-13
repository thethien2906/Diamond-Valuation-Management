import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ConsultantContext } from "../../context/ConsultantContext";
import { toast } from "react-hot-toast";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress
} from "@mui/material";

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
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleApprove = async () => {
    try {
      await axios.put(`/api/bookings/${bookingId}`, { status: "approved" });
      toast.success("Booking approved successfully!");
      navigate("/consultant/appointments");
      setPendingBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error("Error approving booking:", error);
    }
  };

  const handleDeny = async () => {
    try {
      await axios.post(`/api/reject-booking`, { bookingId });
      toast.success("Booking denied and payment refunded.");
      navigate("/consultant/appointments");
    } catch (error) {
      console.error("Error denying booking:", error);
      toast.error("Failed to deny booking.");
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <Typography variant="h4" component="h2" gutterBottom>
        Booking Details
      </Typography>
      {bookingDetails ? (
        <Paper sx={{ p: 3, mt: 2, minWidth: 500,textAlign:'center' }}>
          <Typography variant="h6">Name: {bookingDetails.name}</Typography>
          <Typography variant="body1">Email: {bookingDetails.email}</Typography>
          <Typography variant="body1">Phone Number: {bookingDetails.phoneNumber}</Typography>
          <Typography variant="body1">Identity Card: {bookingDetails.identityCard}</Typography>
          <Typography variant="body1">Address: {bookingDetails.address}</Typography>
          <Typography variant="body1">Date: {bookingDetails.date}</Typography>
          <Typography variant="body1">Time: {bookingDetails.time}</Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApprove}
              sx={{ mr: 2 }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeny}
            >
              Deny
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default ViewRequestDetail;
