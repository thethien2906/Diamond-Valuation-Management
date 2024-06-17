// Client/src/pages/consultant/PendingRequests.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
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
} from "@mui/material";

const PendingRequests = () => {
  const { user } = useContext(UserContext);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [showTable, setShowTable] = useState(false);

  
  const fetchPendingBookings = async () => {
    try {
      // Fetch using user._id (MongoDB ObjectId)
      const response = await axios.get(
        `/api/consultants/${user._id}/pending-bookings`
      );
      setPendingBookings(response.data);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching booking requests:", error);
    }
  };

  const handleRefresh = () => {
    fetchPendingBookings();
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  return (
    <Box>
      <Typography variant="h6" component="div">
        Pending Requests
      </Typography>
      {!showTable && (
        <Button onClick={handleRefresh} variant="contained" sx={{ mt: 2 }}>
          Refresh
        </Button>
      )}
      {showTable && (
        <Box sx={{ mt: 2 }}>
          {pendingBookings.length === 0 ? (
            <Typography variant="body1">No pending requests.</Typography>
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
                    {pendingBookings.map((booking, index) => (
                      <TableRow key={booking._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{booking._id}</TableCell>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>{booking.phoneNumber}</TableCell>
                        <TableCell>
                          <Button
                            component={Link}
                            to={`/consultant/requests/${booking._id}`}
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
  );
};

export default PendingRequests;
