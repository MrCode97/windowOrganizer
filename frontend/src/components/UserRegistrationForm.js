import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Snackbar, Box } from '@mui/material';

function UserRegistrationForm({ reRender, token }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      const response = await fetch('http://localhost:7007/api/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('User registered successfully!');
        setMessageOpen(true);
        setMessage('Registered successfully!')
        reRender(true);
      } else {
        console.error('Failed to register user');
        console.log('response: ', response);
        setMessageOpen(true);
        setMessage('Username already exists!')
      }
    } catch (error) {
      console.error('Error during user registration', error);
      setMessage('Failed to register!')
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
    <div> {!isLoggedIn ? (
      <form onSubmit={handleSubmit}>
        <Typography className='pageTitle' variant="h4">User Registration</Typography>
        <TextField
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{backgroundColor: 'green', marginTop: '10px'}}>
          Register
        </Button>
        <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
      </form>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Typography className='welcomeParagraph' align='center'>You are already logged in!</Typography>
        </Box>
    )}
    </div>
  );
}

export default UserRegistrationForm;
