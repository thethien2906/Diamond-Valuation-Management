import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ManagerCommitRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/commit-requests-pending-by-consultant');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching commitment requests:', error);
        toast.error('Failed to fetch commitment requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleViewDetail = (commitId) => {
    navigate(`/manager/commit-requests/${commitId}`);
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
        Commitment Requests (Pending by Consultant)
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

export default ManagerCommitRequests;
