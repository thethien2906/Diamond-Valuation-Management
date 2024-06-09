// Client/src/pages/AddingForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button } from '@chakra-ui/react'
import { toast } from 'react-hot-toast'
//chakra ui components

const AddingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // Default role is "user"
  });
  // const [role, setRole] = useState('user')

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/users", formData); // Change the route to "/api/users"
      navigate("/admin/staff");
    } catch (error) {
      console.error("Error adding user:", error);
      // Handle errors here (display an error message to the user)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while adding the user.");
      }
    }
  };

  return (
    <div className="mt-5">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="my-3">
          <label htmlFor="name">Name:</label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            size='md'
            className="w-50"
          />
        </div>

        <div className="my-3">
          <label htmlFor="email">Email:</label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            size='md'
            className="w-50"
          />
        </div>

        <div className="my-3">
          <label htmlFor="password">Password:</label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            size='md'
            className="w-50"
          />
        </div>

        <div className="my-3">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-50"
          >
            
            <option value="consultant">consultant</option>
            <option value="appraiser">appraiser</option>
            <option value="manager">manager</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <Button colorScheme='blue' type="submit">Add</Button>
      </form>
    </div>
  );
};

export default AddingForm;

