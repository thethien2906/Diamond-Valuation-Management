import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import GuestLayout from '../../components/GuestLayout';
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" component="h2">No blog found</Typography>
      </Box>
    );
  }

  return (
    <CustomerLayout>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {blog.title}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {new Date(blog.createdAt).toLocaleDateString()}
      </Typography>
      <Typography variant="body1">
        {blog.content}
      </Typography>
    </Box>
    </CustomerLayout>
  );
};

export default BlogDetailPageCustomer;
