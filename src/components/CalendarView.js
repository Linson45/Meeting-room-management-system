import React, { useState } from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Badge } from '@mui/material';
import { isSameDay } from 'date-fns';

const CalendarView = ({ bookings, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    onDateSelect(newDate);
  };

  const renderDayWithBookings = (date, selectedDates, pickersDayProps) => {
    const bookingsOnDate = bookings.filter(booking => isSameDay(new Date(booking.dateTime), date));
    const hasBookings = bookingsOnDate.length > 0;

    return (
      <Badge
        key={date.toString()}
        overlap="circular"
        badgeContent={hasBookings ? bookingsOnDate.length : undefined}
        color="primary"
      >
        <div {...pickersDayProps} />
      </Badge>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        value={selectedDate}
        onChange={handleDateChange}
        renderDay={renderDayWithBookings}
      />
    </LocalizationProvider>
  );
};

export default CalendarView;