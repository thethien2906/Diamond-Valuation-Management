import React, { useContext, useState, useEffect } from "react";
import CustomerLayout from "../../components/CustomerLayout";
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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Import the icon
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
const ConsultingServicesCustomer = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookAppointment = (serviceId) => {
    if (user) {
      navigate(`/booking?serviceId=${serviceId}`);
    } else {
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <CustomerLayout>
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
          {services.map((service) => (
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
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: service.name === 'Godlike!' ? 'white' : 'inherit',
                    }}
                  >
                    <Typography component="h3" variant="h6">
                      {service.name}
                    </Typography>
                    {service.name === 'Godlike!' && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AutoAwesomeIcon sx={{ mr: 1 }} /> {/* Render the icon */}
                        <Typography variant="body2" color="white">
                          Recommended
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      color: service.name === 'Godlike!' ? 'white' : undefined,
                    }}
                  >
                    <Typography component="h3" variant="h2">
                      ${service.price}
                    </Typography>
                  </Box>
                  
                  <Typography component="p" variant="body1" sx={{ mt: 2, color: service.name === 'Godlike!' ? 'white' : undefined }}>
                    Duration: {service.duration}
                  </Typography>
                  <Typography component="p" variant="body1" sx={{ mt: 2, color: service.name === 'Godlike!' ? 'white' : undefined }}>
                    Accuracy: {service.accuracy}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={service.name === 'Godlike!' ? 'contained' : 'outlined'}
                    onClick={() => handleBookAppointment(service._id)}
                  >
                    Book Appointment
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </CustomerLayout>
  );
};

export default ConsultingServicesCustomer;
