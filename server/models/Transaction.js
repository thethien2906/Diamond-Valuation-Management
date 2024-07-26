const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  created: { type: Date, default: Date.now }, 
  time: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
  },
  paymentMethod: { type: String },                     
  paymentStatus: { type: String },
});

module.exports = mongoose.model('Transaction', transactionSchema);
