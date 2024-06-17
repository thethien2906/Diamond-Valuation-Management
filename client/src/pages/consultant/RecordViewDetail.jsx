import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-hot-toast';

const RecordViewDetail = () => {
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        const response = await axios.get(`/api/valuation-records/${recordId}`);
        setRecord(response.data);
      } catch (error) {
        console.error('Error fetching valuation record data:', error);
        toast.error('Failed to fetch valuation record data');
      } finally {
        setLoading(false);
      }
    };

    fetchRecordData();
  }, [recordId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!record) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Typography variant="h6" component="h2">No record found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Valuation Record Details
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">Record Number: {record.recordNumber}</Typography>
        <Typography variant="body1">Customer Name: {record.customerName}</Typography>
        <Typography variant="body1">Phone Number: {record.phoneNumber}</Typography>
        <Typography variant="body1">Email: {record.email}</Typography>
        <Typography variant="body1">Appointment Date: {new Date(record.appointmentDate).toLocaleDateString()}</Typography>
        <Typography variant="body1">Appointment Time: {record.appointmentTime}</Typography>
        <Typography variant="body1">Services: {record.services}</Typography>
        <Typography variant="body1">Payment Method: {record.paymentMethod}</Typography>
        <Typography variant="body1">Consultant ID: {record.consultantId}</Typography>
        <Typography variant="body1">Appraiser ID: {record.appraiserId || 'Not assigned yet'}</Typography>
        <Typography variant="body1">Shape and Cut: {record.shapeAndCut || 'Not filled yet'}</Typography>
        <Typography variant="body1">Carat Weight: {record.caratWeight || 'Not filled yet'}</Typography>
        <Typography variant="body1">Clarity: {record.clarity || 'Not filled yet'}</Typography>
        <Typography variant="body1">Cut Grade: {record.cutGrade || 'Not filled yet'}</Typography>
        <Typography variant="body1">Measurements: {record.measurements || 'Not filled yet'}</Typography>
        <Typography variant="body1">Polish: {record.polish || 'Not filled yet'}</Typography>
        <Typography variant="body1">Symmetry: {record.symmetry || 'Not filled yet'}</Typography>
        <Typography variant="body1">Fluorescence: {record.fluorescence || 'Not filled yet'}</Typography>
        <Typography variant="body1">Estimated Value: {record.estimatedValue || 'Not filled yet'}</Typography>
        <Typography variant="body1">Valuation Method: {record.valuationMethod || 'Not filled yet'}</Typography>
        <Typography variant="body1">Certificate Number: {record.certificateNumber || 'Not filled yet'}</Typography>
      </Paper>
    </Box>
  );
};

export default RecordViewDetail;
