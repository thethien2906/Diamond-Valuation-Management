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
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        const response = await axios.get(`/api/valuation-records/${recordId}`);
        const serviceResponse = await axios.get(`/api/services/${response.data.serviceId}`);
        const consultantResponse = await axios.get(`/api/users/${response.data.consultantId}`);
        const appraiserResponse = await axios.get(`/api/users/${response.data.appraiserId}`);
        setRecord({ ...response.data, serviceName: serviceResponse.data.name, appraiserName: appraiserResponse.data.name, consultantName: consultantResponse.data.name });
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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const generateCertificateNumber = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let number = '';
    for (let i = 0; i < 10; i++) {
      number += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return number;
  };

  const handlePredict = async () => {
    if (!image) {
      toast.error('Please upload an image');
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await axios.post('http://localhost:8000/predict-features/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const prediction = response.data;
      setRecord({
        ...record,
        shapeAndCut: prediction.shape,
        caratWeight: prediction.carat, // Update if you have a carat model
        clarity: prediction.clarity,
        colour: prediction.color,
        cutGrade: prediction.cut,
        polish: prediction.polish,
        symmetry: prediction.symmetry,
        fluorescence: prediction.fluorescence,
        valuationMethod: 'Machine Learning',
        certificateNumber: generateCertificateNumber(),
      });
      toast.success('Prediction successful');
    } catch (error) {
      console.error('Error during prediction:', error);
      toast.error('Failed to predict');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`/api/valuation-records/${recordId}`, {
        ...record,
        status: 'Valuated',
      });
      toast.success('Valuation record updated successfully');
      navigate('/appraiser/task-done-view');
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
        <Typography variant="body1">Service: {record.serviceName || 'Service not found'}</Typography>
        <Typography variant="body1">Consultant Name: {record.consultantName}</Typography>
        <Typography variant="body1">Appraiser Name: {record.appraiserName || 'Not assigned yet'}</Typography>

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
            value={record.caratWeight || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          {/* add measurements textfield with type string */}
          <TextField
            label="Measurements"
            name="measurements"
            value={record.measurements || ''}
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
            label="Colour"
            name="colour"
            value={record.colour || ''}
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
          
          <TextField
            label="Estimate Value"
            name="estimatedValue"
            value={record.estimatedValue || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box sx={{ mt: 2 }}>
            <input type="file" onChange={handleImageChange} />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePredict}
              disabled={updating}
            >
              Predict
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={updating}
            >
              {updating ? <CircularProgress size={24} /> : 'Update Record'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ValuationRecordAppraiserDetail;
