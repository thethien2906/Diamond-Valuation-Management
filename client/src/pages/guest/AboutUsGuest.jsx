// Client/src/pages/AboutUs.jsx
import React from "react";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import GuestLayout from "../../components/GuestLayout";

const AboutUsGuest = () => {
  return (
    <GuestLayout>
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h5" component="h5" gutterBottom>
                      ABOUT DIAMONDSHINE
                    </Typography>
                    <Typography variant="body1" paragraph>
                      DiamondShine is a leading authority in diamond valuation, committed to providing accurate and reliable assessments of diamond quality and worth. Our team of experts leverages decades of experience and state-of-the-art technology to deliver precise evaluations for our clients.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h5" component="h5" gutterBottom>
                      OUR MISSION
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Our mission is to empower our clients with the knowledge and confidence to make informed decisions in the diamond market. We strive to uphold the highest standards of integrity, transparency, and excellence in all our services.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h5" component="h5" gutterBottom>
                      WHY CHOOSE DIAMONDSHINE
                    </Typography>
                    <ul>
                      <Typography variant="body1" component="li" paragraph>
                        Over 69 years of combined experience in the diamond industry.
                      </Typography>
                      <Typography variant="body1" component="li" paragraph>
                        State-of-the-art technology for precise and accurate valuations.
                      </Typography>
                      <Typography variant="body1" component="li" paragraph>
                        Trusted by industry leaders and private clients alike.
                      </Typography>
                    </ul>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </GuestLayout>
  );
};

export default AboutUsGuest;
