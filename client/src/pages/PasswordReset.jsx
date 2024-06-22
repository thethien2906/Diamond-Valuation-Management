import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, TextField, Paper } from '@mui/material';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
  const { userId } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('/auth/reset-password', { userId, newPassword });
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Reset Password
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Reset Password
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
