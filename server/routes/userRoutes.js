const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.delete('/users/:userId', userController.deleteUser);
router.get('/consultants/available', userController.getAvailableConsultant);
router.get('/appraiser/available', userController.getAvailableAppraiser);
router.get('/users/:userId', userController.getUserById);
module.exports = router;
