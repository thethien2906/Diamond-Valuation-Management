const express = require('express');
const router = express.Router();
const commitController = require('../controllers/commitController');

router.post('/commit-request', commitController.createCommitRequest);

module.exports = router;
