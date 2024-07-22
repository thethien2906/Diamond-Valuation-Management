import {
  Box,
  Button,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import GuestLayout from "../../components/GuestLayout"; // Adjust the path as needed

const BlogListPage = () => {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <GuestLayout >
<Box sx={{ position: 'absolute', width: '100%', minHeight: '100vh', backgroundColor: 'white' }} />

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
    marginTop: '60px',
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

{/* Blog posts */}
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    backgroundColor: 'white',
    p: 3,
    maxWidth: '740px',
    mx: 'auto',
    zIndex: 2,
    position: 'relative',
    marginTop: '-450px',
    marginLeft: '0px',
  }}
>
  {blogs.map((blog) => (
    <React.Fragment key={blog._id}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          mb: 0, // Reduced margin-bottom
          p: 2,
          
          borderRadius: '8px',
          backgroundColor: '#fff'
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: '100%', sm: '120px' },
            height: '120px',
            mb: { xs: 2, sm: 0 },
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <img
            src={blog.imageUrl}
            alt={blog.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'inherit'
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1, ml: { sm: 2 } }}>
          <CardContent sx={{ p: 0 }}>
          <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#033F63', fontFamily:"Times New Roman" }}
            >
              {blog.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom sx={{ lineHeight: 0 }}>
              {new Date(blog.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 0.5 }} dangerouslySetInnerHTML={{ __html: blog.content.substring(0, 100) + '...' }}>
            </Typography>
          </CardContent>
          <CardActions sx={{ p: 0, mt: 2 }}>
            <Button
              size="small"
              component={Link}
              to={`/blogs/${blog._id}`}
              sx={{
                backgroundColor: '#033F63',
                color: '#ffffff',
                padding: '6px 12px',
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#025b8a',
                },
              }}
            >
              Read More
            </Button>
          </CardActions>
        </Box>
      </Box>
      <Divider sx={{ width: '100%' }} />
    </React.Fragment>
  ))}
</Box>
    </GuestLayout>
  );
};
export default BlogListPage;
