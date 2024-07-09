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
    await record.save();
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
      `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto; color: #fff; background-color: rgb(0, 27, 56);">
        <div style="border: 5px solid rgb(0, 27, 56); padding: 10px; background-color: rgb(0, 27, 56); text-align: center;">
          <img src="https://i.pinimg.com/736x/6d/b4/ba/6db4ba2f50ba7a23197ff001b696538e.jpg" alt="Company Logo" style="width: 100px; border: 5px solid #fff;"/>
        </div>
        <h2 style="color: #fff;">Commitment Request Approved</h2>
        <p style="color: #fff;">Dear ${commit.customerName},</p>
        <p style="color: #fff;">Your commitment request has been approved.</p>
        <p style="color: #fff;">Thank you for your patience and cooperation.</p>
        <p style="color: #fff;">Best regards,</p>
        <p style="color: #fff;">Your Company Team</p>
      </div>
      ` :
      `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto; color: #fff; background-color: rgb(0, 27, 56);">
        <div style="border: 5px solid rgb(0, 27, 56); padding: 10px; background-color: rgb(0, 27, 56); text-align: center;">
          <img src="https://i.pinimg.com/736x/6d/b4/ba/6db4ba2f50ba7a23197ff001b696538e.jpg" alt="Company Logo" style="width: 100px; border: 5px solid #fff;"/>
        </div>
        <h2 style="color: #fff;">Commitment Request Denied</h2>
        <p style="color: #fff;">Dear ${commit.customerName},</p>
        <p style="color: #fff;">Your commitment request has been denied.</p>
        <p style="color: #fff;">We apologize for any inconvenience this may cause. Please contact us for further assistance or to discuss alternative options.</p>
        <p style="color: #fff;">Thank you for your understanding.</p>
        <p style="color: #fff;">Best regards,</p>
        <p style="color: #fff;">Your Company Team</p>
      </div>
      `;
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
          html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; border: 1px solid #ddd; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; max-width: 600px; margin: auto; color: #fff; background-color: rgb(0, 27, 56);">
          <div style="border: 5px solid rgb(0, 27, 56); padding: 10px; background-color: rgb(0, 27, 56); text-align: center;">
            <img src="https://i.pinimg.com/736x/6d/b4/ba/6db4ba2f50ba7a23197ff001b696538e.jpg" alt="Company Logo" style="width: 100px; border: 5px solid #fff;"/>
          </div>
          <h2 style="color: #fff;">Commitment Request Denied</h2>
          <p style="color: #fff; font-size: 18px;">Dear ${customer.name},</p>
          <p style="color: #fff; font-size: 18px;">Your commitment request has been denied by our consultant.</p>
          <p style="color: #fff; font-size: 18px;">We apologize for any inconvenience this may cause. Please contact us for further assistance or to discuss alternative options.</p>
          <p style="color: #fff; font-size: 18px;">Thank you for your understanding.</p>
          </div>
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
