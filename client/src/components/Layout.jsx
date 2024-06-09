// Client/src/components/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Reuse the CSS styles from Home.jsx

const Layout = ({ children }) => {
  return (
    <div className="home-container">
      <div className="banner">
        <h1>SAYGEXDIAMOND</h1>
      </div>

      <nav className="navbar">
        <ul>
          <li><Link to="/about-us">ABOUT US</Link></li>
          <li><Link to="/consulting-services">CONSULTING SERVICES</Link></li>
          <li><Link to="/valuation-tool">VALUATION TOOL</Link></li>
          <li><Link to="/login">SIGN IN</Link></li>
        </ul>
      </nav>

      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
