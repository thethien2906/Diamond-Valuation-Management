import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print'; 

import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-hot-toast';

const ReceiptDetail = () => {
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const response = await axios.get(`/api/receipts/${receiptId}`);
        setReceipt(response.data);
      } catch (error) {
        console.error('Error fetching receipt data:', error);
        toast.error("Failed to fetch receipt data");
      }
    };

    fetchReceiptData();
  }, [receiptId]);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (!receipt) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!receipt) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Receipt Details
      </Typography>
      <div ref={componentRef}>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">Receipt Number: {receipt.receiptNumber}</Typography>
        <Typography variant="body1">Issue Date: {new Date(receipt.issueDate).toLocaleString()}</Typography>
        <Typography variant="body1">Customer Name: {receipt.customerName}</Typography>
        <Typography variant="body1">Phone: {receipt.phone}</Typography>
        <Typography variant="body1">Email: {receipt.email}</Typography>
        <Typography variant="body1">Appointment Date: {new Date(receipt.appointmentDate).toLocaleDateString()}</Typography>
        <Typography variant="body1">Appointment Time: {receipt.appointmentTime}</Typography>
        <Typography variant="body1">Services: {receipt.services}</Typography>
        <Typography variant="body1">Payment Method: {receipt.paymentMethod}</Typography>
        <Typography variant="body1">Amount Paid: ${receipt.amountPaid.toFixed(2)}</Typography>
        
      </Paper>
      
      </div>
      <Box sx={{ mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print Receipt
          </Button>
        </Box>
    </Box>
  );
};

export default ReceiptDetail;
