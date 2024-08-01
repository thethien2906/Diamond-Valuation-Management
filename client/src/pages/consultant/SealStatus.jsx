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
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';

const ConsulatantSealStatus = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) {
        toast.error('User not logged in');
        return;
      }

      try {
        const response = await axios.get(`/api/seal-requests/${user._id}/status`);
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching sealing:', error);
        toast.error('Failed to fetch sealing');
      } finally {
        setLoading(false);
      }
    };

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (reason) => {
    setSelectedReason(reason);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedReason('');
  };

  const filteredRequests = requests.filter((request) =>
    request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (statusFilter === '' || request.status === statusFilter)
  );

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
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search by Customer Name"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Filter by Status"
          variant="outlined"
          select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>
      </Box>
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
            {filteredRequests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((request, index) => (
                <TableRow key={request._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{request.customerName}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleOpenDialog(request.reason)}>
                      View Reason
                    </Button>
                  </TableCell>
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
          count={filteredRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Reason</DialogTitle>
        <DialogContent sx={{ minHeight: '300px' }}>
          <Typography>{selectedReason}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsulatantSealStatus;
