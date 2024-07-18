import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const stripePromise = loadStripe("pk_test_51PV2aGRx0XBTHEAYZABfhKcLlLs2bnM370uuzHyLBJzXvisiF7KHMxR8oEokE7cdPexsyw6SoV4PiB7ASJfgJo5u00gnrG8Oxe");

const BookingForm = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: "",
    address: "",
    date: "",
    time: "",
  });
  const [serviceId, setServiceId] = useState("");
  const [consultantId, setConsultantId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name,
        email: user.email,
      }));
    }

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
  }, [location.search, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phoneNumber, address, date, time } = formData;

    if (!name || !email || !phoneNumber || !address || !date || !time || !serviceId) {
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
    navigate("/home");
  };

  return (
    <Box sx={{ backgroundColor: '#121212', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Toaster />
      <Container maxWidth="sm" sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ mt: 8, mb: 4, width: '100%', position: 'relative' }}>
          <IconButton onClick={handleNavigateBack} sx={{ position: 'absolute', left: 50, top: 50 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: "center", color: '#FFFFFF' }}>
            Please fill out this form to book an appointment.
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: "center", color: '#B0C4DE' }}>
            We need your contact information to confirm your booking.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                style: { color: '#B0C4DE' }, // Light blue text for the label
              }}
              InputProps={{
                style: { color: '#FFFFFF' }, // White text
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#B0C4DE', // Light blue border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#00BFFF', // Fluorescent blue border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00BFFF', // Fluorescent blue border color when focused
                  },
                  '&.Mui-disabled fieldset': {
                    borderColor: '#B0C4DE', // Light blue border color when disabled
                  },
                },
                '&:-webkit-autofill': {
WebkitBoxShadow: '0 0 0 30px #121212 inset !important', // Maintain dark background on autofill
                  WebkitTextFillColor: '#FFFFFF !important', // White text on autofill
                },
              }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                style: { color: '#B0C4DE' }, // Light blue text for the label
              }}
              InputProps={{
                style: { color: '#FFFFFF' }, // White text
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#B0C4DE', // Light blue border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#00BFFF', // Fluorescent blue border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00BFFF', // Fluorescent blue border color when focused
                  },
                  '&.Mui-disabled fieldset': {
                    borderColor: '#B0C4DE', // Light blue border color when disabled
                  },
                },
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 30px #121212 inset !important', // Maintain dark background on autofill
                  WebkitTextFillColor: '#FFFFFF !important', // White text on autofill
                },
              }}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                style: { color: '#B0C4DE' }, // Light blue text for the label
              }}
              InputProps={{
                style: { color: '#FFFFFF' }, // White text
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#B0C4DE', // Light blue border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#00BFFF', // Fluorescent blue border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00BFFF', // Fluorescent blue border color when focused
                  },
                  '&.Mui-disabled fieldset': {
                    borderColor: '#B0C4DE', // Light blue border color when disabled
                  },
                },
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 30px #121212 inset !important', // Maintain dark background on autofill
                  WebkitTextFillColor: '#FFFFFF !important', // White text on autofill
                },
}}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                style: { color: '#B0C4DE' }, // Light blue text for the label
              }}
              InputProps={{
                style: { color: '#FFFFFF' }, // White text
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#B0C4DE', // Light blue border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#00BFFF', // Fluorescent blue border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00BFFF', // Fluorescent blue border color when focused
                  },
                  '&.Mui-disabled fieldset': {
                    borderColor: '#B0C4DE', // Light blue border color when disabled
                  },
                },
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 30px #121212 inset !important', // Maintain dark background on autofill
                  WebkitTextFillColor: '#FFFFFF !important', // White text on autofill
                },
              }}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
InputLabelProps={{ shrink: true, style: { color: '#B0C4DE' } }} // White label text color
              inputProps={{
                min: today,
                style: { color: '#B0C4DE' } // White input text color
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#B0C4DE', // Light blue border color
                  },
                  '&:hover fieldset': {
                    borderColor: '#00BFFF', // Fluorescent blue border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00BFFF', // Fluorescent blue border color when focused
                  },
                  '&.Mui-disabled fieldset': {
                    borderColor: '#00BFFF', // White border color when disabled
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFFFFF', // White text color
                  },
                },
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 30px #121212 inset !important', // Maintain dark background on autofill
                  WebkitTextFillColor: '#FFFFFF !important', // White text on autofill
                },
              }}
            />
            <TextField
              label="Appointment Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true, style: { color: '#B0C4DE' } }}
              inputProps={{ style: { color: '#FFFFFF' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#B0C4DE',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00BFFF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00BFFF',
                  },
                },
              }}
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
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
    </Box>
  );
};

export default BookingForm;