const mongoose = require('mongoose');
const { Schema } = mongoose;
const receiptSchema = new mongoose.Schema({
  receiptNumber: { type: String, unique: true, required: true }, // Auto-generated or sequential number
  issueDate: { type: Date, default: Date.now },
  customerName: { type: String, required: true },
  phone: { 
    type: String, 
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); // Example: validate for 10 digit phone number
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: { 
    type: String, 
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Simple email regex validation
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  consultantId: {
    type: Schema.Types.ObjectId, // Store the consultant's ObjectId
    ref: 'User',               // Reference to the User model
    default: null,             // Set to null initially (unassigned)
  },
  services: { 
    type: String,
    enum: ['Service 1', 'Service 2', 'Service 3'],  // Your 3 service options
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Method 1', 'Method 2'],  // Your 2 payment method options
    required: true
  },
  amountPaid: { type: Number, required: true }
});

// Indexes for frequent queries
receiptSchema.index({ receiptNumber: 1 });
receiptSchema.index({ customerName: 1 });
receiptSchema.index({ appointmentDate: 1 });

// Pre-save hook to generate sequential receipt numbers
receiptSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Logic to generate sequential receipt number
    this.receiptNumber = await generateSequentialNumber();
  }
  next();
});

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;
