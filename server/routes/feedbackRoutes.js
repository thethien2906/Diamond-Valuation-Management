// routes/feedbackRoutes.js

const express = require('express');
const { submitFeedback, getFeedbackById } = require('../controllers/feedbackController');

const router = express.Router();

router.post('/feedback', submitFeedback);
router.get('/feedback/:feedbackId', getFeedbackById);


module.exports = router;
