import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-hot-toast';

const GenerateReceiptForm = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [services, setServices] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`/api/bookings/${bookingId}`, {
          params: { populate: 'consultantId' } // Tell the backend to populate
        });
        setBooking(response.data);
      } catch (error) {
        console.error('Error fetching booking data:', error);
        toast.error("Failed to fetch booking data"); // Add a toast error for user feedback
      }
    };

    fetchBookingData();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/generate-receipt/${bookingId}`, {
        services,
        paymentMethod,
        amountPaid
      });
      toast.success('Receipt generated successfully');
      console.log('response.data', response.data); // check the response
      navigate(`/consultant/receipts/${response.data._id}`); // Navigate to the receipt detail page
    } catch (error) {
      console.error('Error generating receipt:', error);
  
      if (error.response) {
        // The request was made and the server responded with a status code
        const errorMessage = error.response.data.error || "Server error";
        toast.error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an error
        toast.error('An error occurred. Please try again.');
      }
    }
  };
  

  if (!booking) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}><CircularProgress /></Box>;
  const consultantName = booking?.consultantId?.name || "Consultant Name Not Found"; 

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Generate Receipt
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="body1">Customer Name: {booking.name}</Typography>
          <Typography variant="body1">Phone: {booking.phoneNumber}</Typography>
          <Typography variant="body1">Email: {booking.email}</Typography>
          <Typography variant="body1">Appointment Date: {booking.date}</Typography>
          <Typography variant="body1">Appointment Time: {booking.time}</Typography>
          <Typography variant="body1">Consultant Name: {consultantName}</Typography>
          <TextField
            select
            label="Services"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Service 1">Service 1</MenuItem>
            <MenuItem value="Service 2">Service 2</MenuItem>
            <MenuItem value="Service 3">Service 3</MenuItem>
          </TextField>
          <TextField
            select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Method 1">Method 1</MenuItem>
            <MenuItem value="Method 2">Method 2</MenuItem>
          </TextField>
          <TextField
            label="Amount Paid"
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Generate Receipt
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default GenerateReceiptForm;
