import {
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
const BlogDetailPageCustomer = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${blogId}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minheight: '100vh' }}>
        <Typography variant="h6" component="h2">No blog found</Typography>
      </Box>
    );
  }

  return (
    <CustomerLayout>
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '89%' }} />
      {/* Large background image */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: '400px',

        }}
      >
        <img
          src="https://jewelryinformer.com/wp-content/uploads/2023/10/diamond-color-1024x576-1.jpg"
          alt="Trusted"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '0px',
            position: 'relative',
            zIndex: 0,
            filter: 'brightness(50%)', 
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '40px',
            zIndex: 1,
            color: 'white',
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom style={{ fontFamily: 'Times New Roman', fontWeight: 'bold' }}>
          </Typography>
        </Box>
      </Box>

      {/* Small image on the right side */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          marginTop: '90px',
          marginLeft: '800px',
          marginRight: '20px',
          width: '350px',
          height: '450px',
          borderRadius: '0px',
          overflow: 'hidden',
        }}
      >
        <img
          src="https://i.ebayimg.com/images/g/lIwAAOSwomZkx5qF/s-l1600.jpg"
          alt="Small Image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', backgroundColor: 'white', p: 3, maxWidth: '740px', mx: 'auto', zIndex: 2, position: 'relative', marginTop: '-500px', marginLeft: '0px' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontFamily: 'Arial', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
          {blog.title.toUpperCase()}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {new Date(blog.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: 'Arial' }} dangerouslySetInnerHTML={{ __html: blog.content }}>
        </Typography>
      </Box>
    </CustomerLayout>
  );
};
export default BlogDetailPageCustomer;
