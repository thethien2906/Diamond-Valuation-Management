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
  IconButton,
  TablePagination
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

const TaskView = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user || !user._id) {
        toast.error('User not logged in');
        return;
      }
      try {
        const response = await axios.get(`/api/records/appraiser/${user._id}`);
        if (Array.isArray(response.data)) {
          setRecords(response.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching records:', error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  const handleViewRecord = (recordId) => {
    navigate(`/appraiser/valuation-records/${recordId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
              <TableCell sx={{color:'white', fontWeight: 'bold'}}>Record Number</TableCell>
              <TableCell sx={{color:'white', fontWeight: 'bold'}}>Customer Name</TableCell>
              <TableCell sx={{color:'white', fontWeight: 'bold'}}>Status</TableCell>
              <TableCell sx={{color:'white', fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(records) && records.length > 0 ? (
              records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record, index) => (
                <TableRow key={record._id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
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
              <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  No records found
                </Typography>
              </TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
        rowsPerPageOptions={[6, 10, 25]}
        component="div"
        count={records.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </TableContainer>

    </Box>
  );
};

export default TaskView;
