import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import { toast } from 'react-hot-toast';
import CustomerLayout from '../../components/CustomerLayout';
const BlogListPageCustomer = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast.error('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <CustomerLayout>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Blogs
      </Typography>
      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid item xs={12} md={6} lg={4} key={blog._id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {blog.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  {blog.content.substring(0, 100)}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/blogs/${blog._id}`}>
                  Read More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    </CustomerLayout>
  );
};

export default BlogListPageCustomer;
