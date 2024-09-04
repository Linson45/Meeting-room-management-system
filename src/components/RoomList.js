import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, ListItemButton, Typography } from '@mui/material';

const RoomList = ({ onSelectRoom, selectedDateTime }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, [selectedDateTime]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch rooms. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading rooms...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <List>
      {rooms.map((room) => (
        <ListItem key={room.id} disablePadding>
          <ListItemButton onClick={() => onSelectRoom(room)}>
            <ListItemText
              primary={room.name}
              secondary={`Capacity: ${room.capacity}, Equipment: ${room.equipment.join(', ')}`}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default RoomList;