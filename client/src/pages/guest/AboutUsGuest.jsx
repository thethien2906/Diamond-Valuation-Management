import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AOS from 'aos'; // Import AOS library
import 'aos/dist/aos.css'; // Import AOS CSS
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import GuestLayout from '../../components/GuestLayout';

const AboutUsGuest = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Global duration for all animations
      once: true, // Only animate elements once
    });
  }, []);

  const fontFamily = "'Poppins', sans-serif";

  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true });
  const { ref: missionRef, inView: missionInView } = useInView({ triggerOnce: true });
  const { ref: whyChooseRef, inView: whyChooseInView } = useInView({ triggerOnce: true });

  return (
    <GuestLayout>
    <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100vh', backgroundColor: '#E5E4E2' }} />

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
          alignItems: 'center',
          backgroundColor:'#E5E4E2'
        }}
      >
        <Box sx={{ flex: 1, paddingRight: { md: '20px' }, paddingBottom: { xs: '20px', md: '0' }, height: '600px', marginTop: '0px' }}>
          <Typography variant="h3" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold', color: 'black', marginBottom: '60px' }}>
          The top company for prioritizing diamond enthusiasts' needs worldwide
          </Typography>
          <Typography variant="h5" paragraph sx={{ color: '#666', marginLeft: '160px', textAlign: 'left', lineHeight: '1.8' }}>
            DiamondScope is a leading authority in diamond valuation, committed to providing<br></br>
            <u><i><b>accurate</b></i></u> and <u><i><b>reliable</b></i></u> assessments of diamond <u><i><b>quality</b></i></u> and <u><i><b>worth</b></i></u>. Our team of experts,<br></br>
            who possess extensive knowledge and experience in the field, leverages decades of<br></br>
            expertise and state-of-the-art technology to deliver precise evaluations for our clients.<br></br>
            Whether you are a <u><i><b>private</b></i></u> <u><i><b>collector</b></i></u> or a <u><i><b>major</b></i></u> <u><i><b>industry</b></i></u> <u><i><b>player</b></i></u>, our <u><i><b>thorough</b></i></u> and<br></br>
            <u><i><b>meticulous</b></i></u> approach ensures that you receive the most <u><i><b>accurate</b></i></u> and <u><i><b>trustworthy</b></i></u><br></br>
            valuations available in the market.
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
        <Box sx={{ flex: 1, paddingLeft: { md: '20px' }, paddingBottom: { xs: '20px', md: '0' }, position: 'absolute', top: '50%', left: '20%', right: '-45%', marginLeft: '400px', transform: 'translate(-50%, -50%)', color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0)', padding: '20px', borderRadius: '10px', zIndex: 1 }}>
          <Typography variant="h3" gutterBottom sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 'bold', color: '#fff' }}>
            OUR MISSION
          </Typography>
          <Typography variant="h5" paragraph sx={{ color: '#fff', marginBottom: '40px' }}>
            We empower clients with knowledge <br /> and confidence in the diamond market. <br />Upholding integrity, transparency, and <br /> excellence, our assessments demystify <br /> diamond valuation complexities, fostering <br /> understanding of true value.
          </Typography>
        </Box>
        <Box sx={{ flex: 1, height: '400px', overflow: 'hidden', zIndex: 0 }}> {/* Adjust height as needed */}
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/023/035/741/small_2x/diamond-is-a-rare-precious-natural-geological-stone-on-a-black-background-ai-generated-header-banner-mockup-with-space-photo.jpg"
            alt="Trusted"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // Ensure the image covers the container without stretching
              borderRadius: '0px',
              position: 'relative',
              zIndex: 0,
              transform: 'scaleX(-1)', // Flip the image horizontally
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
          alignItems: 'center',
          backgroundColor:'#E5E4E2'
        }}
      >
        <Box sx={{ flex: 1, paddingRight: { md: '20px' }, paddingBottom: { xs: '20px', md: '0' } }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'left' }}>Expert Diamond Valuation</h1>

          <Typography variant="h5" paragraph sx={{ color: '#666', marginBottom: '40px', textAlign: 'left', fontSize: '20px', lineHeight: '1.8' }}>
            With over 69 years of combined experience in the diamond industry, our team offers unparalleled expertise and insights. We utilize state-of-the-art technology and methodologies to ensure precise and accurate valuations.<br></br>
            <br></br> Our services are trusted by both industry leaders and private clients alike, underscoring our commitment to excellence and reliability.
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <img
            src="https://www.jewelrycult.com/wp-content/uploads/2016/02/jewelry-appraiser.jpg"
            alt="Why Choose Us"
            style={{
              width: '100%',
              height: '600px',
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
              height: '600px',
              marginTop: '80px',  // Increase the marginTop for higher height
              marginBottom: '80px',  // Increase the marginBottom for higher height
              borderRadius: '10px'
            }}
            data-aos="flip-left"
          />
        </Box>
        <Box sx={{ flex: 1, paddingLeft: { md: '20px' }, paddingBottom: { xs: '20px', md: '0' }, backgroundColor:'#E5E4E2' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'left', marginLeft: '40px' }}>Trusted Diamond Valuation</h1>
          <Typography
            // Adjust the variant to a smaller size, such as "body1" or "body2"
            paragraph
            sx={{
              color: '#666',
              marginBottom: '40px',
              marginLeft: '40px',
              textAlign: 'left',
              fontSize: '20px', // Custom font size adjustment
              lineHeight: '1.8'
            }}
          >
            Whether you are buying, selling, or insuring diamonds, DiamondShine provides the assurance you need through our rigorous and detailed valuation process.<br></br>
            <br></br>
            Our commitment to accuracy and reliability means you can trust us with your most valuable assets. We strive to deliver the highest standards of service and transparency, ensuring every client receives the best possible experience.
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
          alignItems: 'center',
          backgroundColor:'#E5E4E2'
        }}
      >
        <Box sx={{ flex: 1, paddingRight: { md: '20px' }, paddingBottom: { xs: '20px', md: '0' }, textAlign: 'left' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'left' }}>Discover DiamondScope</h1>
          <Typography variant="h5" paragraph sx={{ color: '#666', marginBottom: '40px', fontSize: '20px', lineHeight: '1.8' }}>
            At DiamondScope, we are dedicated to maintaining the trust and satisfaction of our clients. Our team's vast experience and use of advanced technology set us apart in the industry.<br></br>
            <br></br> By choosing DiamondShine, you are choosing a partner committed to excellence, reliability, and meticulous attention to detail in every valuation we perform.
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <img
            src="https://abrn.asia/ojs/public/journals/3/article_66_cover_en_US.jpg"
            alt="Why Choose Us"
            style={{
              width: '100%',
              height: '600px',
              marginTop: '50px',
              marginBottom: '40px',
              borderRadius: '10px'
            }}
            data-aos="flip-left"
          />
        </Box>
      </Box>
    </Box>
  </GuestLayout>
  );
};

export default AboutUsGuest;
