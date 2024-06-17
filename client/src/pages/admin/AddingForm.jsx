// Client/src/pages/AddingForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, MenuItem, Container, Grid } from '@mui/material';
import { toast } from 'react-hot-toast';

const AddingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/users", formData);
      navigate("/admin/staff");
    } catch (error) {
      console.error("Error adding user:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while adding the user.");
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 5,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
          Add New User
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              select
              fullWidth
              variant="outlined"
            >
              <MenuItem value="consultant">Consultant</MenuItem>
              <MenuItem value="appraiser">Appraiser</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              {/* <MenuItem value="admin">Admin</MenuItem> */}
            </TextField>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddingForm;
