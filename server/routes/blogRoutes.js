// routes/blogRoutes.js
const express = require('express');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

const router = express.Router();

// Create a new blog post
router.post('/blogs', createBlog);

// Get all blog posts
router.get('/blogs', getAllBlogs);

// Get a single blog post by ID
router.get('/blogs/:blogId', getBlogById);

// Update a blog post by ID
router.put('/blogs/:blogId', updateBlog);

// Delete a blog post by ID
router.delete('/blogs/:blogId', deleteBlog);

module.exports = router;
