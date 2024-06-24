const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // Duration in minutes
  accuracy: { type: String, required: true }, // Accuracy percentage
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
