import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, IconButton, TablePagination } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ManagerSealingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/seal-requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching sealing requests:', error);
        toast.error('Failed to fetch sealing requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleViewDetail = (sealId) => {
    navigate(`/manager/seal-requests/${sealId}`);
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

  if (requests.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Typography variant="h4">No sealing requests found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Sealing Requests (Pending)
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#212529' }}>
            <TableRow>
              <TableCell sx={{color:'white'}}>Record ID</TableCell>
              <TableCell sx={{color:'white'}}>Customer Name</TableCell>
              <TableCell sx={{color:'white'}}>Reason</TableCell>
              <TableCell sx={{color:'white'}}>Consultant</TableCell>
              <TableCell sx={{color:'white'}}>Date Issued</TableCell>
              <TableCell sx={{color:'white'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request.recordId.recordNumber}</TableCell>
                <TableCell>{request.customerName}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell>{request.consultantId.name}</TableCell>
                <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton 
                    color="black" 
                    onClick={() => handleViewDetail(request._id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[6, 10, 25]}
        component="div"
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ManagerSealingRequests;
