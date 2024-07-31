import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  MenuItem,
  Grid,
  useMediaQuery,
  useTheme,
  Box,
  Menu,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import { UserContext } from '../context/userContext';

const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
      localStorage.removeItem('user');
      navigate('/'); // Redirect to the homepage or any other desired page
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout errors here if needed
    }
  };

  const handleRecordTracking = () => {
    navigate('/record-tracking');
  };

  const handleBookingHistory = () => {
    navigate('/booking-history');
  };

  const handleViewProfile = () => {
    navigate(`/users/${user._id}`);
  };

  const handleValuationTool = () => {
    if (user) {
      navigate('/valuation');
    } else {
      navigate('/login');
    }
  };

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <div className="customer-layout">
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#021732',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'top 0.3s',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-start', padding: '10px' }}>
            <img
              style={{ width: '80px', height: 'auto' }}
              src="/LogoHeader.jpg"
              alt="Logo"
            />
          </div>

          {isMdUp && (
            <div style={{ flex: '2', display: 'flex', justifyContent: 'center', gap: '50px' }}>
              <MenuItem component={Link} to="/Home" sx={{ padding: '12px 12px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '14px' }}>
                  HOME
                </Typography>
              </MenuItem>
              <MenuItem component={Link} to="/about-us-customer" sx={{ padding: '12px 12px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '14px' }}>
                  ABOUT US
                </Typography>
              </MenuItem>
              <MenuItem component={Link} to="/consulting-services-customer" sx={{ padding: '12px 12px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '14px' }}>
                  CONSULTING SERVICE
                </Typography>
              </MenuItem>
              <MenuItem sx={{ padding: '12px 12px', color: 'white', textDecoration: 'none', cursor: 'pointer' }} onClick={handleValuationTool}>
                <Typography sx={{ fontSize: '14px' }}>
                  VALUATION TOOL
                </Typography>
              </MenuItem>
              <MenuItem component={Link} to="/blog" sx={{ padding: '12px 12px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '14px' }}>
                  BLOGS
                </Typography>
              </MenuItem>
            </div>
          )}

          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', marginRight: '50px' }}>
            {user ? (
              <>
                {isMdUp ? (
                  <>
                    <Typography variant="h6" sx={{ fontSize: '14px', color: 'white', cursor: 'pointer' }} onClick={handleMenu}>
                      {user.name}
                    </Typography>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      sx={{ marginTop: '40px' }}
                    >
                      {user && (
                        <>
                          <MenuItem onClick={handleRecordTracking}>Record Tracking</MenuItem>
                          <MenuItem onClick={handleBookingHistory}>Booking History</MenuItem>
                          <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
                          <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                        </>
                      )}
                    </Menu>
                  </>
                ) : (
                  <IconButton
                    edge="end"
                    aria-label="menu"
                    onClick={toggleDrawer}
                    sx={{ color: 'white' }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </>
            ) : (
              <Typography
                component={Link}
                to="/login"
                sx={{ fontSize: '14px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}
              >
                Login
              </Typography>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {!isMdUp && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{ '& .MuiDrawer-paper': { width: '250px' } }}
        >
          <div onClick={toggleDrawer} onKeyDown={toggleDrawer}>
            <List sx={{ marginTop: '100px' }}>
              {user && (
                <ListItemText primary={user.name} sx={{ textAlign: 'center' }} />
              )}
              <ListItemButton component={Link} to="/Home" onClick={toggleDrawer}>
                <ListItemText primary="HOME" />
              </ListItemButton>
              <ListItemButton component={Link} to="/about-us-customer" onClick={toggleDrawer}>
                <ListItemText primary="ABOUT US" />
              </ListItemButton>
              <ListItemButton component={Link} to="/consulting-services-customer" onClick={toggleDrawer}>
                <ListItemText primary="CONSULTING SERVICE" />
              </ListItemButton>
              <ListItemButton onClick={handleValuationTool}>
                <ListItemText primary="VALUATION TOOL" />
              </ListItemButton>
              <ListItemButton component={Link} to="/blog" onClick={toggleDrawer}>
                <ListItemText primary="BLOGS" />
              </ListItemButton>
            </List>
          </div>
        </Drawer>
      )}

      {children}

      <footer style={{ backgroundColor: '#021732', color: 'white', padding: '20px 0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <div style={{ display: 'flex', justifyContent: 'center', paddingRight: '350px', paddingTop: '50px' }}>
                <img
                  style={{ width: '120px', height: 'auto' }}
                  src="/LogoHeader.jpg"
                  alt="Logo"
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div>
                <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                  About Us
                </Typography>
                <List>
                  <ListItemButton component={Link} to="/about-us-customer" sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                    <ListItemText primary="Our Mission" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/about-us-customer" sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                    <ListItemText primary="Why choose Us" />
                  </ListItemButton>
                  <ListItemButton component={Link} to="/about-us-customer" sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                    <ListItemText primary="Contact Us" />
                  </ListItemButton>
                </List>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div>
                <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                  Contact Information
                </Typography>
                <Typography>Email: example@example.com</Typography>
                <Typography>Phone: (123) 456-7890</Typography>
                <Typography>Address: 123 Street, City, Country</Typography>
              </div>
            </Grid>
          </Grid>
        </Container>
      </footer>
    </div>
  );
};

export default CustomerLayout;
