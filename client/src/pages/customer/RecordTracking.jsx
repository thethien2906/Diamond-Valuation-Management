import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  IconButton
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import RefreshIcon from '@mui/icons-material/Refresh';

const RecordTracking = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const handleRequestCommit = (recordId) => {
    navigate(`/request-commit/${recordId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, marginTop: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <CustomerLayout>
      <Box sx={{ p: 3,marginTop:'100px',minHeight:'50vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Record Tracking
          </Typography>
        </Box>
        {records.length === 0 ? (
          <Typography variant="h6" component="p" sx={{ textAlign: 'center', mt: 4 }}>
            There is no Record Tracking
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Record Number</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Appointment Date</TableCell>
                  <TableCell>Appointment Time</TableCell>
                  <TableCell>Service Name</TableCell>
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
                    <TableCell>{record.serviceName}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleRequestCommit(record._id)}
                        disabled={record.commitmentRequested}
                      >
                        {record.commitmentRequested ? 'Requested' : 'Request Commit'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </CustomerLayout>
  );
};

export default RecordTracking;
