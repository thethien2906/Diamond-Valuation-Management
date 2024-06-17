import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import {
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
  AppBar,
  CircularProgress,
  useTheme, // Import useTheme hook
} from "@mui/material";

const AppointmentCalendar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const theme = useTheme(); // Use the theme hook

  
  const fetchApprovedBookings = async () => {
    try {
      const response = await axios.get(
        `/api/consultants/${user._id}/appointments`
      );
      setApprovedBookings(response.data);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleRefresh = () => {
    fetchApprovedBookings();
  };
  useEffect(() => {
    fetchApprovedBookings();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          [theme.breakpoints.down('md')]: {
            p: 1, // Reduce padding on smaller screens
          },
        }}
      >
        <Typography variant="h6" component="div">
          Approved Appointments
        </Typography>
        {!showTable && (
          <Button onClick={handleRefresh} variant="contained" sx={{ mt: 2 }}>
            Refresh
          </Button>
        )}
        {showTable && (
          <Box sx={{ mt: 2 }}>
            {approvedBookings.length === 0 ? (
              <Typography variant="body1">No approved appointments.</Typography>
            ) : (
              <>
                <Button onClick={handleRefresh} variant="contained" sx={{ mb: 2 }}>
                  Refresh
                </Button>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Request ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {approvedBookings.map((booking, index) => (
                        <TableRow key={booking._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{booking._id}</TableCell>
                          <TableCell>{booking.name}</TableCell>
                          <TableCell>{booking.phoneNumber}</TableCell>
                          <TableCell>
                            {/* <Button
                              component={Link}
                              to={`/consultant/requestView/${booking._id}`}
                              variant="contained"
                              color="primary"
                            >
                              View Detail
                            </Button> */}
                            
                            <Button
                              component={Link}
                              to={`/consultant/appointments/${booking._id}`}
                              variant="contained"
                              color="primary"
                            >
                              View Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentCalendar;
