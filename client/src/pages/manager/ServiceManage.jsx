import React, { useState, useEffect } from 'react';
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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TablePagination,
} from '@mui/material';
import { toast } from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


const ManagerServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    accuracy: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (service = null) => {
    setEditService(service);
    setFormData(service ? {
      name: service.name,
      price: service.price,
      duration: service.duration,
      accuracy: service.accuracy,
    } : {
      name: '',
      price: '',
      duration: '',
      accuracy: '',
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editService) {
        await axios.put(`/api/services/${editService._id}`, formData);
        toast.success('Service updated successfully');
      } else {
        await axios.post('/api/services', formData);
        toast.success('Service created successfully');
      }
      setOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    }
  };

  const handleDelete = async (serviceId) => {
    try {
      await axios.delete(`/api/services/${serviceId}`);
      toast.success('Service deleted successfully');
      setServices(services.filter((service) => service._id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Manage Service Packages
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpen()}
        sx={{ mb: 2, backgroundColor:"black" }}
      >
        Add Service
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Accuracy</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? services.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : services
            ).map((service) => (
              <TableRow key={service._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>{service.duration}</TableCell>
                <TableCell>{service.accuracy}</TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handleOpen(service)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(service._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={services.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Services per page"
        />
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editService ? 'Edit Service' : 'Add Service'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Accuracy"
            name="accuracy"
            value={formData.accuracy}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editService ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerServices;
