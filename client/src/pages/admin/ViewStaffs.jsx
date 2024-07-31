import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  TablePagination,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const ViewStaff = () => {
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("/api/users");
        const filteredStaff = response.data.filter(user => user.role !== "user");
        setStaff(filteredStaff);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  const handleDeleteStaff = async (staffId) => {
    try {
      await axios.delete(`/api/users/${staffId}`);
      setStaff(staff.filter(staff => staff._id !== staffId));
    } catch (error) {
      console.error("Error deleting staff:", error);
    } finally {
      handleClose();
    }
  };

  const handleOpen = (staffId) => {
    setSelectedStaffId(staffId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStaffId(null);
  };

  const handleAddUser = () => {
    navigate("/admin/add-user");
  };

  const handleEditUser = (staffId) => {
    navigate(`/admin/edit/${staffId}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredStaff = staff.filter((staffMember) => {
    return staffMember.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
        Staff List
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexDirection: 'column',
          width: '100%',
          maxWidth: '500px'
        }}
      >
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleAddUser}
          sx={{ mb: 2, alignSelf: 'flex-start' }}
        >
          <AddIcon />
        </Fab>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor:"#212529" }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Role</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaff
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(staffMember => (
                <TableRow key={staffMember._id}>
                  <TableCell>{staffMember.name}</TableCell>
                  <TableCell>{staffMember.email}</TableCell>
                  <TableCell>{staffMember.role}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditUser(staffMember._id)}
                    >
                      <EditIcon />
                    </IconButton>
                    {staffMember.role !== 'admin' && (
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpen(staffMember._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={filteredStaff.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this staff member?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => handleDeleteStaff(selectedStaffId)} 
            color="primary" 
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewStaff;
