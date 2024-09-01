import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box, Snackbar } from '@mui/material';
import { useAuth } from '../AuthProvider';

function Login( { reRender, token } ) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
    const [messageOpen, setMessageOpen] = useState(false);

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

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            console.log('Login successful!');
            // Handle successful login, e.g., redirecting the user or setting authentication state
            const { token } = await response.json();
            login({ username }, token);

            reRender(true);
        } else {
            console.error('Login failed');
            // Handle failed login, e.g., display an error message to the user
            setPassword('');
            setMessageOpen(true);
            setMessage('Login failed!')
        }
        } catch (error) {
        console.error('Error during login', error);
        // Handle error, e.g., display an error message to the user
        }
    };

    const handleClose = (event, reason) => {
        setMessageOpen(false);
    };

    return (
        <div> {!isLoggedIn ? (
            <form onSubmit={handleLogin}>
            <Typography className='pageTitle' variant="h4">Login</Typography>
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
                Login
            </Button>
            <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message}/>
            </form>
        ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography className='welcomeParagraph' align='center'>You are already logged in!</Typography>
            </Box>
        )}
        </div>
    );
    }

export default Login;
