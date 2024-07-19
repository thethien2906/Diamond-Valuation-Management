import {
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GuestLayout from "../../components/GuestLayout"; // Adjust the path as needed

const BlogDetailPage = () => {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" component="h2">No blog found</Typography>
      </Box>
    );
  }

  return (
    <GuestLayout sx={{ backgroundColor: '#f0f0f0' }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100vh', backgroundColor: 'white' }} />
      <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto'}}>
        <Typography variant="h4" component="h2" gutterBottom>
          Blog Details
        </Typography>
      </Box>
      <Box sx={{ flex: 1, height: '350px', overflow: 'hidden', zIndex: 0, marginTop: '-103px', marginLeft: '-99px', marginRight: '-98px' }}>
        <img
          src={blog.imageUrl || "https://jewelryinformer.com/wp-content/uploads/2023/10/diamond-color-1024x576-1.jpg"}
          alt={blog.title}
          style={{
            width: '100%',
            height: '90%',
            objectFit: 'cover',
            borderRadius: '0px',
            position: 'relative',
            zIndex: 0,
            filter: 'brightness(50%)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            marginLeft:'20px',
            marginTop:'-70px',
            bottom: '20px',
            left: '20px',
            zIndex: 1,
            color: 'white',
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom style={{ fontFamily: 'Times New Roman', fontWeight: 'bold' }}>
            Blogs
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
          src="https://cdn.shopify.com/s/files/1/0242/8908/3447/files/Screen_Shot_2021-06-01_at_10.18.35_AM_480x480.png?v=1622567961"
          alt="Small Image"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'left', backgroundColor: 'white', p: 3, maxWidth: '740px', mx: 'auto', zIndex: 2, position: 'relative', marginTop: '-500px', marginLeft: '0px' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontFamily: 'Times New Roman, Times, serif', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
          {blog.title.toUpperCase()}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {new Date(blog.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: 'Times New Roman' }} dangerouslySetInnerHTML={{ __html: blog.content }}>
        </Typography>
      </Box>
    </GuestLayout>
  );
};

export default BlogDetailPage;
