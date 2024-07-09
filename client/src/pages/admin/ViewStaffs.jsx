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
  Fab
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const ViewStaff = () => {
  const [staff, setStaff] = useState([]);
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
    }
  };

  const handleAddUser = () => {
    navigate("/admin/add-user");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
        Staff List
      </Typography>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddUser}
        sx={{ mb: 2 }}
      >
        <AddIcon />
      </Fab>
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
            {staff.map(staffMember => (
              <TableRow key={staffMember._id}>
                <TableCell>{staffMember.name}</TableCell>
                <TableCell>{staffMember.email}</TableCell>
                <TableCell>{staffMember.role}</TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteStaff(staffMember._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ViewStaff;
