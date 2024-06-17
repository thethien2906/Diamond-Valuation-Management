import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const TaskView = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('/api/valuation-records-completed');
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
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Valuation Records
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Record Number</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {Array.isArray(records) && records.map((record)  => (
              <TableRow key={record._id}>
                <TableCell>{record.recordNumber}</TableCell>
                <TableCell>{record.customerName}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewRecord(record._id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
            
            }
            {!Array.isArray(records) && (
              <TableRow>
                <TableCell colSpan={4}>No records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TaskView;
