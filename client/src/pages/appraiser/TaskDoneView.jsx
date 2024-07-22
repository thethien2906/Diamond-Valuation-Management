import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
const TaskView = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(`/api/valuation-records-valuated/${user._id}`);
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
        toast.error('Failed to fetch records');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const handleViewRecord = (recordId) => {
    navigate(`/appraiser/task-view/${recordId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Valuation Records
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#212529' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color:'white'}}>Record Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color:'white' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color:'white' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color:'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(records) && records.length > 0 ? (
              records.map((record) => (
                <TableRow key={record._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{record.recordNumber}</TableCell>
                  <TableCell>{record.customerName}</TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>
                    <IconButton
                      color="black"
                      onClick={() => handleViewRecord(record._id)}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center' }}>No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TaskView;
