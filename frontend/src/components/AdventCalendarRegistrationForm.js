// AdventCalendarRegistrationForm.js
import React, { useState } from 'react';
import { Typography, TextField, Button, Snackbar} from '@mui/material';

function AdventCalendarRegistrationForm( { reRender } ) {
  const [adventCalendarId, setAdventCalendarId] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);

  // API request
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Replace the following with your actual API endpoint
      const response = await fetch('http://localhost:7007/api/registerAdventCalendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adventCalendarId, username }),
      });

      if (response.ok) {
        console.log('Advent calendar registered successfully!');
        reRender(true);
        setMessage('Advent calendar registered successfully!');
        setMessageOpen(true);
      } else {
        console.error('Failed to register advent calendar');
        setMessage('Failed to register advent calendar');
        setMessageOpen(true);
      }
    } catch (error) {
      console.error('Error during form submission', error);
      setMessage('Error during form submission');
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
    <form onSubmit={handleSubmit}>
      <Typography className='registrationHeader' variant="h4">Advent Calendar Registration</Typography>
      <TextField
        label="Your username"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Advent Calendar Name"
        fullWidth
        value={adventCalendarId}
        onChange={(e) => setAdventCalendarId(e.target.value)}
      />
      <Button type="submit" variant="contained" sx={{backgroundColor: 'green', marginTop: '10px'}}>
        Register
      </Button>
      <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
    </form>
  );
}

export default AdventCalendarRegistrationForm;
