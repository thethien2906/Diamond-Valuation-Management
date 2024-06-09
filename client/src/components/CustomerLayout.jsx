import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import "../App.css"; // Reuse the CSS styles from Home.jsx

const CustomerLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("user");
      navigate("/"); // Redirect to the homepage or any other desired page
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout errors here if needed
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="home-container">
      <div className="banner">
        <h1>SAYGEXDIAMOND</h1>
      </div>

      <nav className="navbar">
        <ul>
          <li><Link to="/about-us-customer">ABOUT US</Link></li>
          <li><Link to="/consulting-services-customer">CONSULTING SERVICES</Link></li>
          <li><Link to="/valuation-tool">VALUATION TOOL</Link></li>
          <li><button onClick={handleLogout}>SIGN OUT</button></li>
        </ul>
      </nav>

      <div className="content">{children}</div>
    </div>
  );
};

export default CustomerLayout;
