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

    // Fetch all appraisers
    const appraisers = await User.find({ role: 'appraiser' });

    if (!appraisers || appraisers.length === 0) {
      return res.status(503).json({ error: 'No appraisers available' });
    }

    // Get the "In Progress" records for each appraiser
    const appraisersWithInProgressRecords = await Promise.all(
      appraisers.map(async (appraiser) => {
        const inProgressRecordsCount = await ValuationRecord.countDocuments({
          appraiserId: appraiser._id,
          status: 'In Progress',
        });
        return {
          appraiser,
          inProgressRecordsCount,
        };
      })
    );

    // Find the appraiser with the least "In Progress" records
    let leastInProgressAppraisers = [];
    let minInProgressCount = Infinity;

    for (const appraiserData of appraisersWithInProgressRecords) {
      if (appraiserData.inProgressRecordsCount < minInProgressCount) {
        leastInProgressAppraisers = [appraiserData.appraiser];
        minInProgressCount = appraiserData.inProgressRecordsCount;
      } else if (appraiserData.inProgressRecordsCount === minInProgressCount) {
        leastInProgressAppraisers.push(appraiserData.appraiser);
      }
    }

    // Randomly select one of the appraisers if there is a tie
    const selectedAppraiser = leastInProgressAppraisers[Math.floor(Math.random() * leastInProgressAppraisers.length)];

    // Generate the record number
    const recordNumber = await generateRecordNumber();

    // Create the new valuation record
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
      appraiserId: selectedAppraiser._id,
      status: 'In Progress',
    });

    // Save the new valuation record
    const savedValuationRecord = await newValuationRecord.save();

    // Update the booking status to 'valuating'
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
    const statuses = ['In Progress', 'Completed', 'Sealed','Valuated', 'Picked Up'];
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
const getRecordsvaluatedByApprasierId = async (req, res) => {
  try {
    const appraiserId = req.params.appraiserId;
    const records = await ValuationRecord.find({ appraiserId , status: ['Valuated', 'Completed'] });
    res.status(200).json(records);
  } catch (error) { 
    console.error('Error fetching records by appraiser ID:', error);
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
    const recordData = record.toObject();
    if (record.caratWeight !== undefined) {
      recordData.caratWeight = record.caratWeight.toString();
    }
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

    // Fetch the current record to check the actions array and update the updatedAt field
    const record = await ValuationRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Determine the action to add
    let action;
    if (record.actions.length === 0) {
      action = 'Diamond Valuated';
    } else {
      const updateCount = record.actions.filter(action => action.action.startsWith('Update by appraiser')).length + 1;
      action = `Update by appraiser ${updateCount}`;
    }

    // Add the new action to the actions array
    record.actions.push({ action });

    // Update the record with the new data and actions array
    const updatedRecord = await ValuationRecord.findByIdAndUpdate(
      recordId,
      { ...updatedData, actions: record.actions, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json(updatedRecord);
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

    // Fetch the current record to check the actions array
    const record = await ValuationRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Determine the action to add
    let action;
    if (record.actions.length === 0) {
      action = 'Verify by consultant 1';
    } else {
      const verifyCount = record.actions.filter(action => action.action.startsWith('Verify by consultant')).length + 1;
      action = `Verify by consultant ${verifyCount}`;
    }

    // Add the new action to the actions array
    record.actions.push({ action, timestamp: Date.now() });

    // Update the record with the new status, validatedAt, and actions array
    const updatedRecord = await ValuationRecord.findByIdAndUpdate(
      recordId,
      { status: 'Completed', validatedAt: Date.now(), actions: record.actions },
      { new: true }
    );

    const recordData = {
      ...updatedRecord.toObject(),
      caratWeight: updatedRecord.caratWeight.toString()
    };

    res.status(200).json(recordData);
  } catch (error) {
    console.error('Error updating record status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateRecordStatusToPickedUp = async (req, res) => {
  try {
    const { recordId } = req.params;
    const record = await ValuationRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    record.status = 'Picked Up';
    //add actions to record actions
    record.actions.push({ action: 'Customer received diamond', timestamp: Date.now() });
    await record.save();
    //update the booking status to "completed" using receiptId
    const receipt = await Receipt.findById(record.receiptId);
    const booking = await Booking.findById(receipt.bookingId);
    booking.status = 'completed';
    await booking.save();
    
    res.status(200).json({ message: 'Record status updated successfully' });
  } catch (error) {
    console.error('Error updating record status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

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
    const recordData = record.toObject();
    if (record.caratWeight !== undefined) {
      recordData.caratWeight = record.caratWeight.toString();
    }
    
    const { serviceId, consultantId, customerId, appraiserId } = record;
    res.json({
      ...recordData,
      serviceName: serviceId ? serviceId.name : 'Not assigned',
      consultantName: consultantId ? appraiserId.name : 'Not assigned',
      customerName: customerId ? customerId.name : 'Not assigned',
      appraiserName: appraiserId ? appraiserId.name : 'Not assigned',
    })
  } catch (error) {
    console.error('Error fetching valuation record details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getRecordsByConsultantId = async (req, res) => {
  try {
    const consultantId = req.params.consultantId;

    if (!mongoose.Types.ObjectId.isValid(consultantId)) {
      return res.status(400).json({ error: 'Invalid consultant ID' });
    }

    const records = await ValuationRecord.find({ consultantId });

    if (!records || records.length === 0) {
      return res.status(404).json({ error: 'No records found for this consultant' });
    }

    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records by consultant ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getRecordsByAppraiserId = async (req, res) => {
  try {
    const appraiserId = req.params.appraiserId;

    if (!mongoose.Types.ObjectId.isValid(appraiserId)) {
      return res.status(400).json({ error: 'Invalid appraiser ID' });
    }
    //check if the records status is "In Progress"

    const records = await ValuationRecord.find({ appraiserId, status: 'In Progress' });

    

    if (!records || records.length === 0) {
      return res.status(404).json({ error: 'No records found for this appraiser' });
    }

    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching records by appraiser ID:', error);
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
  getRecordsvaluatedByApprasierId,
  getRecordsByUserId, 
  requestCommitment, 
  updateRecordStatusToCompleted,
  updateRecordStatusToPickedUp,
  getNamesByIds,
  getRecordsByAppraiserId, 
  getRecordsByConsultantId};
