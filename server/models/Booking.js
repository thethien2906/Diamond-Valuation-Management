const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  identityCard: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'done', 'completed'], // Possible statuses
    default: 'pending' // Default status is 'pending'
  },
  consultantId: {
    type: Schema.Types.ObjectId, // Store the consultant's ObjectId
    ref: 'User', // Reference to the User model
    default: null, // Set to null initially (unassigned)
  },
  customerId: {
    type: Schema.Types.ObjectId, // Store the user's ObjectId
    ref: 'User', // Reference to the User model
    default: null, // Set to null initially (unassigned)
  },
  serviceId: {
    type: Schema.Types.ObjectId, // Store the service's ObjectId
    ref: 'Service', // Reference to the Service model
    required: true, // Make this field required
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'], // Possible statuses
    default: 'Pending' // Default status is 'pending'
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
