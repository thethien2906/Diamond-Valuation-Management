import React, { useState } from 'react';
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
  useTheme
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';

const GuestLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerContent = (
    <List>
      <ListItemButton component={Link} to="/" onClick={toggleDrawer}>
        <ListItemText primary="HOME" />
      </ListItemButton>
      <ListItemButton component={Link} to="/about-us-guest" onClick={toggleDrawer}>
        <ListItemText primary="ABOUT US" />
      </ListItemButton>
      <ListItemButton component={Link} to="/consulting-services-guest" onClick={toggleDrawer}>
        <ListItemText primary="CONSULTING SERVICE" />
      </ListItemButton>
      <ListItemButton component={Link} to="/valuation-tool" onClick={toggleDrawer}>
        <ListItemText primary="VALUATION TOOL" />
      </ListItemButton>
      <ListItemButton component={Link} to="/blogs" onClick={toggleDrawer}>
        <ListItemText primary="BLOGS" />
      </ListItemButton>
    </List>
  );

  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <div className="home-container" style={{ position: 'relative', zIndex: 1, backgroundColor: '#e5e4e2' }}>
      {/* Navigation Bar */}
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
          {/* Logo on the left */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-start', padding: '10px' }}>
            <img
              style={{ width: '80px', height: 'auto' }}
              src='/LogoHeader.jpg'
              alt='Logo'
            />
          </div>

          {/* Navigation items in the middle */}
          {isMdUp && (
            <div style={{ flex: '2', display: 'flex', justifyContent: 'center', gap: '50px' }}>
              <MenuItem component={Link} to="/" sx={{ padding: '12px 12px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '14px' }}>
                  HOME
                </Typography>
              </MenuItem>
              <MenuItem component={Link} to="/about-us-guest" sx={{ padding: '12px 12px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '14px' }}>
                  ABOUT US
                </Typography>
              </MenuItem>
              <MenuItem component={Link} to="/consulting-services-guest" sx={{ padding: '12px 12px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '14px' }}>
                  CONSULTING SERVICE
                </Typography>
              </MenuItem>
              <MenuItem component={Link} to="/valuation-tool" sx={{ padding: '12px 12px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '14px' }}>
                  VALUATION TOOL
                </Typography>
              </MenuItem>
              <MenuItem component={Link} to="/blogs" sx={{ padding: '12px 12px', color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '14px' }}>
                  BLOGS
                </Typography>
              </MenuItem>
            </div>
          )}

          {/* Sign In and Shopping Cart on the right */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px',marginRight:'50px' }} onClick={handleSignIn}>
            <Typography variant="h6" sx={{ fontSize: '14px', color: 'white', cursor: 'pointer' }}>
              Sign In
            </Typography>
          </div>

          {/* Drawer toggle button */}
          {!isMdUp && (
            <IconButton
              edge="end"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for medium screens and above */}
      {!isMdUp && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{ '& .MuiDrawer-paper': { width: '250px' } }}
        >
          <div onClick={toggleDrawer} onKeyDown={toggleDrawer}>
            {drawerContent}
          </div>
        </Drawer>
      )}


        {children}

      {/* Footer */}
      <footer style={{ backgroundColor: '#021732', color: 'white', padding: '20px 0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <div style={{ display: 'flex', justifyContent: 'center', paddingRight: '350px',paddingTop:'50px' }}>
                <img
                  style={{ width: '120px', height: 'auto' }}
                  src='/LogoHeader.jpg'
                  alt='Logo'
                />
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div>
              <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                About Us
              </Typography>
              <List>
                <ListItemButton component={Link} to="/about-us-guest" sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                  <ListItemText primary="Our Mission" />
                </ListItemButton>
                <ListItemButton component={Link} to="/about-us-guest" sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                  <ListItemText primary="Why choose Us" />
                </ListItemButton>
                <ListItemButton component={Link} to="/consulting-services-guest" sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
                  <ListItemText primary="Service" />
                </ListItemButton>
              </List>
              </div>     
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                Contact Us
              </Typography>
              <Typography variant="body2">
                Hotline: +64 (073) 432-190
              </Typography>
              <Typography variant="body2">
                Email: TheThien1234@gmail.com
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" align="center" gutterBottom sx={{ marginTop: '20px' }}>
            © 2024 Diamond Appraisals. All rights reserved.
          </Typography>
        </Container>
      </footer>
    </div>
  );
};

export default GuestLayout;
