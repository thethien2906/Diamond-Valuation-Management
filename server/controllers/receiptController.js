const Booking = require('../models/Booking');
const Receipt = require('../models/Receipt');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid'); 

const generateReceipt = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { services, paymentMethod, amountPaid } = req.body;

        // Validation schema for request body
        const schema = Joi.object({
            services: Joi.string()
                .valid(...Receipt.schema.path('services').enumValues)
                .required(),
            paymentMethod: Joi.string()
                .valid(...Receipt.schema.path('paymentMethod').enumValues)
                .required(),
            amountPaid: Joi.number().positive().required(),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Fetch booking details by ID
        const booking = await Booking.findById(bookingId).populate('consultantId', 'name');
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Create a new receipt object
        const newReceipt = new Receipt({
            receiptNumber: uuidv4(),
            issueDate: new Date(), 
            customerName: booking.name,
            phone: booking.phoneNumber,
            email: booking.email,
            appointmentDate: booking.date,
            appointmentTime: booking.time,
            consultantId: booking.consultantId._id,
            services,
            paymentMethod,
            amountPaid
        });

        // Save the new receipt
        const savedReceipt = await newReceipt.save();
        res.status(201).json(savedReceipt);
        await Booking.findByIdAndUpdate(bookingId, { status: 'done' });

    } catch (error) {
        console.error('Error generating receipt:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getReceiptById = async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.receiptId);
        if (!receipt) {
          return res.status(404).json({ error: 'Receipt not found' });
        }
        res.json(receipt);
      } catch (error) {
        console.error('Error fetching receipt:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }; 

module.exports = { generateReceipt, getReceiptById };
