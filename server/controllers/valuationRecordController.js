const ValuationRecord = require('../models/ValuationRecord');
const Receipt = require('../models/Receipt');
const User = require('../models/User');
const Booking = require('../models/Booking');
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
      receiptId: receipt._id,
      serviceId: receipt.serviceId,
      consultantId: receipt.consultantId,
      customerId: receipt.customerId,
      appraiserId: appraiser._id,
      status: 'In Progress' // Set default status
    });

    const savedValuationRecord = await newValuationRecord.save();
    const bookingId = receipt.bookingId;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'valuating';
    await booking.save();
    res.status(201).json(savedValuationRecord);
  } catch (error) {
    console.error('Error creating valuation record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getRecordsByStatus = async (req, res) => {
  try {
    const statuses = ['In Progress', 'Completed', 'Sealed','Valuated'];
    const records = await ValuationRecord.find({ status: { $in: statuses } });
    res.status(200).json(records); // Always return an array
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
const getRecordsvaluated = async (req, res) => {
  try {
    const statuses = ['Valuated','Completed'];
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
    const recordData = {
      ...record.toObject(),
      caratWeight: record.caratWeight.toString()
    };
    res.status(200).json(recordData);
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
    //update updatedAt field in record model to now
    await ValuationRecord.findByIdAndUpdate(recordId, { updatedAt: Date.now() }, { new: true });
    res.status(200).json(record);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getRecordsByUserId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const records = await ValuationRecord.find({ customerId })
    .populate('serviceId', 'name')
      .exec();
      const detailedRecords = records.map(record => ({
        ...record.toObject(),
        serviceName: record.serviceId ? record.serviceId.name : 'Not assigned',
      }));
    
    res.status(200).json(detailedRecords);
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

const updateRecordStatusToCompleted = async (req, res) => {
  try {
    const { recordId } = req.params;
    const record = await ValuationRecord.findByIdAndUpdate(
      recordId,
      { status: 'Completed', validatedAt: Date.now() },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const recordData = {
      ...record.toObject(),
      caratWeight: record.caratWeight.toString()
    };

    res.status(200).json(recordData);
  } catch (error) {
    console.error('Error updating record status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getNamesByIds = async (req, res) => {
  try {
    const { recordId } = req.params;
    const record = await ValuationRecord.findById(recordId)
      .populate('serviceId', 'name')
      .populate('consultantId', 'name')
      .populate('customerId', 'name')
      .populate('appraiserId', 'name')
      .exec();

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const { serviceId, consultantId, customerId, appraiserId } = record;
    res.json({
      ...record.toObject(),
      serviceName: serviceId ? serviceId.name : 'Not assigned',
      consultantName: consultantId ? consultantId.name : 'Not assigned',
      customerName: customerId ? customerId.name : 'Not assigned',
      appraiserName: appraiserId ? appraiserId.name : 'Not assigned',
    });
  } catch (error) {
    console.error('Error fetching valuation record details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { 
  createRecord, 
  getRecordsByStatus, 
  getRecordById, 
  updateRecordById, 
  getRecordsInProgress, 
  getRecordsCompleted, 
  getRecordsvaluated,
  getRecordsByUserId, 
  requestCommitment, 
  updateRecordStatusToCompleted,
  getNamesByIds }; 
