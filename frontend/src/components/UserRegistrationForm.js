import { useState } from 'react';
import { Typography, TextField, Button, Snackbar, Box } from '@mui/material';
import { useUserRegistrationStrings } from '../contexts/text';

function UserRegistrationForm({ token, setShowRegistration, setShowLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const { hintSuccess, hintError, hintLoggedin, usernameText, passwordText, registerText, title } = useUserRegistrationStrings();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/registerUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setMessageOpen(true);
        setMessage(hintSuccess)
        setUsername('');
        setPassword('');
        setShowLogin(true);
        setShowRegistration(false);
      } else {
        const body = await response.json()
        setMessage(hintError + ' (' + JSON.stringify(body.error) + ')');
        setMessageOpen(true);
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error('Error during user registration', error);
      setMessage(hintError + ' (' + error + ')')
      setMessageOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    setMessageOpen(false);
  };

  return (
    <div> {!token ? (
      <form onSubmit={handleSubmit}>
        <Typography className='pageTitle' variant="h4">{title}</Typography>
        <TextField
          label={usernameText}
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label={passwordText}
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ backgroundColor: 'green', marginTop: '10px' }}>
          {registerText}
        </Button>
        <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
      </form>
    ) : (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography className='welcomeParagraph' align='center'>{hintLoggedin}</Typography>
      </Box>
    )}
    </div>
  );
}

export default UserRegistrationForm;
