import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Grid,
  TextField,
} from '@mui/material';
import { toast } from 'react-hot-toast';

const GenerateReceiptForm = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [service, setService] = useState(null);
  const [carat, setCarat] = useState('');
  const [measurement, setMeasurement] = useState('');
  const [receiptGenerated, setReceiptGenerated] = useState(false); // State to track if receipt has been generated
  const [errors, setErrors] = useState({ carat: false, measurement: false }); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(`/api/bookings/${bookingId}`, {
          params: { populate: 'consultantId serviceId' }
        });
        setBooking(response.data);

        if (response.data.serviceId) {
          const serviceResponse = await axios.get(`/api/services/${response.data.serviceId}`);
          setService(serviceResponse.data);
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
        toast.error("Failed to fetch booking data");
      }
    };

    fetchBookingData();
  }, [bookingId]);

  const validateMeasurement = (measurement) => {
    // Regex to match numberxnumberxnumber format
    const measurementRegex = /^\d+x\d+x\d+$/;
    return measurementRegex.test(measurement);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    let errors = { carat: false, measurement: false };

    if (!carat) {
      errors.carat = true;
      valid = false;
    }
    if (!measurement || !validateMeasurement(measurement)) {
      errors.measurement = true;
      valid = false;
    }

    setErrors(errors);

    if (valid) {
      try {
        const response = await axios.post(`/api/generate-receipt/${bookingId}`, {
          carat,
          measurement,
        });
        toast.success('Receipt generated successfully');
        navigate(`/consultant/receipts/${response.data._id}`);
        setReceiptGenerated(true); // Mark receipt as generated
      } catch (error) {
        console.error('Error generating receipt:', error);
        toast.error('Failed to generate receipt');
      }
    }
  };

  if (!booking || !service) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Generate Receipt
      </Typography>
      <Paper sx={{ p: 3, mt: 2, boxShadow: 3, borderRadius: 2, maxWidth: 600 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">Customer Name: {booking.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Phone: {booking.phoneNumber}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Email: {booking.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Appointment Date: {booking.date}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Appointment Time: {booking.time}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Consultant Name: {booking?.consultantId?.name || "Consultant Name Not Found"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Service: {service.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Carat"
              variant="outlined"
              value={carat}
              onChange={(e) => setCarat(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={errors.carat}
              helperText={errors.carat ? "Please input Carat" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Measurement (e.g., 3x4x5)"
              variant="outlined"
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={errors.measurement}
              helperText={errors.measurement ? "Please input Measurement in format numberxnumberxnumber" : ""}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={receiptGenerated} // Disable button if receipt is generated
          >
            {receiptGenerated ? 'Receipt Generated' : 'Generate Receipt'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default GenerateReceiptForm;
