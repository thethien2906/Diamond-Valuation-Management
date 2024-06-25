import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button, Container, CssBaseline, Paper, TextField, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
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
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
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
              Send Reset Code
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/login" variant="body2" sx={{ color: '#B0C4DE' }}>
                  Remembered your password? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Paper elevation={6} sx={{ mt: 3, p: 3, bgcolor: 'background.paper' }}>
          <Typography variant="body2" align="center">
            Enter your email address and we will send you a code to reset your password.
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default ForgotPassword;
