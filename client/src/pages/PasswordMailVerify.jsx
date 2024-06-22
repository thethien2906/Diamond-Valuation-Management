import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, TextField, Paper } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PasswordMailVerify = () => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/verify-reset-code', { email, resetCode });
      toast.success('Code verified successfully');
      navigate(`/reset-password/${response.data.userId}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Verify Reset Code
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
          <TextField
            label="Reset Code"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Verify Code
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default PasswordMailVerify;
