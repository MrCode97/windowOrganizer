// WindowRegisterWindow.js
import React, { useCallback, useState, useEffect  } from 'react';
import { Dialog, DialogContent, Typography, TextField, Button, FormControlLabel, Checkbox, Snackbar } from '@mui/material';
import { translate } from './GeocodeAddress';

function WindowRegisterWindow({window_nr, calendar_id, onClose, setIsFree}) {
  const [username, setUsername] = useState('');
  const [addressName, setAddressName] = useState('');
  const [time, setTime] = useState('');
  const [locationHint, setLocationHint] = useState('');
  const [hasApero, setHasApero] = useState(false);
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);

  // API request
  const handleSubmit = async (event) => {
    event.preventDefault();
    const coords = await translate(addressName);
    console.log(coords);
    try {
      const response = await fetch('http://localhost:7007/api/registerWindowHosting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ calendar_id, window_nr, username, addressName, coords, time, locationHint, hasApero }),
      });

      if (response.ok) {
        console.log('Window hosting registered successfully!');
        setMessage('Window hosting registered successfully!');
        setMessageOpen(true);
        onClose();
        setIsFree(false);
        
      } else {
        console.error('Failed to register window hosting');
        console.log('response: ', response);
        setMessage('Failed to register window hosting');
        setMessageOpen(true);
      }
    } catch (error) {
      console.error('Error during window hosting registration', error);
      setMessage('Failed to register window hosting');
      setMessageOpen(true);
    }
  };

  // Message display
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageOpen(false);
  };

  return(
      <Dialog open={true} onClose={onClose} sx={{ zIndex: 9999, position: 'sticky'}}>
          <DialogContent sx={{ width: '400px', height: '700px', backgroundColor: 'rgb(173, 216, 230)'}}>
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
              <span className='buttonContainerSlidingWindow'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasApero}
                      onChange={(e) => setHasApero(e.target.checked)}
                      name="hasApero"
                    />
                  }
                  label="Has Apero"
                />
                <Button type="submit" variant="contained" sx={{backgroundColor: 'green'}}>
                  Host a Window
                </Button>
              </span>
            </form>
          </DialogContent>
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
      </Dialog>
    );
}

export default WindowRegisterWindow;