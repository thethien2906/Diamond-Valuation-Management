import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, MenuItem, Container } from '@mui/material';
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
      toast.success("User added successfully!");
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
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 5,
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: '#686b69',
          color: 'white',
        }}
      >
        <Typography variant="h4" component="h2" sx={{ mb: 4, textAlign: 'center', color: 'white' }}>
          Add New User
        </Typography>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{
            style: { color: 'white', borderColor: 'white' },
          }}
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' }, '&.Mui-focused fieldset': { borderColor: 'white' } } }}
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{
            style: { color: 'white', borderColor: 'white' },
          }}
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' }, '&.Mui-focused fieldset': { borderColor: 'white' } } }}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{
            style: { color: 'white', borderColor: 'white' },
          }}
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' }, '&.Mui-focused fieldset': { borderColor: 'white' } } }}
        />
        <TextField
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          select
          fullWidth
          variant="outlined"
          margin="normal"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{
            style: { color: 'white', borderColor: 'white' },
          }}
          sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' }, '&.Mui-focused fieldset': { borderColor: 'white' } } }}
        >
          <MenuItem value="consultant">Consultant</MenuItem>
          <MenuItem value="appraiser">Appraiser</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          {/* <MenuItem value="admin">Admin</MenuItem> */}
        </TextField>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ bgcolor: '#212529', '&:hover': { bgcolor: '#333' } }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddingForm;
