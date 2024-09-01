// AdventCalendarRegistrationForm.js
import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Snackbar} from '@mui/material';

function LoginHint() {
  return (
    <div>
      <Typography className='pageTitle' variant="h4">Advent Calendar Registration</Typography>
      <Typography sx={{padding: '10px'}} variant="p">Please log in first to register an advent calendar.</Typography>
    </div>
  );
}

function AdventCalendarRegistrationForm( { reRender, token } ) {
  const [adventCalendarId, setAdventCalendarId] = useState('');
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => {
      // Check if the user is authenticated when the component mounts
      const checkAuthentication = () => {
        if (token) {
          // User is logged in
          setIsLoggedIn(true);
        } else {
          // User is not logged in
          setIsLoggedIn(false);
        }
      };
  
      checkAuthentication();
    }, [token]);  

  // API request
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Replace the following with your actual API endpoint
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/registerAdventCalendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ adventCalendarId }),
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
    <div> {isLoggedIn ? (
      <form onSubmit={handleSubmit}>
        <Typography className='pageTitle' variant="h4">Advent Calendar Registration</Typography>
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
      </form>)
      : (<LoginHint />)}
    </div>
  );
}

export default AdventCalendarRegistrationForm;
