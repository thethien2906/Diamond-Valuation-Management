const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require('../controllers/serviceController');

router.post('/services', createService);
router.get('/services', getAllServices);
router.get('/services/:serviceId', getServiceById);
router.put('/services/:serviceId', updateService);
router.delete('/services/:serviceId', deleteService);

module.exports = router;
