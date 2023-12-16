// WindowRegisterWindow.js
import React, { useCallback, useState, useEffect  } from 'react';
import { Dialog, DialogContent, Typography, TextField, Button } from '@mui/material';

function WindowRegisterWindow({window_nr, calendar_id, onClose}) {
  const [username, setUsername] = useState('');
  const [addressName, setAddressName] = useState('');
  const [time, setTime] = useState('');
  const [locationHint, setLocationHint] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Replace the following with your actual API endpoint
      const response = await fetch('http://localhost:7007/api/registerWindowHosting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calendar_id, window_nr, username, addressName, time, locationHint }),
      });

      if (response.ok) {
        console.log('Window hosting registered successfully!');
      } else {
        console.error('Failed to register window hosting');
        console.log('response: ', response);
      }
    } catch (error) {
      console.error('Error during window hosting registration', error);
    }
  };



  return(
      <Dialog open={true} onClose={onClose} sx={{ zIndex: 9999, position: 'absolute' }}>
          <DialogContent sx={{ width: '400px', height: '700px' }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h4">Window Hosting Registration</Typography>
              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Address"
                fullWidth
                value={addressName}
                onChange={(e) => setAddressName(e.target.value)}
              />
              <TextField
                label="Time"
                fullWidth
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <TextField
                label="Location Hint"
                fullWidth
                value={locationHint}
                onChange={(e) => setLocationHint(e.target.value)}
              />
              <Button type="submit" variant="contained" color="primary">
                Host a Window
              </Button>
            </form>
          </DialogContent>
      </Dialog>
    );
}

export default WindowRegisterWindow;