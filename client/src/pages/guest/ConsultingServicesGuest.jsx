// ConsultingServicesGuest.jsx

import React, { useContext } from "react";
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

const tiers = [
  {
    title: 'Unstoppable!',
    price: '6.9',
    consultant: 'Male',
    duration: 'Moderate',
    accuracy: 'High',
    buttonText: 'Book Appointment',
    buttonVariant: 'outlined',
  },
  {
    title: 'Godlike!',
    price: '69.69',
    consultant: 'Male/Female',
    duration: 'Fast',
    accuracy: 'Higher',
    buttonText: 'Book Appointment',
    buttonVariant: 'contained',
    recommended: true, // Add recommended flag for Godlike tier
  },
  {
    title: 'Legendary!',
    price: '696.9',
    consultant: 'Male/Female',
    duration: 'Need for Speed',
    accuracy: '$1,000 with "aimbot"',
    buttonText: 'Book Appointment',
    buttonVariant: 'outlined',
  },
];

const ConsultingServicesGuest = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleBookAppointment = () => {
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
          {tiers.map((tier) => (
            <Grid item key={tier.title} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  border: tier.title === 'Godlike!' ? '1px solid' : undefined,
                  borderColor: tier.title === 'Godlike!' ? 'primary.main' : undefined,
                  background: tier.title === 'Godlike!' ? 'linear-gradient(#033363, #021F3B)' : undefined,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: tier.title === 'Godlike!' ? 'grey.100' : '',
                    }}
                  >
                    <Typography component="h3" variant="h6">
                      {tier.title}
                    </Typography>
                    {tier.recommended && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AutoAwesomeIcon sx={{ mr: 1 }} /> {/* Icon with margin */}
                        <Typography variant="body2" color="inherit">
                          Recommended
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      color: tier.title === 'Godlike!' ? 'grey.50' : undefined,
                    }}
                  >
                    <Typography component="h3" variant="h2">
                      ${tier.price}
                    </Typography>
                  </Box>
                  <Typography component="p" variant="body1" sx={{ mt: 2, color: tier.title === 'Godlike!' ? 'grey.50' : undefined,}}>
                    Consultant: {tier.consultant}
                  </Typography>
                  <Typography component="p" variant="body1" sx={{ mt: 2, color: tier.title === 'Godlike!' ? 'grey.50' : undefined,}}> 
                    Duration: {tier.duration}
                  </Typography>
                  <Typography component="p" variant="body1" sx={{ mt: 2, color: tier.title === 'Godlike!' ? 'grey.50' : undefined,}}>
                    Accuracy: {tier.accuracy}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant}
                    onClick={handleBookAppointment}
                  >
                    {tier.buttonText}
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
