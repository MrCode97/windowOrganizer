import React, { useState } from 'react';
import { Typography, TextField, Button, Snackbar } from '@mui/material';

function UserRegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);

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
    <form onSubmit={handleSubmit}>
      <Typography className='registrationHeader' variant="h4">User Registration</Typography>
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
  );
}

export default UserRegistrationForm;
