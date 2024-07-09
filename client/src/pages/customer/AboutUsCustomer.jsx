// Client/src/pages/AboutUsCustomer.jsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AOS from 'aos'; // Import AOS library
import 'aos/dist/aos.css'; // Import AOS CSS
import React, { useEffect } from "react";
import { useInView } from 'react-intersection-observer';
import CustomerLayout from "../../components/CustomerLayout";

const AboutUsCustomer = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Global duration for all animations
      once: true, // Only animate elements once
    });
  }, []);

  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true });
  const { ref: missionRef, inView: missionInView } = useInView({ triggerOnce: true });
  const { ref: whyChooseRef, inView: whyChooseInView } = useInView({ triggerOnce: true });

  return (
    <CustomerLayout>
      <Box
        data-aos="fade-up"
        sx={{
          backgroundColor: '#033F63',
          padding: '20vh 50px', // Adjusted padding to use viewport height for better screen filling
          textAlign: 'center',
          color: '#fff', // Changed text color to white
          marginBottom: '40px',
          height: '50vh', // Set height to fill the entire viewport
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold', fontSize: '8rem' }}
          data-aos="fade-up"
        >
          DiamondScope
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          width: '108.5%', // Extend the box width a bit
          backgroundColor: '#fff',
          padding: '50px',
          textAlign: 'center',
          borderRadius: 0,
          marginLeft: '-99px', // Shift the box to the left
        }}
      >
        <Box
          width="80%"
          data-aos="fade-right"
          ref={aboutRef}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Column for small screens, row for medium and larger screens
            alignItems: 'center'
          }}
        >
          <Box sx={{ flex: 1, paddingRight: { md: '20px' }, paddingBottom: { xs: '20px', md: '0' } }}>
            <Typography variant="h2" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold', color: '#033F63' }}>
              ABOUT DIAMONDSHINE
            </Typography>
            <Typography variant="h5" paragraph sx={{ color: '#666', marginBottom: '40px' }}>
              DiamondShine is a leading authority in diamond valuation, committed to providing
              accurate and reliable assessments of diamond quality and worth. Our team of experts,
              who possess extensive knowledge and experience in the field, leverages decades of expertise
              and state-of-the-art technology to deliver precise evaluations for our clients. Whether you are
              a private collector or a major industry player, our thorough and meticulous approach ensures
              that you receive the most accurate and trustworthy valuations available in the market.
            </Typography>
          </Box>
        </Box>
        <Box
          width="80%"
          data-aos="fade-left"
          ref={missionRef}
          sx={{
            width: '108%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row-reverse' }, // Column for small screens, row-reverse for medium and larger screens
            alignItems: 'flex-start',
            position: 'relative', // Set the position to relative to contain the absolutely positioned child
            textAlign: 'right', // Align text to the right
          }}
        >
          <Box sx={{ flex: 1, paddingLeft: { md: '20px' }, paddingBottom: { xs: '20px', md: '0' }, position: 'absolute', top: '40%', left: '20%', right: '-45%', marginLeft: '400px', transform: 'translate(-50%, -50%)', color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0)', padding: '20px', borderRadius: '10px', zIndex: 1 }}>
            <Typography variant="h3" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold', color: '#fff' }}>
              OUR MISSION
            </Typography>
            <Typography variant="h5" paragraph sx={{ color: '#fff', marginBottom: '40px' }}>
              We empower clients with knowledge <br /> and confidence in the diamond market. <br />Upholding integrity, transparency, and <br /> excellence, our assessments demystify <br /> diamond valuation complexities, fostering <br /> understanding of true value.
            </Typography>
          </Box>
          <Box sx={{ flex: 1, height: '400px', overflow: 'hidden', zIndex: 0 }}> {/* Adjust height as needed */}
            <img
              src="https://t3.ftcdn.net/jpg/06/47/49/12/360_F_647491277_CEc0EIRHVlnWkFIgFyoJTtZGCYOjSaNV.jpg"
              alt="Trusted"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover', // Ensure the image covers the container without stretching
                borderRadius: '0px',
                position: 'relative',
                zIndex: 0,
              }}
              data-aos="flip-right"
            />
          </Box>
        </Box>
        <Box
          width="80%"
          data-aos="fade-up"
          ref={whyChooseRef}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Column for small screens, row for medium and larger screens
            alignItems: 'center'
          }}
        >
          <Box sx={{ flex: 1, paddingRight: { md: '20px' }, paddingBottom: { xs: '20px', md: '0' } }}>
            <Typography variant="h2" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold', color: '#033F63', marginTop: '50px' }}>
              WHY CHOOSE DIAMONDSHINE
            </Typography>
          </Box>
        </Box>
        <Box
          width="80%"
          data-aos="fade-up"
          ref={whyChooseRef}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Column for small screens, row for medium and larger screens
            alignItems: 'center'
          }}
        >
          <Box sx={{ flex: 1, paddingRight: { md: '20px' }, paddingBottom: { xs: '20px', md: '0' } }}>

            <Typography variant="h5" paragraph sx={{ color: '#666', marginBottom: '40px' }}>
              With over 69 years of combined experience in the diamond industry, our team offers unparalleled expertise and insights. We utilize state-of-the-art technology and methodologies to ensure precise and accurate valuations. Our services are trusted by both industry leaders and private clients alike, underscoring our commitment to excellence and reliability.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <img
              src="https://www.jewelrycult.com/wp-content/uploads/2016/02/jewelry-appraiser.jpg"
              alt="Why Choose Us"
              style={{
                width: '100%',
                height: 'auto',
                marginTop: '50px',
                marginBottom: '40px',
                borderRadius: '10px'
              }}
              data-aos="flip-left"
            />
          </Box>
        </Box>
        <Box
          width="80%"
          data-aos="fade-up"
          ref={whyChooseRef}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Column for small screens, row for medium and larger screens
            alignItems: 'center'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <img
              src="https://us.123rf.com/450wm/kwangmoo/kwangmoo1803/kwangmoo180300994/98582086-luxury-jewelry-diamond-rings-with-reflection-on-black-background.jpg?ver=6"
              alt="Why Choose Us"
              style={{
                width: '100%',
                height: 'auto',
                marginTop: '50px',
                marginBottom: '40px',
                borderRadius: '10px'
              }}
              data-aos="flip-left"
            />
          </Box>
          <Box sx={{ flex: 1, paddingLeft: { md: '20px' }, paddingBottom: { xs: '20px', md: '0' } }}>
            <Typography variant="h5" paragraph sx={{ color: '#666', marginBottom: '40px' }}>
              Whether you are buying, selling, or insuring diamonds, DiamondShine provides the assurance you need through our rigorous and detailed valuation process. Our commitment to accuracy and reliability means you can trust us with your most valuable assets. We strive to deliver the highest standards of service and transparency, ensuring every client receives the best possible experience.
            </Typography>
          </Box>
        </Box>
        <Box
          width="80%"
          data-aos="fade-up"
          ref={whyChooseRef}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Column for small screens, row for medium and larger screens
            alignItems: 'center'
          }}
        >
          <Box sx={{ flex: 1, paddingRight: { md: '20px' }, paddingBottom: { xs: '20px', md: '0' } }}>

            <Typography variant="h5" paragraph sx={{ color: '#666', marginBottom: '40px' }}>
              At DiamondShine, we are dedicated to maintaining the trust and satisfaction of our clients. Our team's vast experience and use of advanced technology set us apart in the industry. By choosing DiamondShine, you are choosing a partner committed to excellence, reliability, and meticulous attention to detail in every valuation we perform.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <img
              src="https://abrn.asia/ojs/public/journals/3/article_66_cover_en_US.jpg"
              alt="Why Choose Us"
              style={{
                width: '100%',
                height: 'auto',
                marginTop: '50px',
                marginBottom: '40px',
                borderRadius: '10px'
              }}
              data-aos="flip-left"
            />
          </Box>
        </Box>
      </Box>
      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: '#033F63', // Same background color as the body
          color: '#fff',
          textAlign: 'center',
          padding: '20px',
          marginTop: 'auto', // Use 'auto' to push the footer to the bottom
          width: '100%', // Ensure footer spans the entire width
        }}
      >
        <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif" }}>
          © 2024 DiamondScope. All rights reserved.
        </Typography>
      </Box>
    </CustomerLayout>
  );
};

export default AboutUsCustomer;
