const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

// Route to generate receipt from a booking ID
router.post('/generate-receipt/:bookingId', receiptController.generateReceipt);

module.exports = router;
