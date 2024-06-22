import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';

const ConsulatantSealStatus = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
        if (!user) {
          toast.error('User not logged in');
          return;
        }
  
        try {
          // Fetch requests for the consultant's ID
          const response = await axios.get(`/api/seal-requests/${user._id}/status`); 
          setRequests(response.data);
        } catch (error) {
          console.error('Error fetching sealing:', error);
          toast.error('Failed to fetch sealing');
        } finally {
          setLoading(false);
        }
      };
      // Only fetch if user exists
      if (user && user._id) {
        fetchRequests();
      }
    }, [user]); 

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (requests.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Typography variant="h6">No sealing requests found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        My Sealing Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Record ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Issued</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request.recordId.recordNumber}</TableCell>
                <TableCell>{request.customerName}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ConsulatantSealStatus;
