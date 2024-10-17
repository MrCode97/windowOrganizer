import { useState } from 'react';
import { Typography, TextField, Button, Box, Snackbar } from '@mui/material';
import { useAuth } from '../AuthProvider';
import { useLoginStrings } from '../contexts/text';

function Login({ userAdded, setUserAdded, token }) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageOpen, setMessageOpen] = useState(false);

    const { title, usernameText, passwordText, hintError, hintLoggedin } = useLoginStrings();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const { token } = await response.json();
                login({ username }, token);
                setUserAdded(!userAdded);
            } else {
                console.error('Login failed');
                setPassword('');
                setMessageOpen(true);
                setMessage({hintError})
            }
        } catch (error) {
            console.error('Error during login', error);
        }
    };

    const handleClose = (event, reason) => {
        setMessageOpen(false);
    };

    return (
        <div> {!token ? (
            <form onSubmit={handleLogin}>
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
                    {title}
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

export default Login;
