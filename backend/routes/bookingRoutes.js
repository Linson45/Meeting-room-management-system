const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/rooms', bookingController.getRooms);
router.post('/bookings', bookingController.createBooking);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router;