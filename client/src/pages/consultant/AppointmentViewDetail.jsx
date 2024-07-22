import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Grid
} from "@mui/material";

const AppointmentViewDetail = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`/api/bookings/${bookingId}`);
        const serviceResponse = await axios.get(`/api/services/${response.data.serviceId}`);
        setBookingDetails({ ...response.data, service: serviceResponse.data.name });
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast.error("Failed to fetch booking details"); 
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleGenerateReceipt = () => {
    navigate(`/consultant/receipt-form/${bookingId}`); 
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom textAlign={"center"}>
        Appointment Details
      </Typography>
      {bookingDetails ? (
        <Paper 
          sx={{ 
            p: 3, 
            mt: 2, 
            boxShadow: 3, 
            borderRadius: 2, 
            maxWidth: 600, 
            mx: "auto" 
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Name: {bookingDetails.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Email: {bookingDetails.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Phone Number: {bookingDetails.phoneNumber}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Address: {bookingDetails.address}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Date: {new Date(bookingDetails.date).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Time: {bookingDetails.time}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Service: {bookingDetails.service}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" onClick={handleGenerateReceipt}>
              Next
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
