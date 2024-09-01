// WindowRegisterWindow.js
import React, { useState, useEffect  } from 'react';
import { Dialog, DialogContent, Typography, TextField, Button, FormControlLabel, Checkbox, Snackbar } from '@mui/material';
import { translate } from './GeocodeAddress';

function WindowRegisterWindow({window_nr, calendar_id, onClose, setIsFree, reRender, token}) {
  const [addressName, setAddressName] = useState('');
  const [time, setTime] = useState('');
  const [locationHint, setLocationHint] = useState('');
  const [hasApero, setHasApero] = useState(false);
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // User is logged in
        setIsLoggedIn(true);
      } else {
        // User is not logged in
        setIsLoggedIn(false);
      }
    };

    checkAuthentication();
  }, []);

  // API request
  const handleSubmit = async (event) => {
    event.preventDefault();
    const coords = await translate(addressName);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/registerWindowHosting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },        
        body: JSON.stringify({ calendar_id, window_nr, addressName, coords, time, locationHint, hasApero }),
      });

      if (response.ok) {
        console.log('Window hosting registered successfully!');
        setMessage('Window hosting registered successfully!');
        setMessageOpen(true);
        onClose();
        setIsFree(false);
        reRender(true);
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

  return (
    <div>
      {isLoggedIn ? (
        <Dialog open={true} onClose={onClose} sx={{ zIndex: 9999, top: '4%', position: 'fixed', overflowY: 'auto'}}>
          <DialogContent sx={{ width: '400px', height: '700px', backgroundColor: 'rgb(173, 216, 230)' }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h4">Window Hosting Registration</Typography>
              <TextField
                label="Address"
                fullWidth
                value={addressName}
                onChange={(e) => setAddressName(e.target.value)}
              />
              <TextField
                label="Time in dd:dd format"
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
                <Button type="submit" variant="contained" sx={{ backgroundColor: 'green' }}>
                  Host a Window
                </Button>
              </span>
            </form>
          </DialogContent>
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </Dialog>
      ) : (
        // Display a message or redirect to the login page
        <div>
          <Dialog open={true} onClose={onClose} sx={{ zIndex: 9999, position: 'sticky' }}>
          <DialogContent sx={{ width: '400px', height: '700px', backgroundColor: 'rgb(173, 216, 230)' }}>
            <Typography variant="h4">Window Registration</Typography>
            <Typography variant="p">Please login first, to register a window hosting.</Typography>
          </DialogContent>
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </Dialog>
        </div>
      )}
    </div>
  );
}

export default WindowRegisterWindow;