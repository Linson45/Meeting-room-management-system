import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Person, DevicesOther } from '@mui/icons-material';

const RoomDetails = ({ room }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {room.name}
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary={`Capacity: ${room.capacity}`} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DevicesOther />
            </ListItemIcon>
            <ListItemText primary="Equipment" secondary={room.equipment.join(', ')} />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default RoomDetails;