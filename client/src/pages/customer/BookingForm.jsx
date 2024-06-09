// Client/src/pages/BookingForm.jsx
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import "../../App.css";
import axios from "axios"; 
const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    phoneNumber: "",
    identityCard: "",
    address: "",
    date: "",
    time: "",
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [consultantId, setConsultantId] = useState(null); 

  useEffect(() => {
    // Fetch available consultant ID when the component mounts
    const fetchConsultantId = async () => {
      try {
        const response = await axios.get('/api/consultants/available');
        if (response.data.length > 0) {
          setConsultantId(response.data[0].userID); // Assuming first available consultant
        } else {
          toast.error("No consultants available at the moment.");
        }
      } catch (error) {
        console.error("Error fetching consultant ID:", error);
        toast.error("An error occurred while fetching consultants.");
      }
    };

    fetchConsultantId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phoneNumber, identityCard, address, date, time } = formData;

    if (!name || !email || !phoneNumber || !identityCard || !address || !date || !time) {
      toast.error("Please fill out all fields before booking.");
      return;
    }

    if (!consultantId) {
      toast.error("No consultant available. Please try again later.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          consultantId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Booking created successfully!");
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);

        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          identityCard: "",
          address: "",
          date: "",
          time: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.msg || "An error occurred while booking your appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("An error occurred while booking your appointment. Please try again.");
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="booking-form-container">
      <Toaster />
      <h2>Please fill out this form to book an appointment.</h2>
      <p>We need your contact information to confirm your booking.</p>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} /> {/* Added email field */}
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <input type="text" name="identityCard" placeholder="Identity Card" value={formData.identityCard} onChange={handleChange} />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={today}
        />
        <input type="time" name="time" min="09:00" max="17:00" value={formData.time} onChange={handleChange} />
        <button type="submit">BOOK</button>
      </form>

      {showConfirmation && (
        <div className="confirmation-message">
          Thank you for booking! We will call you back to confirm your appointment.
        </div>
      )}
    </div>
  );
};

export default BookingForm;
