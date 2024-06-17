import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-hot-toast';

const ValuationRecordAppraiserDetail = () => {
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await axios.put(`/api/valuation-records/${recordId}`, {
        ...record,
        status: 'Completed',
      });
      toast.success('Valuation record updated successfully');
      navigate('/appraiser');
    } catch (error) {
      console.error('Error updating valuation record:', error);
      toast.error('Failed to update valuation record');
    } finally {
      setUpdating(false);
    }
  };

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
        Valuation Record Details (Appraiser)
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
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Shape and Cut"
            name="shapeAndCut"
            value={record.shapeAndCut || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Carat Weight"
            name="caratWeight"
            type="number"
            value={record.caratWeight || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Clarity"
            name="clarity"
            value={record.clarity || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Cut Grade"
            name="cutGrade"
            value={record.cutGrade || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Measurements"
            name="measurements"
            value={record.measurements || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Polish"
            name="polish"
            value={record.polish || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Symmetry"
            name="symmetry"
            value={record.symmetry || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fluorescence"
            name="fluorescence"
            value={record.fluorescence || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Estimated Value"
            name="estimatedValue"
            type="number"
            value={record.estimatedValue || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Valuation Method"
            name="valuationMethod"
            value={record.valuationMethod || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Certificate Number"
            name="certificateNumber"
            value={record.certificateNumber || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update and Complete'}
            </Button>
            
          
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ValuationRecordAppraiserDetail;
