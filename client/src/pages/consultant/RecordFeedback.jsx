import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-hot-toast';

const FeedbackForm = () => {
  const { recordId } = useParams();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/api/feedback`, {
        recordId,
        feedback
      });
      toast.success('Feedback submitted successfully');
      navigate(`/consultant/valuation-records`);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Submit Feedback for Appraiser
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Feedback"
          name="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          required
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default FeedbackForm;
