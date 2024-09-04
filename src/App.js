import React, { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Container, Grid, Paper, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import RoomList from './components/RoomList';
import DateTimePicker from './components/DateTimePicker';
import BookingForm from './components/BookingForm';
import BookingDetails from './components/BookingDetails';
import RoomDetails from './components/RoomDetails';
import CalendarView from './components/CalendarView';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getAuthUrl, getTokens, refreshAccessToken } from './utils/googleAuth';

const theme = createTheme();

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [bookingDetails, setBookingDetails] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user, login, logout } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings', {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      });
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleDateTimeChange = (dateTime) => {
    setSelectedDateTime(dateTime);
  };

  const handleBookingSubmit = async (details) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          startTime: selectedDateTime.toISOString(),
          endTime: selectedDateTime.toISOString(), // Adjust end time as needed
          purpose,
          userEmail: user.email // Assuming user email is stored in the authentication context
        })
      });
      const data = await response.json();
      setBookingDetails(data);
      setBookings([...bookings, data]);
      setSnackbar({ open: true, message: 'Booking created successfully', severity: 'success' });
    } catch (error) {
      console.error('Error creating booking:', error);
      setSnackbar({ open: true, message: 'Failed to create booking', severity: 'error' });
    }
  };

  const handleBookingUpdate = async (updatedBooking) => {
    try {
      const response = await fetch(`/api/bookings/${updatedBooking.id}`, {
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
      const updatedBookings = bookings.map(booking =>
        booking.id === data.id ? data : booking
      );
      setBookings(updatedBookings);
      setBookingDetails(data);
      setSnackbar({ open: true, message: 'Booking updated successfully', severity: 'success' });
    } catch (error) {
      console.error('Error updating booking:', error);
      setSnackbar({ open: true, message: 'Failed to update booking', severity: 'error' });
    }
  };

  const handleBookingDelete = async (bookingId) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      });
      if (response.ok) {
        const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
        setBookings(updatedBookings);
        setBookingDetails(null);
        setSnackbar({ open: true, message: 'Booking deleted successfully', severity: 'success' });
      } else {
        console.error('Error deleting booking:', response.statusText);
        setSnackbar({ open: true, message: 'Failed to delete booking', severity: 'error' });
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      setSnackbar({ open: true, message: 'Failed to delete booking', severity: 'error' });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Meeting Room Booking System
              </Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
            {user ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                      Available Rooms
                    </Typography>
                    <DateTimePicker onChange={handleDateTimeChange} />
                    <RoomList onSelectRoom={handleRoomSelect} selectedDateTime={selectedDateTime} />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <CalendarView bookings={bookings} onDateSelect={handleDateTimeChange} />
                  </Paper>
                </Grid>
                {selectedRoom && (
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <RoomDetails room={selectedRoom} />
                      <BookingForm
                        room={selectedRoom}
                        dateTime={selectedDateTime}
                        onSubmit={handleBookingSubmit}
                      />
                    </Paper>
                  </Grid>
                )}
                {bookingDetails && (
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                      <BookingDetails
                        booking={bookingDetails}
                        onUpdate={handleBookingUpdate}
                        onDelete={handleBookingDelete}
                      />
                    </Paper>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Login />
            )}
          </Container>
        </Box>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;