import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination,
  Box,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        const filteredUsers = response.data.filter(user => user.role === "user");
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      handleClose();
    }
  };

  const handleOpen = (userId) => {
    setSelectedUserId(userId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUserId(null);
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

  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
        User List
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
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#212529" }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Email</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      onClick={() => handleOpen(user._id)}
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
          count={filteredUsers.length}
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
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteUser(selectedUserId)}
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

export default ViewUsers;
