import CloseIcon from '@mui/icons-material/Close';
import DiamondIcon from '@mui/icons-material/Diamond';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { UserContext } from "../context/userContext";

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

export default function SignInSide() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", data);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        navigateToDashboard(response.data.role);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "An error occurred during login.");
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  const navigateToDashboard = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "consultant":
        navigate("/consultant");
        break;
      case "appraiser":
        navigate("/appraiser");
        break;
      case "manager":
        navigate("/manager");
        break;
      default:
        navigate("/dashboard");
    }
  };

  useEffect(() => {
    if (user) {
      navigateToDashboard(user.role);
    }
  }, [user]);

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
            backgroundImage: 'url(/Diamond.jpg?url)',
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
              <DiamondIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={loginUser} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                InputProps={{
                  style: { color: '#FFFFFF' }, // White text
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
                  style: { color: '#FFFFFF' }, // White text
                }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: '#00BFFF' }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link component={RouterLink} to="/forgot-password" variant="body2" sx={{ color: '#B0C4DE' }}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={RouterLink} to="/register" variant="body2" sx={{ color: '#B0C4DE' }}>
                    {"Don't have an account? Register"}
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Typography variant="body2" color="text.secondary" align="center">
                  {'Copyright © '}
                  <Link color="inherit" href="https://mui.com/">
                    DiamondScope
                  </Link>{' '}
                  {new Date().getFullYear()}
                  {'.'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
