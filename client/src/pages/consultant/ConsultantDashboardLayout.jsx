import React, { useContext, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItemText,
  IconButton,
  useTheme,
  Divider,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditOffIcon from '@mui/icons-material/EditOff';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import axios from "axios";

const ConsultantDashboardLayout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const theme = useTheme();

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

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor:'#212529' }}>
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
            Consultant Home
          </Typography>
          {/* User Menu for Small Screens */}
          <IconButton
            color="inherit"
            aria-label="user menu"
            onClick={handleMenuOpen}
            edge="end"
            sx={{ display: { md: 'none' } }}
          >
            <AccountCircleIcon />
          </IconButton>
          {/* User Menu for Medium and Above Screens */}
          <IconButton
            color="inherit"
            aria-label="user menu"
            onClick={handleMenuOpen}
            edge="end"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            <AccountCircleIcon />
          </IconButton>
          {/* User Menu */}
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
            sx={{marginTop: '40px'}}
          >
            <MenuItem component={Link} to="/">
              <ListItemIcon>
                <HomeIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
              </ListItemIcon>
              <Typography variant="inherit">Return to Home</Typography>
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
        <List sx={{gap: 5}}>
          <ListItemButton onClick={toggleDrawer} component={Link} to="/consultant/appointments">
            <ListItemIcon>
              <CalendarTodayIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="View Appointment Calendar" />
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer} component={Link} to="/consultant">
            <ListItemIcon>
              <PendingActionsIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Pending Requests" />
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer} component={Link} to="/consultant/valuation-records">
            <ListItemIcon>
              <TrackChangesIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Record Tracking" />
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer} component={Link} to="/consultant/commit-requests">
            <ListItemIcon>
              <EditOffIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Commitment Requests" />
          </ListItemButton>
          <ListItemButton onClick={toggleDrawer} component={Link} to="/consultant/seal-status">
            <ListItemIcon>
              <MoreHorizIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Seal Status" />
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
            color: '#fff'
          },
          [theme.breakpoints.down('md')]: {
            display: 'none', // Hide drawer on small screens and below
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItemButton component={Link} to="/consultant/appointments">
            <ListItemIcon>
              <CalendarTodayIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="View Appointment Calendar" />
          </ListItemButton>
          <ListItemButton component={Link} to="/consultant">
            <ListItemIcon>
              <PendingActionsIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Pending Requests" />
          </ListItemButton>
          <ListItemButton component={Link} to="/consultant/valuation-records">
            <ListItemIcon>
              <TrackChangesIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Record Tracking" />
          </ListItemButton>
          <ListItemButton component={Link} to="/consultant/commit-requests">
            <ListItemIcon>
              <EditOffIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Commitment Requests" />
          </ListItemButton>
          <ListItemButton component={Link} to="/consultant/seal-status">
            <ListItemIcon>
              <MoreHorizIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Seal Status" />
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
          maxWidth: 1000,
          marginLeft:20,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );

};

export default ConsultantDashboardLayout;
