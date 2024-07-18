const mongoose = require('mongoose');
const { Schema } = mongoose;
const actionSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  action: { type: String, required: true }
});
const valuationRecordSchema = new Schema({
  recordNumber: { type: String, unique: true, required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  receiptId: { type: Schema.Types.ObjectId, ref: 'Receipt', required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  consultantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  appraiserId: { type: Schema.Types.ObjectId, ref: 'User' },
  shapeAndCut: { type: String },
  caratWeight: { type: mongoose.SchemaTypes.Decimal },
  clarity: { type: String },
  cutGrade: { type: String },
  colour: { type: String },
  polish: { type: String },
  symmetry: { type: String },
  fluorescence: { type: String },
  measurements: { type: String },
  estimatedValue: { type: Number },
  valuationMethod: { type: String },
  certificateNumber: { type: String },
  commitmentRequested: { type: Boolean, default: false },
  status: { type: String, enum: ['In Progress','Valuated', 'Completed','Sealed','Picked Up'], default: 'In Progress' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date},
  validatedAt: { type: Date},
  completedAt: { type: Date},
  actions: [actionSchema]
});

const ValuationRecord = mongoose.model('ValuationRecord', valuationRecordSchema);

module.exports = ValuationRecord;
