import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

const CommitmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) {
        toast.error('User not logged in');
        return;
      }

      try {
        // Fetch requests for the consultant's ID
        const response = await axios.get(`/api/commit-requests/${user._id}`); 
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching commitment requests:', error);
        toast.error('Failed to fetch commitment requests');
      } finally {
        setLoading(false);
      }
    };
    // Only fetch if user exists
    if (user && user._id) {
      fetchRequests();
    }
  }, [user]); 

  const handleViewDetail = (commitId) => {
    navigate(`/consultant/commit-requests/${commitId}`);
  };

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
        <Typography variant="h6">No commitment requests found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Commitment Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Record ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Issued</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request.recordId}</TableCell>
                <TableCell>{request.customerName}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>{new Date(request.dateIssued).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleViewDetail(request._id)}
                  >
                    View Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CommitmentRequests;
