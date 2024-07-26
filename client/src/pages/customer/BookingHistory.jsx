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
  Button
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Bookings
          </Typography>
        </Box>
        {bookings.length === 0 ? (
          <Typography variant="h6" component="p" sx={{ textAlign: 'center', mt: 4 }}>
            No bookings found
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  {/* <TableCell>Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking._id}</TableCell>
                    <TableCell>{booking.serviceId.name}</TableCell>
                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    {/* <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBookingDetail(booking._id)}
                      >
                        View Details
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </CustomerLayout>
  );
};

export default BookingHistory;
