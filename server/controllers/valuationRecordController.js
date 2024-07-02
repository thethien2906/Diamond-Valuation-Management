const ValuationRecord = require('../models/ValuationRecord');
const Receipt = require('../models/Receipt');
const User = require('../models/User');
const mongoose = require('mongoose');
let currentRecordNumber = 1;

// Generate a new record number
const generateRecordNumber = async () => {
  const count = await ValuationRecord.countDocuments();
  return `#${String(count + 1).padStart(4, '0')}`;
};

const createRecord = async (req, res) => {
  try {
    const receiptId = req.params.receiptId;
    console.log('receiptId:', receiptId); // Check for validity of ID

    if (!mongoose.Types.ObjectId.isValid(receiptId)) {
      return res.status(400).json({ error: 'Invalid receipt ID' });
    }

    // Fetch the receipt by its ObjectId
    const receipt = await Receipt.findById(receiptId);
    console.log('receipt:', receipt); // Check if the receipt is found

    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    // Find an available appraiser
    const appraiser = await User.findOne({ role: 'appraiser' });
    if (!appraiser) {
      return res.status(503).json({ error: 'No appraiser available' }); // Use 503 Service Unavailable
    }

    const recordNumber = await generateRecordNumber();

    const newValuationRecord = new ValuationRecord({
      recordNumber,
      customerName: receipt.customerName,
      phoneNumber: receipt.phone,
      email: receipt.email,
      appointmentDate: receipt.appointmentDate,
      appointmentTime: receipt.appointmentTime,
      serviceId: receipt.serviceId,
      consultantId: receipt.consultantId,
      customerId: receipt.customerId,
      appraiserId: appraiser._id,
      status: 'In Progress' // Set default status
    });

    const savedValuationRecord = await newValuationRecord.save();
    res.status(201).json(savedValuationRecord);
  } catch (error) {
    console.error('Error creating valuation record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getRecordsByStatus = async (req, res) => {
  try {
    const statuses = ['In Progress', 'Completed','Sealed'];
    const records = await ValuationRecord.find({ status: { $in: statuses } });
    if (records.length === 0) {
      return res.status(200).json({ message: 'No records found' }); // Return a 200 with the message
  }
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records by status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getRecordsInProgress = async (req, res) => {
  try {
    const statuses = 'In Progress';
    const records = await ValuationRecord.find({ status: { $in: statuses } });
    if (records.length === 0) {
      return res.status(200).json({ message: 'No records found' }); // Return a 200 with the message
    }
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records with status "In Progress":', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getRecordsCompleted = async (req, res) => {
  try {
    const statuses = 'Completed';
    const records = await ValuationRecord.find({ status: { $in: statuses } });
    if (records.length === 0) {
      return res.status(200).json({ message: 'No records found' }); // Return a 200 with the message
    }
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records with status "Completed":', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getRecordById = async (req, res) => {
  try {
    const { recordId } = req.params;
    const record = await ValuationRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateRecordById = async (req, res) => {
  try {
    const { recordId } = req.params;
    const updatedData = req.body;
    const record = await ValuationRecord.findByIdAndUpdate(recordId, updatedData, { new: true });
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getRecordsByUserId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const records = await ValuationRecord.find({ customerId });
    
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records by user ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const requestCommitment = async (req, res) => {
  try {
    const { recordId } = req.params;
    const record = await ValuationRecord.findById(recordId);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Add logic for creating a commitment request (e.g., updating the record or notifying the consultant)
    record.commitmentRequested = true; // Example field, you might need to add this to your model
    await record.save();

    res.status(200).json({ message: 'Commitment request submitted successfully' });
  } catch (error) {
    console.error('Error requesting commitment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { createRecord, getRecordsByStatus, getRecordById, updateRecordById, getRecordsInProgress, getRecordsCompleted, getRecordsByUserId, requestCommitment };
