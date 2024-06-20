const Commit = require('../models/Commit');
const ValuationRecord = require('../models/ValuationRecord');

const createCommitRequest = async (req, res) => {
  try {
    const { recordId, reasonForLoss, customerName, phoneNumber, email } = req.body;

    // Validate that the record exists
    const record = await ValuationRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Create a new commit request
    const newCommit = new Commit({
      recordId,
      reasonForLoss,
      customerName,
      phoneNumber,
      email,
    });

    await newCommit.save();
    res.status(201).json({ message: 'Commit request submitted successfully', commit: newCommit });
  } catch (error) {
    console.error('Error creating commit request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createCommitRequest };
