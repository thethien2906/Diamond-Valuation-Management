import React, { useState, useEffect, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { UserContext } from "../../context/userContext"; // Import the user context

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
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Use the user context to get the current user

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

    if (!user) {
      toast.error("User not logged in. Please log in to book an appointment.");
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
          customerId: user._id, // Include userId in the booking data
        }),
      });

      if (response.ok) {
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

  const handleNavigateBack = () => {
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="sm">
      <Toaster />
      <Box sx={{ mt: 8, mb: 4 }}>
        <IconButton onClick={handleNavigateBack} sx={{ position: 'absolute', left: 50, top: 50 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: "center" }}>
          Please fill out this form to book an appointment.
        </Typography>
        <Typography variant="body1" paragraph sx={{ textAlign: "center" }}>
          We need your contact information to confirm your booking.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Identity Card"
            name="identityCard"
            value={formData.identityCard}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: today }}
            fullWidth
          />
          <TextField
            label="Time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: "09:00", max: "17:00" }}
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            BOOK
          </Button>
        </Box>
        {showConfirmation && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" color="primary" sx={{ textAlign: "center" }}>
              Thank you for booking! We will call you back to confirm your appointment.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default BookingForm;
