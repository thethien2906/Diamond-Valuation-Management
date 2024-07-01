import React, { useState } from 'react';
import axios from 'axios';

const ValuationTool = () => {
  const [formData, setFormData] = useState({
    carat: '',
    cut: 'Fair',
    color: 'D',
    clarity: 'I1',
    depth: '',
    table: '',
    x: '',
    y: '',
    z: ''
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/predict', formData);
      setPrediction(response.data.price);
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  return (
    <div>
      <h1>Diamond Price Prediction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Carat:</label>
          <input type="number" step="0.01" name="carat" value={formData.carat} onChange={handleChange} required />
        </div>
        <div>
          <label>Cut:</label>
          <select name="cut" value={formData.cut} onChange={handleChange}>
            <option value="Fair">Fair</option>
            <option value="Good">Good</option>
            <option value="Very Good">Very Good</option>
            <option value="Premium">Premium</option>
            <option value="Ideal">Ideal</option>
          </select>
        </div>
        <div>
          <label>Color:</label>
          <select name="color" value={formData.color} onChange={handleChange}>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="H">H</option>
            <option value="I">I</option>
            <option value="J">J</option>
          </select>
        </div>
        <div>
          <label>Clarity:</label>
          <select name="clarity" value={formData.clarity} onChange={handleChange}>
            <option value="I1">I1</option>
            <option value="SI2">SI2</option>
            <option value="SI1">SI1</option>
            <option value="VS2">VS2</option>
            <option value="VS1">VS1</option>
            <option value="VVS2">VVS2</option>
            <option value="VVS1">VVS1</option>
            <option value="IF">IF</option>
          </select>
        </div>
        <div>
          <label>Depth:</label>
          <input type="number" step="0.01" name="depth" value={formData.depth} onChange={handleChange} required />
        </div>
        <div>
          <label>Table:</label>
          <input type="number" step="0.01" name="table" value={formData.table} onChange={handleChange} required />
        </div>
        <div>
          <label>X:</label>
          <input type="number" step="0.01" name="x" value={formData.x} onChange={handleChange} required />
        </div>
        <div>
          <label>Y:</label>
          <input type="number" step="0.01" name="y" value={formData.y} onChange={handleChange} required />
        </div>
        <div>
          <label>Z:</label>
          <input type="number" step="0.01" name="z" value={formData.z} onChange={handleChange} required />
        </div>
        <button type="submit">Predict Price</button>
      </form>
      {prediction !== null && (
        <div>
          <h2>Predicted Price: ${prediction.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
}

export default ValuationTool;