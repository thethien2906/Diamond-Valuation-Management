import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { UserContext } from '../../context/userContext';

const BlogCRUD = () => {
  const { user } = useContext(UserContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    content: '',
    author: user ? user._id : '',
    imageUrl: '', // Added imageUrl field
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editBlogId, setEditBlogId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };  


  const handleContentChange = (value) => {
    setForm({ ...form, content: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdate(editBlogId);
    } else {
      try {
        const response = await axios.post('/api/blogs', { ...form, author: user._id });
        setBlogs([response.data, ...blogs]);
        setForm({ title: '', content: '', author: user.name, imageUrl: '' });
        toast.success('Blog created successfully');
      } catch (error) {
        console.error('Error creating blog:', error);
        toast.error('Error creating blog');
      }
    }
  };

  const handleEdit = (blog) => {
    setIsEditing(true);
    setEditBlogId(blog._id);
    setForm({
      title: blog.title,
      content: blog.content,
      imageUrl: blog.imageUrl,
      author: blog.author,
    });
  };


  const handleUpdate = async (blogId) => {
    try {
      const response = await axios.put(`/api/blogs/${blogId}`, form);
      setBlogs(blogs.map((blog) => (blog._id === blogId ? response.data : blog)));
      setIsEditing(false);
      setEditBlogId(null);
      setForm({ title: '', content: '', author: user.name, imageUrl: '' });
      toast.success('Blog updated successfully');
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Error updating blog');
    }
  };

  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`/api/blogs/${blogId}`);
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
      toast.success('Blog deleted successfully');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Error deleting blog');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Manage Blogs
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Image URL"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <ReactQuill
          value={form.content}
          onChange={handleContentChange}
          theme="snow"
          modules={{
            toolbar: [
              [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
              [{ size: [] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
              ['link', 'image', 'video'],
              [{ 'align': [] }],
              ['clean']
            ],
          }}
          formats={[
            'header', 'font', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image', 'video',
            'align'
          ]}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          {isEditing ? 'Update Blog' : 'Create Blog'}
        </Button>
      </Box>
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
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEdit(blog)}>
                  Edit
                </Button>
                <Button size="small" color="secondary" onClick={() => handleDelete(blog._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BlogCRUD;
