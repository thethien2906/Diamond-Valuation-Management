const express = require('express');
const router = express.Router();
const commitController = require('../controllers/commitController');

router.post('/commit-request', commitController.createCommitRequest);
router.get('/commit-request/:commitId', commitController.getCommitById);
router.put('/commit-request/:commitId', commitController.updateCommitStatus);
router.get('/commit-requests/:consultantId', commitController.getCommitsByConsultant)
router.put('/commit-request/:commitId/deny', commitController.denyCommitRequest);
router.get('/commit-requests-pending-by-consultant', commitController.getPendingByConsultantCommits); //
router.put('/commit-request-manager/:commitId', commitController.updateCommitStatusByManager);
module.exports = router;
