const Room = require('../models/Room');

// Create a new room
exports.createRoom = async (req, res) => {
    const { room_name, capacity, location } = req.body;

    try {
        const room = new Room({ room_name, capacity, location });
        await room.save();
        res.status(201).json({ message: 'Room created', room });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create room' });
    }
};

// Get all rooms
exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

// Get a single room by ID
exports.getRoomById = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch room' });
    }
};

// Update a room
exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const { room_name, capacity, location } = req.body;

    try {
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        room.room_name = room_name || room.room_name;
        room.capacity = capacity || room.capacity;
        room.location = location || room.location;

        await room.save();
        res.status(200).json({ message: 'Room updated', room });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update room' });
    }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        await room.remove();
        res.status(200).json({ message: 'Room deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete room' });
    }
};