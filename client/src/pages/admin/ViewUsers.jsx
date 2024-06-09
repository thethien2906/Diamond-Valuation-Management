// Client/src/pages/ViewUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users"); 
        const filteredUsers = response.data.filter(user => user.role === "user"); 
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const handleDeleteUser = async (userId) => {
    try {
      // Send a DELETE request to your backend to delete the user
      await axios.delete(`/api/users/${userId}`);

      // Update the state to remove the deleted user from the list
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUsers;
