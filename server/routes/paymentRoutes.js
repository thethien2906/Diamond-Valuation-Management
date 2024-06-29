const express = require('express');
const { createCheckoutSession , rejectBooking} = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/reject-booking', rejectBooking);

module.exports = router;
