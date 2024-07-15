import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const GuestLayout = ({ children }) => {
  const [showContainer, setShowContainer] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="home-container" style={{ position: 'relative', zIndex: 1 }}>
      {/* Notification Bar */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'white',
          color: 'black',
          textAlign: 'center',
          padding: '5px 0', // Smaller padding
          position: 'fixed',
          top: '0px',
          zIndex: 1200,
          fontSize: '12px', // Smaller font size
        }}
      >
        <Typography variant="body2" style={{ style:'bold', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
          Notification: New customers who use our service have a high chance to become honor members!
        </Typography>
      </div>

      {/* Navigation Bar */}
      <div
        style={{
          position: 'fixed',
          top: showContainer ? '30px' : '-80px', // Adjusted top position
          width: '100%',
          zIndex: 1100,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'top 0.3s',
          backgroundColor: '#021732',
        }}
      >
        <Container maxWidth="lg" disableGutters style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
          {/* Logo on the left */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-start' }}>
            <img
              style={{ width: '90px', height: 'auto' }}
              src='LogoHeader.jpg'
              alt='Logo'
            />
          </div>

          {/* Navigation items in the middle */}
          <div style={{ flex: '2', display: 'flex', justifyContent: 'center', gap: '50px' }}>
            <MenuItem component={Link} to="/" style={{ padding: '12px 12px'}}>
              <Typography variant="h6" style={{ fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', color: 'white' }}>
                HOME
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/about-us-guest" style={{ padding: '12px 12px'}}>
              <Typography variant="h6" style={{ fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', color: 'white' }}>
                ABOUT US
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/consulting-services-guest" style={{ padding: '12px 12px'}}>
              <Typography variant="h6" style={{ fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', color: 'white' }}>
                CONSULTING SERVICE
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/valuation-tool" style={{ padding: '12px 12px'}}>
              <Typography variant="h6" style={{ fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', color: 'white' }}>
                VALUATION TOOL
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/blogs" style={{ padding: '12px 12px'}}>
              <Typography variant="h6" style={{ fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', color: 'white' }}>
                BLOGS
              </Typography>
            </MenuItem>
          </div>

          {/* Sign In and Shopping Cart on the right */}
          <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px'}} onClick={handleSignIn}>
            <Typography variant="h6" style={{ fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', color: 'white', cursor: 'pointer' }}>
              Sign In
            </Typography>
            <IconButton style={{ color: 'white' }}>
              <ShoppingCartIcon />
            </IconButton>
          </div>
        </Container>
      </div>
      
      <Container maxWidth="lg" style={{ marginTop: '100px', marginBottom: '0px', padding: '20px' }}>
        {children}
      </Container>
    </div>
  );
};

export default GuestLayout;
