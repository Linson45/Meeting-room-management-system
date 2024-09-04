const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Remove leading/trailing whitespace
  },
  capacity: {
    type: Number,
    required: true,
    min: 1, // Minimum capacity of 1 person
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking', // Reference the Booking model for population
    },
  ],
});

const bookingSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.startTime; // Ensure end time is after start time
      },
      message: 'End time must be after start time.',
    },
  },
  purpose: {
    type: String,
    required: true,
    trim: true,
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true, // Ensure case-insensitive email matching
  },
  googleEventId: {
    type: String,
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room', // Reference the Room model for population
    required: true,
  },
});

// Virtual property for booking duration (calculated)
bookingSchema.virtual('duration').get(function() {
  const diffInMs = this.endTime - this.startTime;
  return Math.round(diffInMs / (1000 * 60 * 60)); // Hours
});

// Pre-save hook to ensure room availability before booking creation
bookingSchema.pre('save', async function(next) {
  const bookedRooms = await Booking.find({
    room: this.room,
    $or: [
      { $and: [{ startTime: { $lt: this.endTime } }, { endTime: { $gt: this.startTime } }] },
      { startTime: { $lt: this.startTime }, endTime: { $gt: this.endTime } },
      { startTime: this.startTime, endTime: this.endTime },
    ],
  });

  if (bookedRooms.length > 0) {
    return next(new Error('Room is already booked during this time slot.'));
  }

  next();
});

// Population configuration
roomSchema.pre('find', populateBookings);
roomSchema.pre('findOne', populateBookings);
bookingSchema.pre('find', populateRoom);
bookingSchema.pre('findOne', populateRoom);

function populateBookings(next) {
  this.populate('bookings');
  next();
}

function populateRoom(next) {
  this.populate('room');
  next();
}

module.exports = mongoose.model('Room', roomSchema);
module.exports = mongoose.model('Booking', bookingSchema);