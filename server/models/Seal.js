const mongoose = require('mongoose');
const { Schema } = mongoose;

const sealSchema = new Schema({
  recordId: {
    type: Schema.Types.ObjectId,
    ref: 'ValuationRecord',
    required: true
  },
  customerName: { type: String, required: true },
  reason: { type: String, required: true },
  notes: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  consultantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

const Seal = mongoose.model('Seal', sealSchema);

module.exports = Seal;
