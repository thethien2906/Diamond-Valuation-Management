const express = require('express');
const router = express.Router();
const valuationRecordController  = require('../controllers/valuationRecordController');

router.post('/valuation-records/:receiptId', valuationRecordController.createRecord);
router.get('/valuation-records', valuationRecordController.getRecordsByStatus);
router.get('/valuation-records/:recordId', valuationRecordController.getRecordById);
router.put('/valuation-records/:recordId', valuationRecordController.updateRecordById);
router.get('/valuation-records-in-progress', valuationRecordController.getRecordsInProgress); // Add this line
router.get('/valuation-records-completed', valuationRecordController.getRecordsCompleted); 
router.get('/valuation-records/user/:customerId', valuationRecordController.getRecordsByUserId);
router.post('/valuation-records/request-commitment/:recordId', valuationRecordController.requestCommitment); // Add this line

module.exports = router;
