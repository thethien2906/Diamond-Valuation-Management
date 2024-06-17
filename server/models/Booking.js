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
        enum: ['pending', 'approved', 'rejected'], // Possible statuse
        default: 'pending' // Default status is 'pending'
      },
      consultantId: {
        type: Schema.Types.ObjectId, // Store the consultant's ObjectId
        ref: 'User',               // Reference to the User model
        default: null,             // Set to null initially (unassigned)
      },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
