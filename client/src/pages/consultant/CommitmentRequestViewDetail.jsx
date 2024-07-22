import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Grid
} from '@mui/material';

const CommitmentRequestViewDetail = () => {
  const { commitId } = useParams();
  const [commit, setCommit] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`/api/commit-request/${commitId}`);
        if (response.status === 200) {
          setCommit(response.data);
        } else {
          toast.error('Commitment request not found');
        }
      } catch (error) {
        console.error('Error fetching commitment details:', error);
        toast.error('Failed to fetch commitment details');
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [commitId]);

  const handleUpdateStatus = async () => {
    try {
      const response = await axios.put(`/api/commit-request/${commitId}`, {
        status: 'Pending by Consultant'
      });
      toast.success('Commitment request status updated!');
      navigate('/consultant/commit-requests'); // Redirect after updating
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDenyRequest = async () => {
    try {
      const response = await axios.put(`/api/commit-request/${commitId}/deny`); // Add consultantId if it's needed on the backend

      toast.success('Commitment request denied and deleted successfully');
      navigate('/consultant/commit-requests'); // Redirect after deleting
    } catch (error) {
      console.error('Error denying commitment request:', error);
      toast.error('Failed to deny commitment request');
    }
  };

  const handlePrintReceipt = async () => {
    try {
      // Fetch the record using the recordId from the commitment details
      const recordResponse = await axios.get(`/api/valuation-records/${commit.recordId}`);
      const receiptId = recordResponse.data.receiptId;
      
      // Redirect to the receipt page using the fetched receiptId
      navigate(`/consultant/receipt-print/${receiptId}`);
    } catch (error) {
      console.error('Error fetching receipt details:', error);
      toast.error('Failed to fetch receipt details');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!commit) {
    return <Typography variant="h6">Commitment details not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom textAlign="center">
        Commitment Request Details
      </Typography>
      <Paper sx={{ p: 3, mt: 2, boxShadow: 3, borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
        <Grid container spacing={2} textAlign={'center'}>
          <Grid item xs={12}>
            <Typography variant="body1">Record ID: {commit.recordId}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Customer Name: {commit.customerName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Phone Number: {commit.phoneNumber}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Email: {commit.email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Reason for Loss: {commit.reasonForLoss}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Date Issued: {new Date(commit.dateIssued).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          {commit.status === 'Approved' ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePrintReceipt}
              sx={{ ml: 2 }}
            >
              Print
            </Button>
          ) : commit.status !== 'Rejected' ? (
            <>
              <Button variant="contained" color="primary" onClick={handleUpdateStatus}>
                Submit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDenyRequest}
                sx={{ ml: 2 }}
              >
                Deny
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePrintReceipt}
                sx={{ ml: 2 }}
              >
                Print
              </Button>
            </>
          ) : null}
        </Box>
      </Paper>
    </Box>
  );
};

export default CommitmentRequestViewDetail;
