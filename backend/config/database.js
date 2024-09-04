const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bookingDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error', err));

module.exports = mongoose;