const Booking = require('../models/Booking');
const User = require('../models/User');
const Receipt = require('../models/Receipt');

const generateSequentialNumber = async () => {
  // Implement logic to generate sequential receipt number
  const latestReceipt = await Receipt.findOne().sort({ receiptNumber: -1 });
  return latestReceipt ? (parseInt(latestReceipt.receiptNumber) + 1).toString() : '1';
};

const generateReceipt = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const { services, paymentMethod, amountPaid } = req.body;

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const customer = await User.findById(booking.customerId);
    const consultant = await User.findById(booking.consultantId);

    if (!customer || !consultant) {
      return res.status(404).json({ error: 'Customer or Consultant not found.' });
    }

    const receiptNumber = await generateSequentialNumber();

    const newReceipt = new Receipt({
      receiptNumber,
      issueDate: Date.now(),
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email,
      appointmentDate: booking.date,
      appointmentTime: booking.time,
      consultantName: consultant.name,
      services,
      paymentMethod,
      amountPaid
    });

    await newReceipt.save();
    res.status(201).json(newReceipt);
  } catch (error) {
    console.error('Error generating receipt:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  generateReceipt
};
