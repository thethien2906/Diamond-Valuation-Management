import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("user");
      navigate("/"); // Redirect to the homepage or any other desired page
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout errors here if needed
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="home-container" style={{ backgroundColor: '#033F63', position: '', zIndex: 1 }}>
      <div
        style={{
          position: 'fixed',
          top: '0px',
          width: '100%',
          zIndex: 1100,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#FAFAFA', // Light gray similar to Netlify
          transition: 'top 0.3s',
        }}
      >
        <Container maxWidth="lg" disableGutters style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '11px' }}>
          <div style={{ display: 'flex', gap: '50px' }}>
            <MenuItem component={Link} to="/about-us-customer" style={{ padding: '12px 12px', borderRadius: '10px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                ABOUT US
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/consulting-services-customer" style={{ padding: '12px 12px', borderRadius: '10px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                CONSULTING SERVICES
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/valuation-tool" style={{ padding: '12px 12px', borderRadius: '10px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                VALUATION TOOL
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/blog" style={{ padding: '12px 12px', borderRadius: '10px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                BLOGS
              </Typography>
            </MenuItem>
            <MenuItem component={Link} to="/record-tracking" style={{ padding: '12px 12px', borderRadius: '10px' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '14px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                RECORD TRACKING
              </Typography>
            </MenuItem>
          </div>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', borderRadius: '30px' }}>
            <IconButton
              color="inherit"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
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
              sx={{ marginTop: '40px' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Typography variant="body2" color="text.primary" sx={{ ml: 1, textAlign: 'center' }}>
                {user?.name}
              </Typography>
              <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
            </Menu>
          </Box>       
        </Container>
      </div>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: '68px', // Adjust this value based on the height of the AppBar
          padding: '20px',
        }}
      >
        {children}
      </Container>
    </div>
  );
};

export default CustomerLayout;
