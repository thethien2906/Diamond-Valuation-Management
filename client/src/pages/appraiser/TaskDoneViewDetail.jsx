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
  CircularProgress,
  Grid
} from '@mui/material';
import { toast } from 'react-hot-toast';

const TaskDoneViewDetail = () => {
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        const response = await axios.get(`/api/valuation-records/${recordId}`);
        const serviceResponse = await axios.get(`/api/services/${response.data.serviceId}`);
        const consultantResponse = await axios.get(`/api/users/${response.data.consultantId}`);
        const appraiserResponse = await axios.get(`/api/users/${response.data.appraiserId}`);
        if (response.data.feedbackId) {
          const feedbackResponse = await axios.get(`/api/feedback/${response.data.feedbackId}`);
          setFeedback(feedbackResponse.data);
        }
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

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`/api/valuation-records/${recordId}`, { ...record });
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
      <div ref={componentRef}>
        <Paper sx={{ p: 3, mt: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <img src="/Diamond.jpg" alt="Logo" style={{ height: 150, marginRight: '16px' }} />
            <Typography variant="h4" component="h2" sx={{ flexGrow: 1, textAlign: 'left' }}>
              Diamond Scope
              <Typography variant="body1">Record Number: {record.recordNumber}</Typography>
              <Typography variant="body1">Appointment Date: {new Date(record.appointmentDate).toLocaleDateString()}</Typography>
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom><b>Customer Information:</b></Typography>
              <Typography variant="body1">• Customer Name: {record.customerName}</Typography>
              <Typography variant="body1">• Phone Number: {record.phoneNumber}</Typography>
              <Typography variant="body1">• Email: {record.email}</Typography>
              <Typography gutterBottom><b>Staff Details:</b></Typography>
              <Typography variant="body1">• Consultant Name: {record.consultantName}</Typography>
              <Typography variant="body1">• Appraiser Name: {record.appraiserName || 'Not assigned yet'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom><b>Appointment Details:</b></Typography>
              <Typography variant="body1">• Appointment Time: {record.appointmentTime}</Typography>
              <Typography gutterBottom><b>Service Details:</b></Typography>
              <Typography variant="body1">• Services: {record.serviceName}</Typography>
            </Grid>
          </Grid>
          <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center'}}>
                <Typography variant="body1" sx={{ width: '150px' }}>Shape and Cut:</Typography>
                <TextField
                  name="shapeAndCut"
                  value={record.shapeAndCut || ''}
                  onChange={handleChange}
                  variant="standard"
                  sx={{ flexGrow: 1, textAlign: 'right', '& .MuiInput-underline:before': { borderBottom: '1px dotted gray' }, '& .MuiInput-underline:after': { borderBottom: '1px dotted gray' }, input: { textAlign: 'right' } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ width: '150px' }}>Carat Weight:</Typography>
                <TextField
                  name="caratWeight"
                  value={record.caratWeight || ''}
                  onChange={handleChange}
                  variant="standard"
                  sx={{ flexGrow: 1, textAlign: 'right', '& .MuiInput-underline:before': { borderBottom: '1px dotted gray' }, '& .MuiInput-underline:after': { borderBottom: '1px dotted gray' }, input: { textAlign: 'right' } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ width: '150px' }}>Clarity:</Typography>
                <TextField
                  name="clarity"
                  value={record.clarity || ''}
                  onChange={handleChange}
                  variant="standard"
                  sx={{ flexGrow: 1, textAlign: 'right', '& .MuiInput-underline:before': { borderBottom: '1px dotted gray' }, '& .MuiInput-underline:after': { borderBottom: '1px dotted gray' }, input: { textAlign: 'right' } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ width: '150px' }}>Cut Grade:</Typography>
                <TextField
                  name="cutGrade"
                  value={record.cutGrade || ''}
                  onChange={handleChange}
                  variant="standard"
                  sx={{ flexGrow: 1, textAlign: 'right', '& .MuiInput-underline:before': { borderBottom: '1px dotted gray' }, '& .MuiInput-underline:after': { borderBottom: '1px dotted gray' }, input: { textAlign: 'right' } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ width: '150px' }}>Measurements:</Typography>
                <TextField
                  name="measurements"
                  value={record.measurements || ''}
                  onChange={handleChange}
                  variant="standard"
                  sx={{ flexGrow: 1, textAlign: 'right', '& .MuiInput-underline:before': { borderBottom: '1px dotted gray' }, '& .MuiInput-underline:after': { borderBottom: '1px dotted gray' }, input: { textAlign: 'right' } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ width: '150px' }}>Polish:</Typography>
                <TextField
                  name="polish"
                  value={record.polish || ''}
                  onChange={handleChange}
                  variant="standard"
                  sx={{ flexGrow: 1, textAlign: 'right', '& .MuiInput-underline:before': { borderBottom: '1px dotted gray' }, '& .MuiInput-underline:after': { borderBottom: '1px dotted gray' }, input: { textAlign: 'right' } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ width: '150px' }}>Symmetry:</Typography>
                <TextField
                  name="symmetry"
                  value={record.symmetry || ''}
                  onChange={handleChange}
                  variant="standard"
                  sx={{ flexGrow: 1, textAlign: 'right', '& .MuiInput-underline:before': { borderBottom: '1px dotted gray' }, '& .MuiInput-underline:after': { borderBottom: '1px dotted gray' }, input: { textAlign: 'right' } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ width: '150px' }}>Fluorescence:</Typography>
                <TextField
                  name="fluorescence"
                  value={record.fluorescence || ''}
                  onChange={handleChange}
                  variant="standard"
                  sx={{ flexGrow: 1, textAlign: 'right', '& .MuiInput-underline:before': { borderBottom: '1px dotted gray' }, '& .MuiInput-underline:after': { borderBottom: '1px dotted gray' }, input: { textAlign: 'right' } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ width: '150px' }}>Valuation Method:</Typography>
                <TextField
                  name="valuationMethod"
                  value={record.valuationMethod || ''}
                  onChange={handleChange}
                  variant="standard"
                  sx={{ flexGrow: 1, textAlign: 'right', '& .MuiInput-underline:before': { borderBottom: '1px dotted gray' }, '& .MuiInput-underline:after': { borderBottom: '1px dotted gray' }, input: { textAlign: 'right' } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ width: '150px' }}>Certificate Number:</Typography>
                <TextField
                  name="certificateNumber"
                  value={record.certificateNumber || ''}
                  onChange={handleChange}
                  variant="standard"
                  sx={{ flexGrow: 1, textAlign: 'right', '& .MuiInput-underline:before': { borderBottom: '1px dotted gray' }, '& .MuiInput-underline:after': { borderBottom: '1px dotted gray' }, input: { textAlign: 'right' } }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ width: '150px' }}>Estimated Value:</Typography>
                <TextField
                  name="estimatedValue"
                  value={record.estimatedValue || ''}
                  onChange={handleChange}
                  variant="standard"
                  sx={{ flexGrow: 1, textAlign: 'right', '& .MuiInput-underline:before': { borderBottom: '1px dotted gray' }, '& .MuiInput-underline:after': { borderBottom: '1px dotted gray' }, input: { textAlign: 'right' } }}
                />
              </Box>
            </Box>
          </form>
        </Paper>
      </div>
      {record.feedbackId && feedback && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>Feedback from Consultant</Typography>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="body1">{feedback.feedback}</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>Submitted on: {new Date(feedback.createdAt).toLocaleString()}</Typography>
          </Paper>
        </Box>
      )}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mr: 2 }}>
          Print Certificate
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          disabled={updating}
        >
          {updating ? 'Updating...' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
};

export default TaskDoneViewDetail;
