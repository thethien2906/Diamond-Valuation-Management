import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button, TablePagination } from '@mui/material';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';

const ConsulatantSealStatus = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) {
        toast.error('User not logged in');
        return;
      }

      try {
        // Fetch requests for the consultant's ID
        const response = await axios.get(`/api/seal-requests/${user._id}/status`);
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching sealing:', error);
        toast.error('Failed to fetch sealing');
      } finally {
        setLoading(false);
      }
    };
    // Only fetch if user exists
    if (user && user._id) {
      fetchRequests();
    }
  }, [user]);

  const handleUnseal = async (sealId) => {
    try {
      await axios.post(`/api/seal-requests/${sealId}/unseal`);
      toast.success('Record unsealed and seal deleted');
      setRequests((prevRequests) => prevRequests.filter(request => request._id !== sealId));
    } catch (error) {
      console.error('Error unsealing record:', error);
      toast.error('Failed to unseal record');
    }
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
        <Typography variant="h6">No Sealed Record</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        My Sealed Records
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Issued</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((request, index) => (
                <TableRow key={request._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{request.customerName}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {request.status === 'Approved' && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleUnseal(request._id)}
                      >
                        Unseal
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={requests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default ConsulatantSealStatus;
