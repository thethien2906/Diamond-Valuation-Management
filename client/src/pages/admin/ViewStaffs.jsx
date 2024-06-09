// Client/src/pages/ViewStaff.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ViewStaff = () => {
  const [staff, setStaff] = useState([]);
const navigate = useNavigate();
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("/api/users");
        // Filter for users with roles that are NOT "user"
        const filteredStaff = response.data.filter(user => user.role !== "user");
        setStaff(filteredStaff);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  const handleDeleteStaff = async (staffId) => {
    try {
      await axios.delete(`/api/users/${staffId}`);
      setStaff(staff.filter(staff => staff._id !== staffId));
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };
  const handleAddUser = () => {
    navigate("/admin/add-user"); // Navigate to the adding form page
  };

  return (
    <div>
      <h2>Staff List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map(staffMember => (
            <tr key={staffMember._id}>
              <td>{staffMember.name}</td>
              <td>{staffMember.email}</td>
              <td>{staffMember.role}</td>
              <td>
                <button onClick={() => handleDeleteStaff(staffMember._id)}>
                  Delete
                </button>
                
              </td>
            </tr>
          ))}
                <button onClick={handleAddUser}>Add User</button>  {/* New Add Button */}

        </tbody>
      </table>
    </div>
  );
};

export default ViewStaff;
