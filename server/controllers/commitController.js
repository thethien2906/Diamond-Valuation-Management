const Commit = require('../models/Commit');
const ValuationRecord = require('../models/ValuationRecord');
const transporter = require('../config/nodemailer');
const User = require('../models/User');
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
  const getPendingByConsultantCommits = async (req, res) => {
    try {
      const commits = await Commit.find({ status: 'Pending by Consultant' });
      res.status(200).json(commits);
    } catch (error) {
      console.error('Error fetching commits:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const sendEmail = (email, subject, text) => {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      text: text
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  };
  const updateCommitStatusByManager = async (req, res) => {
    try {
      const { commitId } = req.params;
      const { status } = req.body;
  
      const commit = await Commit.findById(commitId);
      if (!commit) {
        return res.status(404).json({ error: 'Commitment request not found' });
      }
  
      commit.status = status;
      await commit.save();
      
      // Send email based on status change
      const emailText = status === 'Approved' ? 
        `Dear ${commit.customerName}, your commitment request has been approved.` :
        `Dear ${commit.customerName}, your commitment request has been denied.`;
      sendEmail(commit.email, `Commitment Request ${status}`, emailText);
  
      res.status(200).json({ message: 'Commitment request status updated successfully', commit });
    } catch (error) {
      console.error('Error updating commitment request status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const denyCommitRequest = async (req, res) => {
    try {
      const commitId = req.params.commitId;
      
      
      // Find and update the commit
      const commit = await Commit.findByIdAndUpdate(
        commitId,
        { status: 'Rejected' },
        { new: true } 
      ).populate('recordId');
  
      if (!commit) {
        return res.status(404).json({ error: 'Commitment statement not found' });
      }
      
      // Fetch the customer associated with the commit's valuation record
      const valuationRecord = await ValuationRecord.findById(commit.recordId);
      const customer = await User.findById(valuationRecord.customerId);
  
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      // Send email to the customer
     
      const mailOptions = {
        from: process.env.SMTP_USER,
          to: customer.email,
          subject: 'Commitment Request Denied',
          text: `
        Dear ${customer.name},

        Your commitment request has been denied by our consultant.

        We apologize for any inconvenience this may cause. Please contact us for further assistance or to discuss alternative options.

        Thank you for your understanding.
    `
      };
  
      await transporter.sendMail(mailOptions); // Send the email
      await Commit.findByIdAndDelete(commitId);
      res.json({ message: 'Commitment request denied and email sent to customer' });
    } catch (error) {
      console.error('Error denying commitment request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  module.exports = { createCommitRequest, updateCommitStatus, getCommitsByConsultant, getCommitById, denyCommitRequest, getPendingByConsultantCommits, updateCommitStatusByManager };
