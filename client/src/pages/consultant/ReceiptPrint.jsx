import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Grid,
} from '@mui/material';
import { toast } from 'react-hot-toast';

const ReceiptPrint = () => {
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [service, setService] = useState(null);
  const [creatingRecord, setCreatingRecord] = useState(false);
  const navigate = useNavigate();
  const componentRef = useRef();

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const response = await axios.get(`/api/receipts/${receiptId}`);
        const consultantResponse = await axios.get(`/api/users/${response.data.consultantId}`);

        setReceipt({ ...response.data, consultant: consultantResponse.data.name });

        if (response.data.serviceId) {
          const serviceResponse = await axios.get(`/api/services/${response.data.serviceId}`);
          setService(serviceResponse.data);
        }
      } catch (error) {
        console.error('Error fetching receipt data:', error);
        toast.error("Failed to fetch receipt data");
      }
    };

    fetchReceiptData();
  }, [receiptId]);

  

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!receipt || !service) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom textAlign="center">
        Receipt Details
      </Typography>
      <div ref={componentRef}>
        <Paper sx={{ p: 3, mt: 2, boxShadow: 3, borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">Receipt Number: {receipt.receiptNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Issue Date: {new Date(receipt.issueDate).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Customer Name: {receipt.customerName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Phone: {receipt.phone}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Email: {receipt.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Appointment Date: {new Date(receipt.appointmentDate).toLocaleDateString()}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Appointment Time: {receipt.appointmentTime}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Consultant name: {receipt.consultant}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Service: {service.name}</Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print Receipt
        </Button>
        
      </Box>
        </Paper>
      </div>

    </Box>
  );
};

export default ReceiptPrint;
