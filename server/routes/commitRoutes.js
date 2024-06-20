const express = require('express');
const router = express.Router();
const commitController = require('../controllers/commitController');

router.post('/commit-request', commitController.createCommitRequest);
router.get('/commit-request/:commitId', commitController.getCommitById);
router.put('/commit-request/:commitId', commitController.updateCommitStatus);
router.get('/commit-requests/:consultantId', commitController.getCommitsByConsultant)
router.delete('/commit-request/:commitId', commitController.deleteCommit);
module.exports = router;
