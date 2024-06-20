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
    //set commimentRequested to true
    record.commitmentRequested = true;
    
    // Create a new commit request
    const newCommit = new Commit({
      recordId,
      reasonForLoss,
      customerName,
      phoneNumber,
      email,
      status: 'Pending by Customer',
    });

    await newCommit.save();
    res.status(201).json({ message: 'Commit request submitted successfully', commit: newCommit });
  } catch (error) {
    console.error('Error creating commit request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateCommitStatus = async (req, res) => {
    try {
        const commitId = req.params.commitId;

        const updatedCommit = await Commit.findByIdAndUpdate(
            commitId,
            { status: 'Pending by Consultant' }, // Set the status directly
            { new: true }
        );

        if (!updatedCommit) {
            return res.status(404).json({ error: 'Commitment request not found' });
        }

        res.json(updatedCommit); 
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


  const getCommitsByConsultant = async (req, res) => {
    try {
      const { consultantId } = req.params;
  
      // Find all valuation records for the consultant
      const records = await ValuationRecord.find({ consultantId });
  
      // Extract record IDs
      const recordIds = records.map(record => record._id);
  
      // Find all commits related to these record IDs
      const commits = await Commit.find({ recordId: { $in: recordIds } });
  
      res.status(200).json(commits);
    } catch (error) {
      console.error('Error fetching commits by consultant:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const getCommitById = async (req, res) => {
    try {
        const commitId = req.params.commitId;
    
        // Directly fetch the commit by its ID
        const commit = await Commit.findById(commitId);
    
        // If the commit doesn't exist, return a 404
        if (!commit) {
          return res.status(404).json({ error: 'Commitment statement not found' });
        }
    
        // Otherwise, return the commit details
        res.status(200).json(commit);
      } catch (error) {
        console.error('Error fetching commitment statement:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    
  }

  const deleteCommit = async (req, res) => {
    try {
        const commitId = req.params.commitId;
        const deletedCommit = await Commit.findByIdAndDelete(commitId);
        if (!deletedCommit) {
            return res.status(404).json({ error: 'Commitment statement not found' });
        }
        res.json({ message: 'Commitment statement deleted successfully' });
    } catch (error) {
        console.error('Error deleting commitment statement:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
  module.exports = { createCommitRequest, updateCommitStatus, getCommitsByConsultant, getCommitById, deleteCommit };
