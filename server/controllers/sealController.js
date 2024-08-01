const Seal = require('../models/Seal');
const ValuationRecord = require('../models/ValuationRecord');
const transporter = require('../config/nodemailer');
const createSealRequest = async (req, res) => {
  try {
    const { recordId, reason, notes, consultantId } = req.body;

    const record = await ValuationRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const newSeal = new Seal({
      recordId,
      customerName: record.customerName,
      reason,
      notes,
      consultantId
    });

    await newSeal.save();
    //add new actions to action array 
    record.actions.push({
      action: 'Seal Requested by Consultant',
      timestamp: Date.now(),
    });
    //add sealId to sealId field in record
    record.sealId = newSeal._id;
    await record.save();

    res.status(201).json({ message: 'Seal request created successfully', seal: newSeal });
  } catch (error) {
    console.error('Error creating seal request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSealRequests = async (req, res) => {
  try {
    const seals = await Seal.find({ status: 'Pending' }).populate('recordId').populate('consultantId');
    res.status(200).json(seals);
  } catch (error) {
    console.error('Error fetching seal requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getSealRequestsById = async (req, res) => {
    try {
        const sealId = req.params.sealId; // Changed to sealId
        const seal = await Seal.findById(sealId).populate('recordId consultantId'); // Populate references
        if (!seal) {
            return res.status(404).json({ error: 'Seal request not found' });
        }
        res.json(seal);
    } catch (error) {
    console.error('Error fetching seal requests:', error);
    res.status(500).json({ error: 'Internal server error' });
}}
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};

const updateSealRequestStatus = async (req, res) => {
  try {
    const sealId = req.params.sealId;
    const { status } = req.body;

    // 1. Update Seal Request Status
    const updatedSeal = await Seal.findByIdAndUpdate(
      sealId,
      { status },
      { new: true }
    );
    if (!updatedSeal) {
      return res.status(404).json({ error: 'Seal request not found' });
    }

    // 2. Update Valuation Record Status if Approved
    if (status === 'Approved') {
      const valuationRecord = await ValuationRecord.findById(updatedSeal.recordId);

      if (!valuationRecord) {
        return res.status(404).json({ error: 'Valuation record not found' });
      }

      await valuationRecord.updateOne({ status: 'Sealed' });

      await sendEmail(
        valuationRecord.email, // Assuming this field exists in ValuationRecord
        'Seal Request Approved',
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto; color: #000;">
          <h2>Seal Request Approved</h2>
          <p>Dear ${valuationRecord.customerName},</p>
          <p>Your diamond and its certificate have been sealed for 30 days.</p>
          <p>If you wish to remove the seal, please visit our store.</p>
          <p>Thank you for your trust in our services.</p>
          <p>Best regards,</p>
          <p>Diamond Scope</p>
        </div>
        `
      );
    }

    // 3. Send Response
    res.json({ message: 'Seal request updated successfully' });

    // 4. Add Action to Valuation Record
    const record = await ValuationRecord.findById(updatedSeal.recordId);
    record.actions.push({
      action: `Seal Request ${status === 'Approved' ? 'Approved' : 'Rejected'} by Manager`,
      timestamp: Date.now(),
    });

    await record.save();
  } catch (error) {
    console.error('Error updating seal request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getSealingRequestsByConsultant = async (req, res) => {
    try{
        const {consultantId} = req.params;
        const sealingRequests = await Seal.find({consultantId}).populate('recordId');
        res.status(200).json(sealingRequests);
    }catch(error){
        console.error('Error fetching sealing requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    }

const unsealRecord = async (req, res) => {
  const { sealId } = req.params;

  try {
    // Find the seal
    const seal = await Seal.findById(sealId);
    if (!seal) {
      return res.status(404).json({ message: 'Seal not found' });
    }

    // Update the record status
    await ValuationRecord.findByIdAndUpdate(seal.recordId, { status: 'Completed' });

    // update seal status to cancelled
    await Seal.findByIdAndUpdate(sealId, { status: 'Cancelled' });

    
    // add actions to record
    const record = await ValuationRecord.findById(seal.recordId);
    record.actions.push({
      action: 'Record Unsealed',
      timestamp: Date.now(),
    });
    await record.save();
    res.json({ message: 'Record unsealed' });
  } catch (error) {
    console.error('Error unsealing record:', error);
    res.status(500).json({ message: 'Failed to unseal record' });
  }
};


module.exports = { createSealRequest, getSealRequests, updateSealRequestStatus,getSealRequestsById,getSealingRequestsByConsultant,unsealRecord };
