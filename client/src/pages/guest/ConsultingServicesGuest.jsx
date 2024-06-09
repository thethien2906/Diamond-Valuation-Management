// Client/src/pages/ConsultingServices.jsx
import React from "react";
import '../../App.css'
import GuestLayout from "../../components/GuestLayout";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
// Client/src/pages/ConsultingServices.jsx

const ConsultingServicesGuest = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const handleBookAppointment = () => {
    if (user) { // Check if user is logged in
      navigate("/booking");
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }  // Navigate to your user management page
  };
  return (
    <GuestLayout>
      <div className="tiers-container">
        {/* Unstoppable! Tier */}
        <div className="tier">
          <h3>Unstoppable!</h3>
          <p>Price: $6.9</p>
          <p>Consultant: Male</p>
          <p>Duration: Moderate</p>
          <p>Accuracy: High</p>
          <button onClick={handleBookAppointment}>Book Appointment</button>
        </div>

        {/* Godlike! Tier */}
        <div className="tier">
          <h3>Godlike!</h3>
          <p>Price: $69.69</p>
          <p>Consultant: Male/Female</p>
          <p>Duration: Fast</p>
          <p>Accuracy: Higher</p>
          <button onClick={handleBookAppointment}>Book Appointment</button>
        </div>

        {/* Legendary! Tier */}
        <div className="tier">
          <h3>Legendary!</h3>
          <p>Price: $696.9</p>
          <p>Consultant: Male/Female/Bisexual/Trans/Gay/Les</p>
          <p>Duration: Need for Speed</p>
          <p>Accuracy: $1,000 with "aimbot"</p>
          <button onClick={handleBookAppointment}>Book Appointment</button>
        </div>
      </div>

      <p className="call-to-action">
        Unlock the true value of your diamonds with our personalized guidance.
      </p>
    </GuestLayout>
  );
};

export default ConsultingServicesGuest;
