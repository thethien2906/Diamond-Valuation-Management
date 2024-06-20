import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper, CircularProgress } from '@mui/material';
import { toast } from 'react-hot-toast';

const CommitRequest = () => {
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    reasonForLoss: '',
    customerName: '',
    phoneNumber: '',
    email: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        const response = await axios.get(`/api/valuation-records/${recordId}`);
        setRecord(response.data);
        setFormData({
          ...formData,
          customerName: response.data.customerName,
          phoneNumber: response.data.phoneNumber,
          email: response.data.email,
        });
      } catch (error) {
        console.error('Error fetching record data:', error);
        toast.error('Failed to fetch record data');
      } finally {
        setLoading(false);
      }
    };

    fetchRecordData();
  }, [recordId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/commit-request', {
        ...formData,
        recordId,
      });
      toast.success(response.data.message);
      navigate('/record-tracking');
    } catch (error) {
      console.error('Error submitting commit request:', error);
      toast.error('Failed to submit commit request');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Request Commitment Statement
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">Record Id: {recordId}</Typography>
        <Typography variant="body1">Name: {formData.customerName}</Typography>
        <Typography variant="body1">Phone Number: {formData.phoneNumber}</Typography>
        <Typography variant="body1">Email: {formData.email}</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Reason for Loss"
            name="reasonForLoss"
            value={formData.reasonForLoss}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            required
          />
          <TextField
            label="Date Issued"
            name="dateIssued"
            value={new Date().toLocaleDateString()}
            fullWidth
            margin="normal"
            disabled
          />
          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CommitRequest;
