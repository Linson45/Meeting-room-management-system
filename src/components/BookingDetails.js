import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import UpdateBookingForm from './UpdateBookingForm';

const BookingDetails = ({ booking, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          // Updated booking details (include startTime, endTime, purpose)
        })
      });
      const data = await response.json();
      // Handle successful update
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      });
      if (response.ok) {
        // Handle successful deletion
      } else {
        console.error('Error deleting booking:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  if (isEditing) {
    return (
      <UpdateBookingForm
        booking={booking}
        onUpdate={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Booking Details
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Room: {booking.room.name}
          </Typography>
          <Typography variant="body2">
            Date: {new Date(booking.dateTime).toLocaleString()}
            <br />
            Name: {booking.name}
            <br />
            Email: {booking.email}
            <br />
            Purpose: {booking.purpose}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
              Update Booking
            </Button>
            <Button variant="outlined" color="error" onClick={handleDeleteClick}>
              Delete Booking
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this booking? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BookingDetails;