import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GuestLayout = ({ children }) => {
  const [showContainer, setShowContainer] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="home-container" style={{ backgroundColor: '#033F63', position: '', zIndex: 1 }}>
      <div
        style={{
          position: 'fixed',
          top: showContainer ? '0px' : '-80px',
          width: '101%',
          zIndex: 1100,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'top 0.3s',
          backgroundColor: '#FAFAFA', // Light gray similar to Netlify
        }}
      >
        <Container maxWidth="lg" disableGutters style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '11px' }}>
          <div style={{ display: 'flex', gap: '50px' }}>
            <MenuItem component={Link} to="/about-us-guest" style={{ padding: '12px 12px', borderRadius: '10px', marginLeft:'200px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                About Us
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/consulting-services-guest" style={{ padding: '12px 12px', borderRadius: '10px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                Consulting Service
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/valuation-tool" style={{ padding: '12px 12px', borderRadius: '10px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                Valuation Tool
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/blogs" style={{ padding: '12px 12px', borderRadius: '10px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                Blogs
              </Typography>
            </MenuItem>
          </div>
          <IconButton
            color="inherit"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{ ml: 'auto' }}
          >
            <AccountCircleIcon sx={{ color: 'black' }} />
          </IconButton>
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
            <MenuItem component={Link} to="/login" onClick={handleClose}>
              <Typography variant="body2" color="text.primary" sx={{ ml: 1, textAlign: 'center' }}>
                Sign In
              </Typography>
            </MenuItem>
          </Menu>
        </Container>
      </div>
      <Container maxWidth="lg" style={{ marginTop: '68px', marginBottom: '50px', padding: '20px', marginLeft:'69px' }}>
        {children}
      </Container>
    </div>
  );
};

export default GuestLayout;
