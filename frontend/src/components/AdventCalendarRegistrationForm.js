// AdventCalendarRegistrationForm.js
import React, { useState } from 'react';
import { Typography, TextField, Button } from '@mui/material';

function AdventCalendarRegistrationForm() {
  const [adventCalendarId, setAdventCalendarId] = useState('');
  const [username, setUsername] = useState('');

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
      } else {
        console.error('Failed to register advent calendar');
      }
    } catch (error) {
      console.error('Error during form submission', error);
    }
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
      <Button type="submit" variant="contained" sx={{backgroundColor: 'green', marginTop: '5px'}}>
        Register
      </Button>
    </form>
  );
}

export default AdventCalendarRegistrationForm;
