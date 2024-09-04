import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const UpdateBookingForm = ({ booking, onUpdate, onCancel }) => {
  const [name, setName] = useState(booking.name);
  const [email, setEmail] = useState(booking.email);
  const [purpose, setPurpose] = useState(booking.purpose);
  const [dateTime, setDateTime] = useState(new Date(booking.dateTime));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdate({ ...booking, name, email, purpose, dateTime });
      setLoading(false);
    } catch (err) {
      setError('Failed to update booking. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" component="div" sx={{ mb: 2 }}>
        Update Booking
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
        disabled={loading}
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
        disabled={loading}
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
        disabled={loading}
      />
      <DateTimePicker
        label="Date & Time"
        value={dateTime}
        onChange={(newDateTime) => setDateTime(newDateTime)}
        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        disabled={loading}
      />
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Booking'}
        </Button>
        <Button 
          onClick={onCancel}
          variant="outlined" 
          color="secondary"
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateBookingForm;