import React, { useState } from 'react';
import { Typography, TextField, Button } from '@mui/material';
import { useAuth } from '../AuthProvider';

function Login( { reRender } ) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
        const response = await fetch('http://localhost:7007/api/login', {
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
        }
        } catch (error) {
        console.error('Error during login', error);
        // Handle error, e.g., display an error message to the user
        }
    };

    return (
        <form onSubmit={handleLogin}>
        <Typography className='registrationHeader' variant="h4">Login</Typography>
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
        </form>
    );
    }

export default Login;
