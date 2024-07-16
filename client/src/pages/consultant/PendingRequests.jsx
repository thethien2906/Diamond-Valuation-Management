import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import {
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { toast } from 'react-hot-toast';

const PendingRequests = () => {
  const { user } = useContext(UserContext);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const navigate = useNavigate();

  const fetchPendingBookings = async () => {
    try {
      const response = await axios.get(
        `/api/consultants/${user._id}/pending-bookings`
      );
      setPendingBookings(response.data);
    } catch (error) {
      console.error("Error fetching booking requests:", error);
      toast.error('Failed to fetch pending bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const handleViewBooking = (bookingId) => {
    navigate(`/consultant/requests/${bookingId}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchPendingBookings();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Pending Requests
        </Typography>
        <Button
          onClick={handleRefresh}
          variant="contained"
          startIcon={<RefreshIcon />}
          sx={{ 
            backgroundColor: '#424242',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333333',
            },
          }}
        >
          Refresh
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? pendingBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : pendingBookings
            ).map((booking, index) => (
              <TableRow key={booking._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{booking.name}</TableCell>
                <TableCell>{booking.phoneNumber}</TableCell>
                <TableCell>
                  <IconButton
                    color="black"
                    component={Link}
                    to={`/consultant/requests/${booking._id}`}
                  >
                    <RemoveRedEyeIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={pendingBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Requests per page"
        />
      </TableContainer>
    </Box>
  );
};

export default PendingRequests;
