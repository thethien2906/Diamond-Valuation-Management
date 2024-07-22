import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import DiamondIcon from '@mui/icons-material/Diamond';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// Footer component
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// Create a theme that matches the login page
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

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const { name, email, password } = data;

    if (!name || !email || !password) {
      toast.error("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email address.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axios.post('/auth/register', { name, email, password });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setData({ name: '', email: '', password: '' });
        toast.success('Registered successfully! Please verify through your email.');
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during registration.");
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(Diamond.jpg?url)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <DiamondIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box component="form" noValidate onSubmit={registerUser} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                InputProps={{
                  style: { color: '#FFFFFF', backgroundColor: 'transparent' }, // White text, transparent background
                  disableUnderline: true, // Disable the underline to make it look cleaner
                }}
                InputLabelProps={{
                  style: { color: '#B0C4DE' }, // Light blue text for the label
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#B0C4DE', // Light blue border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#00BFFF', // Fluorescent blue border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00BFFF', // Fluorescent blue border color when focused
                    },
                    '&.Mui-disabled fieldset': {
                      borderColor: '#B0C4DE', // Light blue border color when disabled
                    },
                  },
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 30px #121212 inset !important', // Maintain dark background on autofill
                    WebkitTextFillColor: '#FFFFFF !important', // White text on autofill
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                InputProps={{
                  style: { color: '#FFFFFF', backgroundColor: 'transparent' }, // White text, transparent background
                  disableUnderline: true, // Disable the underline to make it look cleaner
                }}
                InputLabelProps={{
                  style: { color: '#B0C4DE' }, // Light blue text for the label
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#B0C4DE', // Light blue border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#00BFFF', // Fluorescent blue border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00BFFF', // Fluorescent blue border color when focused
                    },
                    '&.Mui-disabled fieldset': {
                      borderColor: '#B0C4DE', // Light blue border color when disabled
                    },
                  },
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 30px #121212 inset !important', // Maintain dark background on autofill
                    WebkitTextFillColor: '#FFFFFF !important', // White text on autofill
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                InputProps={{
                  style: { color: '#FFFFFF', backgroundColor: 'transparent' }, // White text, transparent background
                  disableUnderline: true, // Disable the underline to make it look cleaner
                  minLength: 6,
                }}
                InputLabelProps={{
                  style: { color: '#B0C4DE' }, // Light blue text for the label
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#B0C4DE', // Light blue border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#00BFFF', // Fluorescent blue border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00BFFF', // Fluorescent blue border color when focused
                    },
                    '&.Mui-disabled fieldset': {
                      borderColor: '#B0C4DE', // Light blue border color when disabled
                    },
                  },
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 30px black inset !important', // Maintain dark background on autofill
                    WebkitTextFillColor: '#FFFFFF !important', // White text on autofill
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/login" variant="body2">
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
