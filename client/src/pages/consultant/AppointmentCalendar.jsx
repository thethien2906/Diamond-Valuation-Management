import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
  CircularProgress,
  IconButton,
  TablePagination,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const AppointmentCalendar = () => {
  const { user } = useContext(UserContext);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const fetchApprovedBookings = async () => {
    try {
      const response = await axios.get(`/api/consultants/${user._id}/appointments`);
      setApprovedBookings(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (bookingId) => {
    navigate(`/consultant/appointments/${bookingId}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchApprovedBookings();
  };

  useEffect(() => {
    fetchApprovedBookings();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const filteredBookings = approvedBookings.filter((booking) => {
    const matchesName = booking.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || booking.status === statusFilter;
    return matchesName && matchesStatus;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" component="div">
          Approved Appointments
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mr: 2 }}
        />
        
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : filteredBookings.length === 0 ? (
        <Typography variant="h6" align="center">
          There are no appointments.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking, index) => (
                  <TableRow key={booking._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{booking.name}</TableCell>
                    <TableCell>{booking.phoneNumber}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>
                      <IconButton
                        color="black"
                        onClick={() => handleViewBooking(booking._id)}
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
            count={filteredBookings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default AppointmentCalendar;
