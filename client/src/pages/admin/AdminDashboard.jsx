import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { UserContext } from "../../context/userContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { user } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("user"); 
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleViewUsers = () => {
    navigate("/admin/users");  // Navigate to your user management page
  };
  const handleViewStaff = () => {
    navigate("/admin/staff"); 
  };


  return (
    <div>
      <h2>Welcome to the Admin Dashboard</h2>
      {!!user && <h2>Hello {user.role}</h2>}
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleViewUsers}>View Users</button> {/* New Button */}
      <button onClick={handleViewStaff}>View Staff</button>
    </div>
  );
};

export default AdminDashboard;
