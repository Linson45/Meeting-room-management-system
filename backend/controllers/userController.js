const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'User created', user });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;

        await user.save();
        res.status(200).json({ message: 'User updated', user });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.remove();
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};