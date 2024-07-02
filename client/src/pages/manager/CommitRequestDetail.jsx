import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { toast } from 'react-hot-toast';

const ManagerCommitRequestDetail = () => {
  const { commitId } = useParams();
  const [commitRequest, setCommitRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommitRequest = async () => {
      try {
        const response = await axios.get(`/api/commit-request/${commitId}`);
        setCommitRequest(response.data);
      } catch (error) {
        console.error('Error fetching commitment request:', error);
        toast.error('Failed to fetch commitment request');
      } finally {
        setLoading(false);
      }
    };

    fetchCommitRequest();
  }, [commitId]);

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.put(`/api/commit-request-manager/${commitId}`, { status });
      toast.success(response.data.message);
      navigate('/manager/commit-requests');
    } catch (error) {
      console.error('Error updating commitment request status:', error);
      toast.error('Failed to update commitment request status');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!commitRequest) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Typography variant="h6">Commitment request not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Paper sx={{ width: '100%', maxWidth: 600, p: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Commitment Request Detail
        </Typography>
        <Typography variant="body1" textAlign="center">Record Id: {commitRequest.recordId}</Typography>
        <Typography variant="body1" textAlign="center">Customer Name: {commitRequest.customerName}</Typography>
        <Typography variant="body1" textAlign="center">Phone Number: {commitRequest.phoneNumber}</Typography>
        <Typography variant="body1" textAlign="center">Email: {commitRequest.email}</Typography>
        <Typography variant="body1" textAlign="center">Reason for Loss: {commitRequest.reasonForLoss}</Typography>
        <Typography variant="body1" textAlign="center">Date Issued: {new Date(commitRequest.dateIssued).toLocaleDateString()}</Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleStatusChange('Approved')}
          >
            Approve
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => handleStatusChange('Rejected')}
            sx={{ ml: 2 }}
          >
            Deny
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ManagerCommitRequestDetail;
