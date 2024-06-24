const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');
const receiptSchema = new Schema({
  receiptNumber: { type: String, unique: true, required: true , default: uuidv4}, // Auto-generated or sequential number
  issueDate: { type: Date, default: Date.now },
  customerName: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  consultantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  
  
});

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
