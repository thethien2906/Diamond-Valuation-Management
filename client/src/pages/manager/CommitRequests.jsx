import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, IconButton } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
        <Typography variant="h4">No commitment requests found</Typography>
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
          <TableHead sx={{ backgroundColor: '#212529' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Record ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Customer Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Date Issued</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
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
                  <IconButton 
                    color="black" 
                    onClick={() => handleViewDetail(request._id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
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
