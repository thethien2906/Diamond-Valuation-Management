import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import axios from 'axios';

const ManagerDashboard = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#212529' }}>
        <Toolbar>
          {/* Menu Icon for Small Screens */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { md: 'none' }, fontSize: '1.5rem' }}
          >
            <MenuIcon sx={{ fontSize: '2rem' }} />
          </IconButton>
          {/* Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Manager Dashboard
          </Typography>
          {/* User Menu */}
          <IconButton
            color="inherit"
            aria-label="user menu"
            onClick={handleMenuOpen}
            edge="end"
            sx={{ display: { md: 'flex' } }}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{ marginTop: '40px' }}
          >
            <MenuItem component={Link} to="/">
              <ListItemIcon>
                <HomeIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
              </ListItemIcon>
              <Typography variant="inherit">Return Home</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: 'error.main', mr: 1 }} />
              </ListItemIcon>
              <Typography variant="inherit">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer for Small Screens (xs and sm) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: 'block', sm: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', bgcolor: '#212529', color: '#fff' },
        }}
      >
        <Toolbar />
        <List>
          <ListItemButton onClick={toggleDrawer} component={Link} to="/manager/dashboard">
            <ListItemIcon>
              <DashboardIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <Typography variant="inherit" sx={{ color: '#fff' }}>Dashboard</Typography>
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer} component={Link} to="/manager/commit-requests">
            <ListItemIcon>
              <HourglassEmptyIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <Typography variant="inherit" sx={{ color: '#fff' }}>Commitment Request</Typography>
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer} component={Link} to="/manager/seal-requests">
            <ListItemIcon>
              <AssignmentIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <Typography variant="inherit" sx={{ color: '#fff' }}>Sealing Request</Typography>
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer} component={Link} to="/manager/services">
            <ListItemIcon>
              <ConfirmationNumberIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <Typography variant="inherit" sx={{ color: '#fff' }}>Service Packages</Typography>
          </ListItemButton>
        </List>
        <Divider sx={{ bgcolor: '#6c757d' }} />
        <Box sx={{ p: 2, mt: 'auto', textAlign: 'center', bgcolor: '#343a40', color: '#717e87' }}>
          <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>
            Logged in as: {user?.name || 'Guest'}
          </Typography>
        </Box>
      </Drawer>

      {/* Permanent Drawer for Medium Screens (md and above) */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box',
            bgcolor: '#212529',
            color: '#fff',
          },
          display: { xs: 'none', md: 'block' }, // Hide drawer on small screens and below
        }}
      >
        <Toolbar />
        <List>
          <ListItemButton component={Link} to="/manager/dashboard">
            <ListItemIcon>
              <DashboardIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <Typography variant="inherit" sx={{ color: '#fff' }}>Dashboard</Typography>
          </ListItemButton>
          <ListItemButton component={Link} to="/manager/commit-requests">
            <ListItemIcon>
              <HourglassEmptyIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <Typography variant="inherit" sx={{ color: '#fff' }}>Commitment Request</Typography>
          </ListItemButton>
          <ListItemButton component={Link} to="/manager/seal-requests">
            <ListItemIcon>
              <AssignmentIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <Typography variant="inherit" sx={{ color: '#fff' }}>Sealing Request</Typography>
          </ListItemButton>
          <ListItemButton component={Link} to="/manager/services">
            <ListItemIcon>
              <ConfirmationNumberIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <Typography variant="inherit" sx={{ color: '#fff' }}>Service Packages</Typography>
          </ListItemButton>
          <ListItemButton component={Link} to="/manager/blogs-manage">
            <ListItemIcon>
              <ConfirmationNumberIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <Typography variant="inherit" sx={{ color: '#fff' }}>Blog</Typography>
          </ListItemButton>
        </List>
        <Box sx={{ p: 2, mt: 'auto', textAlign: 'center', bgcolor: '#343a40', color: '#717e87' }}>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
            Logged in as: {user?.name}
          </Typography>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,

        }}
      >
        <Toolbar />
        <Outlet /> {/* This will render the child routes/components */}
      </Box>
    </Box>
  );
};

export default ManagerDashboard;
