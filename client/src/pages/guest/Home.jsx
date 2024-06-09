// Client/src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import '../../App.css'; // Import your CSS file for styling
const Home = () => {
  return (
    <div className="home-container">
      <div className="banner">
        <h1>SAYGEXDIAMOND</h1>
      </div>

      <nav className="navbar">
        <ul>
          <li><Link to="/about-us-guest">ABOUT US</Link></li>
          <li><Link to="/consulting-services-guest">CONSULTING SERVICES</Link></li>
          <li><Link to="/valuation-tool">VALUATION TOOL</Link></li>
          <li><Link to="/login">SIGN IN</Link></li>
        </ul>
      </nav>

      {/* Rest of your home page content goes here */}
      {/* You can add sections for About Us, Consulting Services, etc. */}
    </div>
  );
};

export default Home;
