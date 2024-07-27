import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TablePagination,
  TextField,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';
import CustomerLayout from '../../components/CustomerLayout';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    if (!user) {
      toast.error('User not logged in');
      return;
    }
    try {
      const response = await axios.get(`/api/bookings-customer/${user._id}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredBookings = bookings.filter((booking) =>
    booking.serviceId.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, marginTop: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <CustomerLayout>
      <Box sx={{ p: 3, marginTop: '100px', minHeight: '50vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Bookings
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Search by Service Name"
              variant="outlined"
              value={search}
              onChange={handleSearchChange}
              size="small"
              sx={{ mr: 2 }}
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>
        {filteredBookings.length === 0 ? (
          <Typography variant="h6" component="p" sx={{ textAlign: 'center', mt: 4 }}>
            No bookings found
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking, index) => (
                    <TableRow key={booking._id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{booking.serviceId.name}</TableCell>
                      <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.time}</TableCell>
                      <TableCell>{booking.status}</TableCell>
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
              labelRowsPerPage="Bookings per page"
            />
          </TableContainer>
        )}
      </Box>
    </CustomerLayout>
  );
};

export default BookingHistory;
