import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const BookingForm = ({ room, dateTime, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = async (e) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          roomId: room.id,
          startTime: dateTime.toISOString(),
          endTime: dateTime.toISOString(), // Adjust end time as needed
          purpose,
          userEmail: user.email // Assuming user email is stored in the authentication context
        })
      });
      const data = await response.json();
      // Handle successful booking creation
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Purpose"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
        required
      />
      <DateTimePicker
        label="Date & Time"
        value={dateTime}
        onChange={(newDateTime) => setDateTime(newDateTime)}
        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Book Room
      </Button>
    </Box>
  );
};

export default BookingForm;