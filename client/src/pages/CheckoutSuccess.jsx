import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const Success = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/about-us-customer');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="body1" paragraph>
        Thank you for your booking. Your payment has been processed successfully.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoBack}>
        Go to Dashboard
      </Button>
    </Container>
  );
};

export default Success;
