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
  IconButton,
  TablePagination,
  TextField
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import RefreshIcon from '@mui/icons-material/Refresh';

const RecordTracking = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [search, setSearch] = useState('');
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

  const handleRefresh = () => {
    setLoading(true);
    fetchRecords();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredRecords = records.filter(record => 
    record.customerName.toLowerCase().includes(search.toLowerCase()) ||
    record.status.toLowerCase().includes(search.toLowerCase()) ||
    record.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, marginTop: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <CustomerLayout>
      <Box sx={{ p: 3, marginTop: '100px', minHeight: '50vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Record Tracking
          </Typography>
          <Button
            onClick={handleRefresh}
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={{ 
              backgroundColor: '#424242',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333333',
              },
            }}
          >
            Refresh
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            value={search}
            onChange={handleSearch}
          />
        </Box>
        {filteredRecords.length === 0 ? (
          <Typography variant="h6" component="p" sx={{ textAlign: 'center', mt: 4 }}>
            There is no Record Tracking
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Appointment Date</TableCell>
                  <TableCell>Appointment Time</TableCell>
                  <TableCell>Service Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredRecords
                ).map((record, index) => (
                  <TableRow key={record._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
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
            <TablePagination
              rowsPerPageOptions={[6, 12, 24]}
              component="div"
              count={filteredRecords.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Records per page"
            />
          </TableContainer>
        )}
      </Box>
    </CustomerLayout>
  );
};

export default RecordTracking;
