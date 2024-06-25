import { Box, Button, Container, CssBaseline, Paper, TextField, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00BFFF', // Fluorescent blue
    },
    secondary: {
      main: '#FFFFFF', // White
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1E1E1E', // Paper background
    },
  },
  typography: {
    h5: {
      color: '#FFFFFF', // White text for headings
    },
    body2: {
      color: '#B0C4DE', // Light blue text for secondary content
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'background.default',
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Paper sx={{ p: 3, mt: 2, bgcolor: 'background.paper' }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="newPassword"
                label="New Password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputLabelProps={{
                  style: { color: '#B0C4DE' }, // Light blue label
                }}
                InputProps={{
                  style: { color: '#FFFFFF' }, // White text
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputLabelProps={{
                  style: { color: '#B0C4DE' }, // Light blue label
                }}
                InputProps={{
                  style: { color: '#FFFFFF' }, // White text
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: '#00BFFF',
                  '&:hover': { bgcolor: '#0099CC' },
                  boxShadow: '0 0 10px #00BFFF',
                }} // Fluorescent blue button with hover effect and shadow
              >
                Reset Password
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ResetPassword;
