const express = require('express');
const router = express.Router();
const { createSealRequest, getSealRequests, updateSealRequestStatus, getSealRequestsById, getSealingRequestsByConsultant } = require('../controllers/sealController');

router.post('/seal-request', createSealRequest);
router.get('/seal-requests', getSealRequests);
router.put('/seal-request/:sealId', updateSealRequestStatus);
router.get('/seal-requests/:sealId', getSealRequestsById);
router.get('/seal-requests/:consultantId/status', getSealingRequestsByConsultant); 
module.exports = router;
