import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/system';
import axios from 'axios';
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import CustomerLayout from "../../components/CustomerLayout";
import { UserContext } from "../../context/userContext";

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

  const fluorescentGlow = keyframes`
    0%, 100% {
      box-shadow: 0 0 3px #00f, 0 0 6px #00f, 0 0 12px #00f, 0 0 24px #00f, 0 0 36px #00f;
    }
    50% {
      box-shadow: 0 0 6px #00f, 0 0 12px #00f, 0 0 24px #00f, 0 0 48px #00f, 0 0 72px #00f;
    }
  `;

  const isSpecialService = (serviceName) => ['Godlike!', 'Legendary!', 'Unstoppable!'].includes(serviceName);

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
          <Typography component="h2" variant="h3" fontWeight="bold" color="white">
            Consulting Services
          </Typography>
          <Typography variant="body1" color="white">
            Unlock the true value of your diamonds with our personalized guidance.
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="stretch" justifyContent="center">
          {services.map((service) => (
            <Grid item key={service._id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  border: isSpecialService(service.name) ? '1px solid' : undefined,
                  borderColor: isSpecialService(service.name) ? 'primary.main' : undefined,
                  transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
                  borderRadius: '20px',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 3,
                    backgroundColor: '#FFFFFF',
                  },
                  color: isSpecialService(service.name) ? 'grey.900' : 'text.primary',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <CardContent>
                  <Typography
                    component="h3"
                    variant="h6"
                    fontSize="1.25rem"
                    sx={{
                      fontWeight: isSpecialService(service.name) ? 'bold' : 'normal',
                      color: isSpecialService(service.name) ? 'blue' : 'text.primary'
                    }}
                  >
                    {service.name}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      color: isSpecialService(service.name) ? 'black' : 'text.primary',
                    }}
                  >
                    <Typography component="h3" variant="h2" fontSize="2.5rem" fontWeight="bold">
                      ${service.price.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Typography component="p" variant="body1" sx={{ mt: 1, fontSize: '0.9rem', color: isSpecialService(service.name) ? 'black' : 'text.primary' }}>
                    Duration: {service.duration}
                  </Typography>
                  
                  <Typography component="p" variant="body1" sx={{ mt: 1, fontSize: '0.9rem', color: isSpecialService(service.name) ? 'black' : 'text.primary' }}>
                    Accuracy: {service.accuracy}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant={isSpecialService(service.name) ? 'contained' : 'outlined'}
                    onClick={() => handleBookAppointment(service._id)}
                    sx={{
                      width: '70%',
                      margin: '0 auto',
                      borderRadius: '10px',
                      '&:hover': {
                        animation: `${fluorescentGlow} 1.5s infinite alternate`,
                      }
                    }}
                  >
                    <Typography variant="body1" fontWeight="bold">
                      Book
                    </Typography>
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
