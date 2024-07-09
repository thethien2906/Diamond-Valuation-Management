import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const Cancel = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const cancelBooking = async () => {
      const params = new URLSearchParams(location.search);
      const bookingId = params.get('bookingId'); // Assuming the bookingId is passed as a query parameter

      if (bookingId) {
        try {
          await axios.post('/api/cancel-booking', { bookingId });
        } catch (error) {
          console.error('Error cancelling booking:', error);
        }
      }
    };

    cancelBooking();
  }, [location.search]);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Payment Cancelled
      </Typography>
      <Typography variant="body1" paragraph>
        Your payment was cancelled. If you have any questions, please contact us.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoBack}>
        Go to Dashboard
      </Button>
    </Container>
  );
};

export default Cancel;
