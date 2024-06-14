// Client/src/components/CustomerLayout.jsx
import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
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
    <div className="home-container">
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
                flexGrow: 1, // Allows this box to grow and take up available space
              }}
            >
              <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 2 }}>
                <MenuItem component={Link} to="/about-us-customer" sx={{ py: '6px', px: '12px', borderRadius: '30px' }}>
                  <Typography variant="body2" color="text.primary">
                    ABOUT US
                  </Typography>
                </MenuItem>
                <MenuItem component={Link} to="/consulting-services-customer" sx={{ py: '6px', px: '12px', borderRadius: '30px' }}>
                  <Typography variant="body2" color="text.primary">
                    CONSULTING SERVICES
                  </Typography>
                </MenuItem>
                <MenuItem component={Link} to="/valuation-tool" sx={{ py: '6px', px: '12px', borderRadius: '30px' }}>
                  <Typography variant="body2" color="text.primary">
                    VALUATION TOOL
                  </Typography>
                </MenuItem>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
                borderRadius: '30px',
              }}
            >
              <Button
                color="primary"
                variant="text"
                size="small"
                onClick={handleLogout}
              >
                SIGN OUT
              </Button>
            </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <IconButton
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <MenuItem component={Link} to="/about-us-customer">
                    ABOUT US
                  </MenuItem>
                  <MenuItem component={Link} to="/consulting-services-customer">
                    CONSULTING SERVICES
                  </MenuItem>
                  <MenuItem component={Link} to="/valuation-tool">
                    VALUATION TOOL
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    SIGN OUT
                  </MenuItem>
                  <Divider />
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: '80px', // Adjust this value based on the height of the AppBar
          padding: '20px',
        }}
      >
        {children}
      </Container>
    </div>
  );
};

export default CustomerLayout;
