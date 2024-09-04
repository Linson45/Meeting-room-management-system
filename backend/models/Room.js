const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_name: {
        type: String,
        required: true,
        unique: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;