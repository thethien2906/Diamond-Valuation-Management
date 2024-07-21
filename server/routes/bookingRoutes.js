const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/bookings', bookingController.createBooking);
router.get('/bookings/:bookingId', bookingController.getBookingById);
router.get('/pending-bookings', bookingController.getPendingBookings);
router.get('/consultants/:consultantId/pending-bookings', bookingController.getPendingBookingsByConsultant);
router.put('/bookings/:bookingId', bookingController.updateBooking);
router.delete('/bookings/:bookingId', bookingController.deleteBooking);
router.get('/approved-appointments', bookingController.getApprovedAppointments);
router.get('/consultants/:consultantId/appointments', bookingController.getConsultantAppointments);
router.get('/bookings', bookingController.getAllBookings);
router.get('/booking-count', bookingController.countPendingBookings);
module.exports = router;
