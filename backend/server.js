const express = require('express');
const app = express();
const mongoose = require('./config/database');
const bookingRoutes = require('./routes/bookingRoutes');

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Meeting Room Booking API');
});

app.use('/api', bookingRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});