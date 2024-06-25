import { Box, Button, Container, CssBaseline, Paper, TextField, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
            Verify Reset Code
          </Typography>
          <Paper sx={{ p: 3, mt: 2, bgcolor: 'background.paper' }}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                id="resetCode"
                label="Reset Code"
                name="resetCode"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
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
                Verify Code
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PasswordMailVerify;
