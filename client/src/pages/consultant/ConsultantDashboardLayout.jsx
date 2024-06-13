import React, { useContext } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import {
  Button,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme,
  MenuItem,
  Divider,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import axios from "axios";

const ConsultantDashboardLayout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const theme = useTheme();

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* Menu Icon for Small Screens */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {/* Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Consultant Home
          </Typography>
          {/* Navigation Links for Medium and Above Screens */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button color="inherit" component={Link} to="/">Return to Home</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Drawer for Small Screens (xs and sm) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: 'block', sm: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={toggleDrawer} component={Link} to="/consultant/appointments">
            <ListItemText primary="View Appointment Calendar" />
          </ListItem>
          <ListItem button onClick={toggleDrawer} component={Link} to="/consultant">
            <ListItemText primary="Pending Requests" />
          </ListItem>
          <Divider />
          <ListItem button onClick={toggleDrawer} component={Link} to="/">
            <ListItemText primary="Return to Home" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
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
          },
          [theme.breakpoints.down('sm')]: {
            display: 'none', // Hide drawer on small screens and below
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/consultant/appointments">
            <ListItemText primary="View Appointment Calendar" />
          </ListItem>
          <ListItem button component={Link} to="/consultant">
            <ListItemText primary="Pending Requests" />
          </ListItem>
          <Divider />
        </List>
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          marginLeft: { md: '240px' },
          marginTop: '64px',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default ConsultantDashboardLayout;
