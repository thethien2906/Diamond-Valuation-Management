// Client/src/pages/ViewStaff.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from '@mui/material';

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
    <Container>
      <Typography variant="h4" component="h2" sx={{ my: 4 }}>
        Staff List
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddUser} sx={{ mb: 2 }}>
        Add User
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map(staffMember => (
              <TableRow key={staffMember._id}>
                <TableCell>{staffMember.name}</TableCell>
                <TableCell>{staffMember.email}</TableCell>
                <TableCell>{staffMember.role}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteStaff(staffMember._id)}
                  >
                    Delete
                  </Button>
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
