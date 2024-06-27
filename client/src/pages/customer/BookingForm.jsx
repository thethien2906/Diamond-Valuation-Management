import React, { useState, useEffect, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { IconButton } from "@mui/material";
import { UserContext } from "../../context/userContext";

const stripePromise = loadStripe("pk_test_51PV2aGRx0XBTHEAYZABfhKcLlLs2bnM370uuzHyLBJzXvisiF7KHMxR8oEokE7cdPexsyw6SoV4PiB7ASJfgJo5u00gnrG8Oxe");

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
  const [serviceId, setServiceId] = useState("");
  const [consultantId, setConsultantId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setServiceId(queryParams.get("serviceId"));

    const fetchConsultantId = async () => {
      try {
        const response = await axios.get('/api/consultants/available');
        if (response.data.length > 0) {
          setConsultantId(response.data[0].userID);
        } else {
          toast.error("No consultants available at the moment.");
        }
      } catch (error) {
        console.error("Error fetching consultant ID:", error);
        toast.error("An error occurred while fetching consultants.");
      }
    };

    fetchConsultantId();
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phoneNumber, identityCard, address, date, time } = formData;

    if (!name || !email || !phoneNumber || !identityCard || !address || !date || !time || !serviceId) {
      toast.error("Please fill out all fields before booking.");
      return;
    }

    if (!consultantId) {
      toast.error("No consultant available. Please try again later.");
      return;
    }

    try {
      const response = await axios.post('/api/bookings', {
        ...formData,
        consultantId,
        customerId: user._id,
        serviceId,
      });

      if (response.status === 201) {
        toast.success("Booking created successfully!");

        const stripe = await stripePromise;
        const checkoutSession = await axios.post('/api/create-checkout-session', {
          bookingId: response.data.booking._id,
        });

        const result = await stripe.redirectToCheckout({
          sessionId: checkoutSession.data.id,
        });

        if (result.error) {
          console.error("Error redirecting to checkout:", result.error.message);
          toast.error("An error occurred while redirecting to payment. Please try again.");
        }
      } else {
        toast.error("An error occurred while booking your appointment. Please try again.");
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
              Thank you for booking!
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default BookingForm;
