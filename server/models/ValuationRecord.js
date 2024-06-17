const mongoose = require('mongoose');
const { Schema } = mongoose;

const valuationRecordSchema = new Schema({
  recordNumber: { type: String, unique: true, required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  services: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  consultantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  appraiserId: { type: Schema.Types.ObjectId, ref: 'User' },
  shapeAndCut: { type: String },
  caratWeight: { type: Number },
  clarity: { type: String },
  cutGrade: { type: String },
  measurements: { type: String },
  polish: { type: String },
  symmetry: { type: String },
  fluorescence: { type: String },
  estimatedValue: { type: Number },
  valuationMethod: { type: String },
  certificateNumber: { type: String },
  status: { type: String, enum: ['In Progress', 'Completed','Sealed','Picked Up'], default: 'In Progress' }
});

const ValuationRecord = mongoose.model('ValuationRecord', valuationRecordSchema);

module.exports = ValuationRecord;
