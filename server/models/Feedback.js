// models/Feedback.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  recordId: {
    type: Schema.Types.ObjectId,
    ref: 'ValuationRecord',
    required: true
  },
  appraiserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consultantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
