import React, { useState } from 'react';
import axios from 'axios';

const ValuationTool = () => {
    const [formData, setFormData] = useState({
        carat: '',
        cut: '',
        color: '',
        clarity: '',
        depth: '',
        table: '',
        x: '',
        y: '',
        z: ''
      });
    
      const [predictedPrice, setPredictedPrice] = useState(null);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:8000/predict-price', formData);
          setPredictedPrice(response.data.predicted_price);
        } catch (error) {
          console.error('Error predicting price:', error);
        }
      };
    
      return (
        <div>
          <h1>Diamond Price Predictor</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Carat:
              <input type="number" name="carat" value={formData.carat} onChange={handleChange} required />
            </label>
            <label>
              Cut:
              <input type="text" name="cut" value={formData.cut} onChange={handleChange} required />
            </label>
            <label>
              Color:
              <input type="text" name="color" value={formData.color} onChange={handleChange} required />
            </label>
            <label>
              Clarity:
              <input type="text" name="clarity" value={formData.clarity} onChange={handleChange} required />
            </label>
            <label>
              Depth:
              <input type="number" name="depth" value={formData.depth} onChange={handleChange} required />
            </label>
            <label>
              Table:
              <input type="number" name="table" value={formData.table} onChange={handleChange} required />
            </label>
            <label>
              X:
              <input type="number" name="x" value={formData.x} onChange={handleChange} required />
            </label>
            <label>
              Y:
              <input type="number" name="y" value={formData.y} onChange={handleChange} required />
            </label>
            <label>
              Z:
              <input type="number" name="z" value={formData.z} onChange={handleChange} required />
            </label>
            <button type="submit">Predict Price</button>
          </form>
          {predictedPrice !== null && (
            <div>
              <h2>Predicted Price: ${predictedPrice.toFixed(2)}</h2>
            </div>
          )}
        </div>
      );
    }

export default ValuationTool;