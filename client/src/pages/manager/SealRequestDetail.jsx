import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { toast } from 'react-hot-toast';

const ManagerSealRequestDetail = () => {
  const { sealId } = useParams();
  const [sealRequest, setSealRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSealRequest = async () => {
      try {
        const response = await axios.get(`/api/seal-requests/${sealId}`);
        setSealRequest(response.data);
      } catch (error) {
        console.error('Error fetching seal request:', error);
        toast.error('Failed to fetch seal request');
      } finally {
        setLoading(false);
      }
    };

    fetchSealRequest();
  }, [sealId]);

  const handleStatusChange = async (status) => {
    try {
      const response = await axios.put(`/api/seal-request/${sealId}`, { status });
      toast.success(response.data.message);
      navigate('/manager/seal-requests');
    } catch (error) {
      console.error('Error updating seal request status:', error);
      toast.error('Failed to update seal request status');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!sealRequest) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Typography variant="h6">Seal request not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Seal Request Detail
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">Record Id: {sealRequest.recordId.recordNumber}</Typography>
        <Typography variant="body1">Customer Name: {sealRequest.customerName}</Typography>
        <Typography variant="body1">Reason: {sealRequest.reason}</Typography>
        <Typography variant="body1">Notes: {sealRequest.notes}</Typography>
        <Typography variant="body1">Consultant: {sealRequest.consultantId.name}</Typography>
        <Typography variant="body1">Date Issued: {new Date(sealRequest.createdAt).toLocaleDateString()}</Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
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
          >
            Deny
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ManagerSealRequestDetail;
