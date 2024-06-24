import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-hot-toast';

const GenerateReceiptForm = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [service, setService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`/api/bookings/${bookingId}`, {
          params: { populate: 'consultantId serviceId' } // Tell the backend to populate
        });
        setBooking(response.data);

        if (response.data.serviceId) {
          const serviceResponse = await axios.get(`/api/services/${response.data.serviceId}`);
          setService(serviceResponse.data);
        }
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
      const response = await axios.post(`/api/generate-receipt/${bookingId}`);
      toast.success('Receipt generated successfully');
      navigate(`/consultant/receipts/${response.data._id}`); // Navigate to the receipt detail page
    } catch (error) {
      console.error('Error generating receipt:', error);
      toast.error('Failed to generate receipt');
    }
  };

  if (!booking || !service) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}><CircularProgress /></Box>;
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
          <Typography variant="body1">Service: {service.name}</Typography>
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
