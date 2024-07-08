import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Grid, 
  FormControl, 
  Slider, 
  TextField, 
  Typography 
} from '@mui/material';
import CustomerLayout from '../../components/CustomerLayout';
const ValuationTool = () => {
  const [formData, setFormData] = useState({
    carat: 0.5,
    cut: '',
    color: '',
    clarity: '',
    depth: '',
    table: 60,
    x: '',
    y: '',
    z: ''
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSliderChange = (name) => (e, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCutChange = (value) => {
    setFormData({ ...formData, cut: value });
  };

  const handleColorChange = (value) => {
    setFormData({ ...formData, color: value });
  };

  const handleClarityChange = (value) => {
    setFormData({ ...formData, clarity: value });
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.x <= 0) {
      newErrors.x = 'X must be greater than 0';
    }
    if (formData.y <= 0) {
      newErrors.y = 'Y must be greater than 0';
    }
    if (formData.z <= 0) {
      newErrors.z = 'Z must be greater than 0';
    }
    if (!formData.cut) {
      newErrors.cut = 'Please select a cut';
    }
    if (!formData.color) {
      newErrors.color = 'Please select a color';
    }
    if (!formData.clarity) {
      newErrors.clarity = 'Please select a clarity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const depth = (2 * parseFloat(formData.z)) / (parseFloat(formData.x) + parseFloat(formData.y));
    try {
      const response = await axios.post('http://localhost:8000/predict-price', { ...formData, depth });
      setPredictedPrice(response.data.predicted_price);
    } catch (error) {
      console.error('Error predicting price:', error);
    }
  };

  return (
    <CustomerLayout>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Diamond Price Predictor
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Typography gutterBottom>Carat</Typography>
              <Slider
                value={formData.carat}
                min={0.1}
                max={10}
                step={0.1}
                onChange={handleSliderChange('carat')}
                valueLabelDisplay="auto"
              />
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Typography gutterBottom>Cut</Typography>
              {['Ideal', 'Premium', 'Good', 'Very Good', 'Fair'].map((cut) => (
                <Button
                  key={cut}
                  variant={formData.cut === cut ? 'contained' : 'outlined'}
                  onClick={() => handleCutChange(cut)}
                  sx={{ mr: 1, mb: 1 }}
                >
                  {cut}
                </Button>
              ))}
              {errors.cut && <Typography color="error">{errors.cut}</Typography>}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <Typography gutterBottom>Color</Typography>
              {['E', 'I', 'J', 'H', 'F', 'G', 'D'].map((color) => (
                <Button
                  key={color}
                  variant={formData.color === color ? 'contained' : 'outlined'}
                  onClick={() => handleColorChange(color)}
                  sx={{ mr: 1, mb: 1 }}
                >
                  {color}
                </Button>
              ))}
              {errors.color && <Typography color="error">{errors.color}</Typography>}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <Typography gutterBottom>Clarity</Typography>
              {['SI2', 'SI1', 'VS1', 'VS2', 'VVS2', 'VVS1', 'I1', 'IF'].map((clarity) => (
                <Button
                  key={clarity}
                  variant={formData.clarity === clarity ? 'contained' : 'outlined'}
                  onClick={() => handleClarityChange(clarity)}
                  sx={{ mr: 1, mb: 1 }}
                >
                  {clarity}
                </Button>
              ))}
              {errors.clarity && <Typography color="error">{errors.clarity}</Typography>}
            </FormControl>

            <TextField
              label="X"
              name="x"
              type="number"
              value={formData.x}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              error={Boolean(errors.x)}
              helperText={errors.x}
            />

            <TextField
              label="Y"
              name="y"
              type="number"
              value={formData.y}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              error={Boolean(errors.y)}
              helperText={errors.y}
            />

            <TextField
              label="Z"
              name="z"
              type="number"
              value={formData.z}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              error={Boolean(errors.z)}
              helperText={errors.z}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <Typography gutterBottom>Table</Typography>
              <Slider
                value={formData.table}
                min={40}
                max={100}
                step={1}
                onChange={handleSliderChange('table')}
                valueLabelDisplay="auto"
              />
            </FormControl>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Predict Price
            </Button>
          </form>
        </Grid>

        <Grid item xs={12} md={6}>
          {predictedPrice !== null && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5">
                Predicted Price: ${predictedPrice.toFixed(2)}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
    </CustomerLayout>
  );
};

export default ValuationTool;
