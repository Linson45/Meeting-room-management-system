const express = require('express');
const router = express.Router();
const { Room, Booking } = require('../models');

// Retrieve available rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Create a new booking
router.post('/bookings', async (req, res) => {
  try {
    const { room, dateTime, name, email, purpose } = req.body;

    // Check room availability
    const existingBooking = await Booking.findOne({ room, dateTime });
    if (existingBooking) {
      return res.status(400).json({ error: 'Room is already booked' });
    }

    const booking = new Booking({ room, dateTime, name, email, purpose });
    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Retrieve a user's bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.user.email });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Update a booking
router.put('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const { name, email, purpose, dateTime } = req.body;
    booking.set({ name, email, purpose, dateTime });
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Cancel a booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

module.exports = router;