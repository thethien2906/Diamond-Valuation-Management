import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const GuestLayout = ({ children }) => {
  const [showContainer, setShowContainer] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollTop > lastScrollTop) {
        setShowContainer(false); // Scrolling down
      } else {
        setShowContainer(true); // Scrolling up
      }
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);

  return (
    <div className="home-container" style={{ backgroundColor: '#033F63', position: '', zIndex: 1 }}>
      <div
        style={{
          position: 'fixed',
          top: showContainer ? '0px' : '-80px',
          width: '100%',
          zIndex: 1100,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'top 0.3s',
          backgroundColor: '#FAFAFA', // Light gray similar to Netlify
          
        }}
      >
        <Container maxWidth="lg" disableGutters style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '11px' }}>
          <div style={{ display: 'flex', gap: '50px' }}>
            <MenuItem component={Link} to="/about-us-guest" style={{ padding: '12px 12px', borderRadius: '10px' }}>
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
          </div>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            style={{
              padding: '8px 24px',
              borderRadius: '4px',
              backgroundColor: '#033F63',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              textTransform: 'none',
            }}
          >
            <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
              Sign In
            </Typography>
          </Button>
        </Container>
      </div>
      <Container maxWidth="lg" style={{ marginTop: '70px', marginBottom: '50px' }}>{children}</Container>
    </div>
  );
};

export default GuestLayout;
