const Seal = require('../models/Seal');
const ValuationRecord = require('../models/ValuationRecord');

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
        }

        // 3. Send Response
        res.json({ message: 'Seal request updated successfully' });
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

    // Delete the seal
    await Seal.findByIdAndDelete(sealId);

    res.json({ message: 'Record unsealed and seal deleted' });
  } catch (error) {
    console.error('Error unsealing record:', error);
    res.status(500).json({ message: 'Failed to unseal record' });
  }
};


module.exports = { createSealRequest, getSealRequests, updateSealRequestStatus,getSealRequestsById,getSealingRequestsByConsultant,unsealRecord };
