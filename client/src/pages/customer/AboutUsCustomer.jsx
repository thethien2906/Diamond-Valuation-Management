// Client/src/pages/AboutUs.jsx
import React from "react";
import '../../App.css'
import CustomerLayout from "../../components/CustomerLayout";
const AboutUsCustomer = () => {
   
  return (
    <CustomerLayout> 
    <div className="about-us-container">
        
      <section className="about-saygex">
        <h2>ABOUT SAYGEX:</h2>
        <p>
          We are the best, if you do not believe that we are not the best, you are
          not the best.
        </p>
      </section>

      <section className="our-mission">
        <h2>OUR MISSION:</h2>
        <p>Make us richer, Make you poorer.</p>
      </section>

      <section className="why-us">
        <h2>WHY US:</h2>
        <ul>
          <li>69 years experience.</li>
          <li>Messi is our VIP member.</li>
          <li>Why not?</li>
        </ul>
      </section>
    </div>
    </CustomerLayout>
  );
};

export default AboutUsCustomer;
