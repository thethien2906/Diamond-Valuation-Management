const express = require('express');
const { createCheckoutSession , rejectBooking, cancelBooking} = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/reject-booking', rejectBooking);
router.post('/cancel-booking', cancelBooking);
module.exports = router;
