import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const Cancel = () => {
  const navigate = useNavigate();

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
