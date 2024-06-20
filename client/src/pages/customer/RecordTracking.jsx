import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button } from '@mui/material';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
const RecordTracking = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) {
        toast.error('User not logged in');
        return;
      }
      try {
        const response = await axios.get(`/api/valuation-records/user/${user._id}`);
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
        toast.error('Failed to fetch records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  const handleRequestCommit = (recordId) => {
    navigate(`/request-commit/${recordId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (records.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Typography variant="h6">No records found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Record Tracking
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Record Number</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Appointment Date</TableCell>
              <TableCell>Appointment Time</TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Estimated Value</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record._id}>
                <TableCell>{record.recordNumber}</TableCell>
                <TableCell>{record.customerName}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>{new Date(record.appointmentDate).toLocaleDateString()}</TableCell>
                <TableCell>{record.appointmentTime}</TableCell>
                <TableCell>{record.services}</TableCell>
                <TableCell>{record.estimatedValue || 'Not yet estimated'}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleRequestCommit(record._id)}
                    disabled={record.commitmentRequested} // Disable button if already requested
                  >
                    {record.commitmentRequested ? 'Requested' : 'Request Commit'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RecordTracking;
