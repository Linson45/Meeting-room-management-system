const express = require('express');
const { Room, Booking } = require('../models');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();

// Google Calendar setup
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({ include: Room });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { roomId, startTime, endTime, purpose, userEmail, accessToken } = req.body;

    const booking = await Booking.create({
      RoomId: roomId,
      startTime,
      endTime,
      purpose,
      userEmail
    });

    // Add event to Google Calendar
    oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: purpose,
      description: `Booking for room ${roomId}`,
      start: {
        dateTime: startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: 'UTC',
      },
    };

    const googleEvent = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    booking.googleEventId = googleEvent.data.id;
    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a booking
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, purpose, accessToken } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.purpose = purpose;
    await booking.save();

    // Update Google Calendar event
    oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: purpose,
      start: {
        dateTime: startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: 'UTC',
      },
    };

    await calendar.events.update({
      calendarId: 'primary',
      eventId: booking.googleEventId,
      resource: event,
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { accessToken } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Delete Google Calendar event
    oauth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: booking.googleEventId,
    });

    await booking.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;