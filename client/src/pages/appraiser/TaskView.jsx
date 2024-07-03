import React, { useState, useEffect } from 'react';
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

const TaskView = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('/api/valuation-records-in-progress');
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
    navigate(`/appraiser/valuation-records/${recordId}`);
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
      <Typography variant="h6" component="h2" gutterBottom>
        Valuation Records
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#212529' }}>
            <TableRow>
              <TableCell sx={{color:'white',fontWeight: 'bold'}}>Record Number</TableCell>
              <TableCell sx={{color:'white',fontWeight: 'bold'}}>Customer Name</TableCell>
              <TableCell sx={{color:'white',fontWeight: 'bold'}}>Status</TableCell>
              <TableCell sx={{color:'white',fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(records) && records.map((record) => (
              <TableRow key={record._id}>
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
            ))}
            {!Array.isArray(records) && (
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
