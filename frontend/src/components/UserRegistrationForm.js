import { useState } from 'react';
import { Typography, TextField, Button, Snackbar, Box } from '@mui/material';

function UserRegistrationForm({ token, setShowRegistration, setShowLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/registerUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setMessageOpen(true);
        setMessage('Registered successfully!')
        setUsername('');
        setPassword('');
        setShowLogin(true);
        setShowRegistration(false);
      } else {
        console.error('Failed to register user');
        setMessageOpen(true);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error('Error during user registration', error);
      setMessage('Failed to register!')
      setMessageOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    setMessageOpen(false);
  };

  return (
    <div> {!token ? (
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
        <Button type="submit" variant="contained" sx={{ backgroundColor: 'green', marginTop: '10px' }}>
          Register
        </Button>
        <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
      </form>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography className='welcomeParagraph' align='center'>You are already logged in!</Typography>
      </Box>
    )}
    </div>
  );
}

export default UserRegistrationForm;
