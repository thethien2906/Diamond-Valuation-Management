// ConsultingServicesGuest.jsx

import React, { useContext, useState, useEffect } from "react";
import GuestLayout from "../../components/GuestLayout";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/userContext";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Import AutoAwesomeIcon from Material-UI
import axios from 'axios';
import toast from "react-hot-toast";


const ConsultingServicesGuest = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [services, setServices] = useState([]); // State to store fetched services

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services'); // Fetch services from backend
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Failed to fetch services');
      }
    };
    fetchServices();
  }, []);
  const handleBookAppointment = () => {``
    if (user) {
      navigate("/booking");
    } else {
      navigate("/login");
    }
  };

  return (
    <GuestLayout>
      <Container
        sx={{
          pt: { xs: 4, sm: 12 },
          pb: { xs: 8, sm: 16 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: '100%', md: '60%' },
            textAlign: { sm: 'left', md: 'center' },
          }}
        >
          <Typography component="h2" variant="h4" color="text.primary">
            Consulting Services
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Unlock the true value of your diamonds with our personalized guidance.
          </Typography>
        </Box>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
        {services.map((service) => (  // Map over fetched services
          <Grid item key={service._id} xs={12} sm={6} md={4}>
            <Card 
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                border: service.name === 'Godlike!' ? '1px solid' : undefined,
                borderColor: service.name === 'Godlike!' ? 'primary.main' : undefined,
                background: service.name === 'Godlike!' ? 'linear-gradient(#033363, #021F3B)' : undefined,
              }}
            >
              <CardContent>
                <Typography component="h3" variant="h6">
                  {service.name}
                </Typography>

                {/* ... conditionally render the Recommended tag ... */}

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    color: service.name === 'Godlike!' ? 'grey.50' : undefined,
                  }}
                >
                  <Typography component="h3" variant="h2">
                    ${service.price.toFixed(2)} 
                  </Typography>
                </Box>
                <Typography component="p" variant="body1" sx={{ mt: 2, color: service.name === 'Godlike!' ? 'grey.50' : undefined, }}>
                  Duration: {service.duration}
                </Typography>
                <Typography component="p" variant="body1" sx={{ mt: 2, color: service.name === 'Godlike!' ? 'grey.50' : undefined, }}>
                  Accuracy: {service.accuracy}
                </Typography>
              </CardContent>

              <CardActions>
                <Button 
                  fullWidth 
                  variant={service.name === 'Godlike!' ? 'contained' : 'outlined'} // Dynamic variant
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Container>
    </GuestLayout>
  );
};

export default ConsultingServicesGuest;
