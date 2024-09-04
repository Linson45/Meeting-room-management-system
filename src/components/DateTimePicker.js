// components/DateTimePicker.js
import React from 'react';
import { DateTimePicker as MUIDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { TextField } from '@mui/material';

const DateTimePicker = ({ onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MUIDateTimePicker
        label="Select Date and Time"
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default DateTimePicker;