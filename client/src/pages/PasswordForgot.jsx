import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, TextField, Paper } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/forgot-password', { email });
      toast.success(response.data.message);
      navigate('/reset-password');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Forgot Password
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Send Reset Code
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
