const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Get available rooms
exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

// Create a new booking
exports.createBooking = async (req, res) => {
    const { room_id, start_time, end_time, user_id } = req.body;

    try {
        const room = await Room.findById(room_id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const overlappingBooking = await Booking.findOne({
            room_id,
            $or: [
                { start_time: { $lt: end_time, $gt: start_time } },
                { end_time: { $gt: start_time, $lt: end_time } },
            ],
        });

        if (overlappingBooking) {
            return res.status(400).json({ error: 'Room is already booked for the requested time' });
        }
        const booking = new Booking({
            room_id,
            start_time,
            end_time,
            user_id,
        });

        await booking.save();
        res.status(201).json({ message: 'Booking created', booking });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create booking', details: err.message });
    }
};

// Update a booking
exports.updateBooking = async (req, res) => {
    const { id } = req.params;
    const { start_time, end_time } = req.body;

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const overlappingBooking = await Booking.findOne({
            _id: { $ne: id },
            room_id: booking.room_id,
            $or: [
                { start_time: { $lt: end_time, $gt: start_time } },
                { end_time: { $gt: start_time, $lt: end_time } },
            ],
        });

        if (overlappingBooking) {
            return res.status(400).json({ error: 'Room is already booked for the requested time' });
        }
        booking.start_time = start_time;
        booking.end_time = end_time;

        await booking.save();
        res.status(200).json({ message: 'Booking updated', booking });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update booking', details: err.message });
    }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        await booking.remove();
        res.status(200).json({ message: 'Booking deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete booking', details: err.message });
    }
};