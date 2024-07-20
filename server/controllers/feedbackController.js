// feedbackController.js

const Feedback = require('../models/Feedback');
const ValuationRecord = require('../models/ValuationRecord');
const mongoose = require('mongoose');
const submitFeedback = async (req, res) => {
  try {
    const { recordId, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(recordId)) {
      return res.status(400).json({ error: 'Invalid record ID' });
    }

    const valuationRecord = await ValuationRecord.findById(recordId);
    if (!valuationRecord) {
      return res.status(404).json({ error: 'Valuation record not found' });
    }

    const newFeedback = new Feedback({
      recordId,
      appraiserId: valuationRecord.appraiserId,
      consultantId: valuationRecord.consultantId,
      feedback
    });

    const savedFeedback = await newFeedback.save();
    //save the feedbackId to the record model
    valuationRecord.feedbackId = savedFeedback._id;
    await valuationRecord.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getFeedbackById = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
//getFeedbackByAppraiserId api endpoint where fetch all feedback with the given userId

module.exports = { 
    submitFeedback,
    getFeedbackById,
    
 };
