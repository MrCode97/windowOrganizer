import React, { useState } from 'react';
import { Typography, TextField, Button } from '@mui/material';

function UserRegistrationForm({ reRender }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Replace the following with your actual API endpoint
      const response = await fetch('http://localhost:7007/api/registerUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('User registered successfully!');
        // You can add additional logic here, such as redirecting the user or displaying a success message
        reRender(true);
      } else {
        console.error('Failed to register user');
        console.log('response: ', response);
        // You can handle the error appropriately, for example, displaying an error message to the user
      }
    } catch (error) {
      console.error('Error during user registration', error);
      // You can handle the error appropriately, for example, displaying an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4">User Registration</Typography>
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
      <Button type="submit" variant="contained" color="primary">
        Register
      </Button>
    </form>
  );
}

export default UserRegistrationForm;
