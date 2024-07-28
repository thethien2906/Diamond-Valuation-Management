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
} from '@mui/material';
import { toast } from 'react-hot-toast';

const ReceiptDetail = () => {
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

  const handleCreateRecord = async () => {
    setCreatingRecord(true);
    try {
      const response = await axios.post(`/api/valuation-records/${receiptId}`);
      toast.success('Valuation record created successfully');
      navigate(`/consultant/valuation-records`);
    } catch (error) {
      console.error('Error creating valuation record:', error);
      toast.error('Failed to create valuation record');
    } finally {
      setCreatingRecord(false);
    }
  };

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
        <Paper sx={{ p: 3, mt: 2, boxShadow: 3, borderRadius: 2, maxWidth: 500, mx: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body1">Receipt Number: {receipt.receiptNumber}</Typography>
            <Typography variant="body1">Issue Date: {new Date(receipt.issueDate).toLocaleString()}</Typography>
            <Typography variant="body1">Customer Name: {receipt.customerName}</Typography>
            <Typography variant="body1">Phone: {receipt.phone}</Typography>
            <Typography variant="body1">Email: {receipt.email}</Typography>
            <Typography variant="body1">Appointment Date: {new Date(receipt.appointmentDate).toLocaleDateString()}</Typography>
            <Typography variant="body1">Appointment Time: {receipt.appointmentTime}</Typography>
            <Typography variant="body1">Consultant Name: {receipt.consultant}</Typography>
            <Typography variant="body1">Service: {service.name}</Typography>
            <Typography variant="body1">Carat: {receipt.diamondCarat}</Typography>
            <Typography variant="body1">Measurements: {receipt.diamondMeasurements}</Typography>
          </Box>
        </Paper>
      </div>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print Receipt
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCreateRecord}
          sx={{ ml: 2 }}
          disabled={creatingRecord}
        >
          {creatingRecord ? 'Creating Record...' : 'Create Record'}
        </Button>
      </Box>
    </Box>
  );
};

export default ReceiptDetail;
