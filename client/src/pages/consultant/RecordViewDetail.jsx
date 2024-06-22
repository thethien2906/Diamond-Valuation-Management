import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-hot-toast';

const RecordViewDetail = () => {
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleSeal = () => {
    navigate(`/consultant/record-sealing/${recordId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!record) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" component="h2">No record found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Valuation Record Details
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="record-content"
          id="record-header"
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="body1">Record Number: {record.recordNumber}</Typography>
            <Typography variant="body1">Customer Name: {record.customerName}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="customer-content"
              id="customer-header"
            >
              <Typography variant="subtitle1">Customer Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2">Phone Number: {record.phoneNumber}</Typography>
                <Typography variant="body2">Email: {record.email}</Typography>
                <Typography variant="body2">Appointment Date: {new Date(record.appointmentDate).toLocaleDateString()}</Typography>
                <Typography variant="body2">Appointment Time: {record.appointmentTime}</Typography>
                <Typography variant="body2">Services: {record.services}</Typography>
                <Typography variant="body2">Payment Method: {record.paymentMethod}</Typography>
                <Typography variant="body2">Consultant ID: {record.consultantId}</Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="diamond-content"
              id="diamond-header"
            >
              <Typography variant="subtitle1">Diamond Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2">Appraiser ID: {record.appraiserId || 'Not assigned yet'}</Typography>
                <Typography variant="body2">Shape and Cut: {record.shapeAndCut || 'Not filled yet'}</Typography>
                <Typography variant="body2">Carat Weight: {record.caratWeight || 'Not filled yet'}</Typography>
                <Typography variant="body2">Clarity: {record.clarity || 'Not filled yet'}</Typography>
                <Typography variant="body2">Cut Grade: {record.cutGrade || 'Not filled yet'}</Typography>
                <Typography variant="body2">Measurements: {record.measurements || 'Not filled yet'}</Typography>
                <Typography variant="body2">Polish: {record.polish || 'Not filled yet'}</Typography>
                <Typography variant="body2">Symmetry: {record.symmetry || 'Not filled yet'}</Typography>
                <Typography variant="body2">Fluorescence: {record.fluorescence || 'Not filled yet'}</Typography>
                <Typography variant="body2">Estimated Value: {record.estimatedValue || 'Not filled yet'}</Typography>
                <Typography variant="body2">Valuation Method: {record.valuationMethod || 'Not filled yet'}</Typography>
                <Typography variant="body2">Certificate Number: {record.certificateNumber || 'Not filled yet'}</Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="secondary" onClick={handleSeal}>
          Seal
        </Button>
      </Box>
    </Box>
  );
};

export default RecordViewDetail;
