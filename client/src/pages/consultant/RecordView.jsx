import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { UserContext } from '../../context/userContext';

const RecordView = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user || !user._id) {
        toast.error('User not logged in');
        return;
      }

      try {
        const response = await axios.get(`/api/records/consultant/${user._id}`);
        // Ensure the response is an array
        if (Array.isArray(response.data)) {
          setRecords(response.data);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching records:', error);
        if (error.response && error.response.status !== 404) {
          toast.error('Failed to fetch records');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  const handleViewRecord = (recordId) => {
    navigate(`/consultant/valuation-records/${recordId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewStatus = (recordId) => {
    navigate(`/consultant/record-view-status/${recordId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'green';
      case 'In Progress': return 'red';
      case 'Valuated': return 'yellow';
      case 'Sealed': return 'purple';
      case 'Picked Up': return 'blue';
      default: return 'gray';
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const filteredRecords = records.filter((record) => {
    const matchesName = record.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || record.status === statusFilter;
    return matchesName && matchesStatus;
  });

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mr: 2 }}
        />
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Valuated">Valuated</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Sealed">Sealed</MenuItem>
            <MenuItem value="Picked Up">Picked Up</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {filteredRecords.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 3 }}>
          No records found
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecords
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((record,index) => (
                    <TableRow key={record._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      <TableCell>{record.customerName}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: getStatusColor(record.status),
                              mr: 1
                            }}
                          />
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleViewStatus(record._id)}
                            sx={{
                              textTransform: 'none',
                              padding: 0,
                              minWidth: 'auto',
                              color: 'black'
                            }}
                          >
                            {record.status}
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="black"
                          onClick={() => handleViewRecord(record._id)}
                        >
                          <RemoveRedEyeIcon />
                        </IconButton>
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
            />
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default RecordView;
