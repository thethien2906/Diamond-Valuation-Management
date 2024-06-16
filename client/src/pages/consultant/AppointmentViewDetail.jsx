import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress
} from "@mui/material";

const AppointmentViewDetail = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const navigate = useNavigate(); // Assuming you want to navigate after generating receipt

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`/api/bookings/${bookingId}`);
        setBookingDetails(response.data);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast.error("Failed to fetch booking details"); // Add a toast error for user feedback
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleGenerateReceipt = () => {
    navigate(`/consultant/receipt-form/${bookingId}`); 
  };



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Appointment Details
      </Typography>
      {bookingDetails ? (
        <Paper sx={{ p: 3, mt: 2 }}>
          {/* Display booking details like in RequestViewDetail */}
          <Typography variant="h6">Name: {bookingDetails.name}</Typography>
          <Typography variant="body1">Email: {bookingDetails.email}</Typography>
          <Typography variant="body1">Phone Number: {bookingDetails.phoneNumber}</Typography>
          <Typography variant="body1">Identity Card: {bookingDetails.identityCard}</Typography>
          <Typography variant="body1">Address: {bookingDetails.address}</Typography>
          <Typography variant="body1">Date: {bookingDetails.date}</Typography>
          <Typography variant="body1">Time: {bookingDetails.time}</Typography>

          <Box sx={{ mt: 3 }}>
            {/* Generate Receipt Button */}
            <Button variant="contained" color="primary" onClick={handleGenerateReceipt}>
              Generate Receipt
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

export default AppointmentViewDetail;
