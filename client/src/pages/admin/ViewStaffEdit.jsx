import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box
} from '@mui/material';

const ViewStaffEdit = () => {
  const { staffId } = useParams();
  const [staff, setStaff] = useState({ name: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`/api/users/${staffId}`);
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchStaff();
  }, [staffId]);

  const handleChange = (e) => {
    setStaff({ ...staff, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/users/${staffId}`, staff);
      navigate('/admin/view-staff');
    } catch (error) {
      console.error('Error updating staff data:', error);
    }
  };

  return (
    <Container component={Paper} sx={{ p: 4, mt: 4, marginLeft:'50px', width:'900px'}}>
      <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
        Edit Staff
      </Typography>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Name"
          variant="outlined"
          name="name"
          value={staff.name}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          variant="outlined"
          name="email"
          value={staff.email}
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Container>
  );
};

export default ViewStaffEdit;
