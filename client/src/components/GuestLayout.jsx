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
  useMediaQuery,
  useTheme
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';

const GuestLayout = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    <div className="home-container" style={{ position: 'relative', zIndex: 1 }}>
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
          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-start',padding:'10px' }}>
            <img
              style={{ width: '80px', height: 'auto' }}
              src='LogoHeader.jpg'
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
          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px'}} onClick={handleSignIn}>
            <Typography variant="h6" sx={{ fontSize: '14px', color: 'white', cursor: 'pointer' }}>
              Sign In
            </Typography>
            <IconButton style={{ color: 'white' }}>
              <ShoppingCartIcon />
            </IconButton>
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
      
      <Container maxWidth="lg" style={{ marginTop: '100px', marginBottom: '0px', padding: '20px' }}>
        {children}
      </Container>
    </div>
  );
};

export default GuestLayout;
