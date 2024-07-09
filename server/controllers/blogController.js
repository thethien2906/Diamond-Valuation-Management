// controllers/blogController.js
const Blog = require('../models/Blog');

// Create a new blog post
const createBlog = async (req, res) => {
  try {
    const { title, content, author, imageUrl } = req.body;

    const newBlog = new Blog({
      title,
      content,
      author,
      imageUrl, // Include imageUrl in the new blog creation
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a blog post by ID
const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, content, imageUrl } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, content, imageUrl, updatedAt: Date.now() }, // Include imageUrl in update
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all blog posts
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name email').sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single blog post by ID
const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId).populate('author', 'name email');
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a blog post by ID
const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
};
