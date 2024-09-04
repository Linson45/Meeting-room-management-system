const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const OAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

OAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: OAuth2Client });

exports.createBooking = async (req, res) => {
    const { start_time, end_time, room_id } = req.body;

    const event = {
        summary: 'Meeting Room Booking',
        start: { dateTime: start_time },
        end: { dateTime: end_time },
    };

    try {
        const booking = await Booking.create({ start_time, end_time, room_id });
        const calendarEvent = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        res.status(201).json({ booking, calendarEvent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
};