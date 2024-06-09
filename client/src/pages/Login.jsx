
import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../context/userContext"; 
import { Link } from 'react-router-dom'
export default function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", data); // Updated path to '/auth/login'
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        navigateToDashboard(response.data.role);
      }
    } catch (error) {
      console.error("Login error:", error);
      // Handle errors appropriately, e.g., display an error message to the user
      if (error.response && error.response.data) {
        toast.error(error.response.data.error || "An error occurred during login.");
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  const navigateToDashboard = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "consultant":
        navigate("/consultant");
        break;
      case "appraiser":
        navigate("/appraiser");
        break;
      case "manager":
        navigate("/manager");
        break;
      default:
        navigate("/dashboard");
    }
  };

  useEffect(() => {
    if (user) {
      navigateToDashboard(user.role);
    }
  }, [user]);
  // useEffect(() => {
  //   // Check for user data in localStorage on component mount/page refresh
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     const userObject = JSON.parse(storedUser);
  //     setUser(userObject); // Update the UserContext with the retrieved user
  //     navigateToDashboard(userObject.role); // Redirect if user data is found
  //   }
  // }, []);
  return (
    <div>
      <form onSubmit={loginUser}>
        <label>Email</label>
        <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
        <label>Password</label>
        <input type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
        <button type='submit'>Login</button>
        <Link to="/register">Don't have an account? Register</Link>
      </form>
    </div>
  )
}
