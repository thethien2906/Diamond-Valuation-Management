import { keyframes } from '@emotion/react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React, { useEffect, useState } from 'react';
import GuestLayout from "../../components/GuestLayout";

const images = [
  'https://st.depositphotos.com/1864147/1520/i/450/depositphotos_15204605-stock-photo-diamonds.jpg',
  'https://media.istockphoto.com/id/1198591342/photo/diamond-still-life.jpg?s=612x612&w=0&k=20&c=gBJoe0iBoaDjVrJvdhlSS9U1B4bM-hdplYbjOtG86Rg=',
  'https://t4.ftcdn.net/jpg/05/33/75/93/360_F_533759300_jDaIRQHHnuhtPnf18k5dcWfEJ0RT8A1V.jpg',
  // Add more image URLs as needed
];

// Define a fade-in keyframe animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const PageContainer = styled(Box)({
  backgroundColor: '#e5e4e2',
  minHeight: '100vh', // Ensures the container stretches to at least the full height of the viewport
});

const HeroSection = styled(Box)(({ theme, backgroundImage }) => ({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  width: '110.9%',
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white', // Changed text color to white for better contrast
  textAlign: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  zIndex: 10,
  marginTop: '-19px',
  marginLeft: '-90px',
  transition: 'background-image 0.5s ease-in-out', // Adding transition for background image change
  animation: `${fadeIn} 1s ease-in-out`, // Apply fadeIn animation
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust the opacity (0.4) for darkness level
    zIndex: -1,
  },
}));

const ContentSection = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 10,
  marginTop: theme.spacing(8), // Adjust the top margin to create space for the navigation bar
  marginBottom: theme.spacing(8),
  color: 'black',
  animation: `${fadeIn} 1s ease-in-out`, // Apply fadeIn animation
}));

const FooterSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#033F63',
  color: 'white',
  padding: theme.spacing(4, 0),
  position: 'relative',
  zIndex: 10,
  marginLeft: '-89px',
  marginRight: '-100px',
  animation: `${fadeIn} 1s ease-in-out`, // Apply fadeIn animation
}));

const HowItWorksSection = styled(ContentSection)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  animation: `${fadeIn} 1s ease-in-out`, // Apply fadeIn animation
}));

const HowItWorksItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  textAlign: 'center',
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.spacing(1),
  zIndex: 1,
  animation: `${fadeIn} 1s ease-in-out`, // Apply fadeIn animation
  '& img': {
    display: 'block',
    margin: '0 auto',
    marginBottom: theme.spacing(2),
    width: '80px',
    height: 'auto',
  },
}));

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer>
      <GuestLayout>
        <HeroSection backgroundImage={images[currentImageIndex]}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            UNLOCK THE TRUE VALUE OF YOUR DIAMONDS
          </Typography>
          <Typography variant="h5" component="p" gutterBottom sx={{ color: 'white' }}>
            Accurate, Reliable, and Trustworthy Diamond Appraisal Services
          </Typography>
        </HeroSection>

        <HowItWorksSection>
          <Typography variant="h1" component="h2" gutterBottom style={{fontWeight: 'bold', textAlign: 'center', marginBottom: '100px', color: 'black' }}>
            HOW WE WORKS
          </Typography>
          <Grid container spacing={4}>
            <Grid container spacing={2} alignItems="center" style={{ marginBottom: '200px' }}>
              <Grid item xs={12} md={6} style={{ textAlign: 'left' }}>
                <HowItWorksItem style={{ height: '235px', width: '500px' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '2%', height: '100%', background: '#033F63', zIndex: 1 }} />
                  <Typography variant="h3" gutterBottom style={{ textAlign: 'left', color: '#033F63' }}>
                    SUBMITTING
                  </Typography>
                  <Typography variant="body1" style={{ textAlign: 'left' }}>
                    Provide details about your diamond through our secure submission form.
                  </Typography>
                </HowItWorksItem>
              </Grid>
              <Grid item xs={12} md={6} style={{ position: 'relative' }}>
                <img
                  src="https://www.shutterstock.com/image-photo/all-shapes-cuts-beautiful-natural-600nw-2000536136.jpg"
                  alt="Submit Your Diamond"
                  style={{ width: '145%', height: '450px', marginLeft: '-250px' }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center" style={{ marginBottom: '200px' }}>
              <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }} style={{ position: 'relative' }}>
                <img
                  src="https://austindiamondbuyer.net/wp-content/uploads/2022/09/Diamond-Evaluation-Everything-You-Need-To-Know-1080x675.jpg"
                  alt="Professional Assessment"
                  style={{ width: '145%', height: '450px', marginLeft: '5%' }}
                />
              </Grid>
              <Grid item xs={12} md={6} order={{ xs: 1, md: 2, opacity: 1 }}>
                <HowItWorksItem style={{ height: '235px', width: '500px', marginLeft: '40px' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '2%', height: '100%', background: '#F0E68C', zIndex: 1 }} />
                  <Typography variant="h3" gutterBottom style={{ textAlign: 'left' }}>
                    EVALUATION
                  </Typography>
                  <Typography variant="body1" style={{ textAlign: 'left' }}>
                    Our expert gemologists carefully assess the value of your diamond based on its unique characteristics.
                  </Typography>
                </HowItWorksItem>
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" style={{ marginTop: '20px' }}>
              <Grid item xs={12} md={6} style={{ textAlign: 'left' }}>
                <HowItWorksItem style={{ height: '235px', width: '500px' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '2%', height: '100%', background: '#32CD32', zIndex: 1 }} />
                  <Typography variant="h3" gutterBottom style={{ textAlign: 'left', color: '#32CD32' }}>
                    REPORT
                  </Typography>
                  <Typography variant="body1" style={{ textAlign: 'left' }}>
                    Get a detailed valuation report outlining the appraisal results and the estimated market value of your diamond.
                  </Typography>
                </HowItWorksItem>
              </Grid>
              <Grid item xs={12} md={6} style={{ position: 'relative' }}>
                <img
                  src="https://esplanadenorwest.com.au/wp-content/uploads/2023/09/valuation-report-contents-sydney-1024x449.webp"
                  alt="Detailed Report"
                  style={{ width: '145%', height: '450px', marginLeft: '-250px' }}
                />
              </Grid>
            </Grid>
          </Grid>
        </HowItWorksSection>


      </GuestLayout>
    </PageContainer>
  );
};

export default Home;
