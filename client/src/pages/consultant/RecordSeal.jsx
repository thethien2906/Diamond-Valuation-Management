import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';

const RecordSealing = () => {
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        const response = await axios.get(`/api/valuation-records/${recordId}`);
        setRecord(response.data);
      } catch (error) {
        console.error('Error fetching valuation record data:', error);
        toast.error('Failed to fetch valuation record data');
      }
    };

    fetchRecordData();
  }, [recordId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API call to seal the record
      await axios.post('/api/seal-request', { recordId, reason, notes, consultantId: user._id });
      toast.success('Seal request created successfully');
      navigate(`/consultant/valuation-records/${recordId}`);
    } catch (error) {
      console.error('Error creating seal request:', error);
      toast.error('Failed to create seal request');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Seal Record
      </Typography>
      {record && (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">Record ID: {record.recordNumber}</Typography>
          <Typography variant="body1">Customer Name: {record.customerName}</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Reason"
              fullWidth
              multiline
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{ mt: 2 }}
              required
            />
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" color="primary">
                Seal
              </Button>
            </Box>
          </form>
        </Paper>
      )}
    </Box>
  );
};

export default RecordSealing;
