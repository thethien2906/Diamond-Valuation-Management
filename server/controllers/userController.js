const User = require('../models/User');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAvailableConsultant = async (req, res) => {
  try {
    const consultant = await User.findOne({ role: "consultant" });
    if (!consultant) {
      return res.status(404).json({ error: 'No consultant available' });
    } else {
      return res.json([consultant]);
    }
  } catch (error) {
    console.error("Error fetching available consultant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAvailableAppraiser = async (req, res) => {
  try {
    const consultant = await User.findOne({ role: "Appraiser" });
    if (!consultant) {
      return res.status(404).json({ error: 'No consultant available' });
    } else {
      return res.json([consultant]);
    }
  } catch (error) {
    console.error("Error fetching available consultant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, phoneNumber, address, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update user information
    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;

    // Update password if provided
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateStaffById = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10); // Hash the new password
    if (role) user.role = role;

    await user.save();

    res.send('User updated successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
};

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  getAvailableConsultant,
  getAvailableAppraiser,
  getUserById,
  updateUserById,
  updateStaffById
};
