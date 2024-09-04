const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    start_time: {
        type: Date,
        required: true,
    },
    end_time: {
        type: Date,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;