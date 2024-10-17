// UserSettings.js
import { useState } from 'react';
import { Typography, Box, TextField, Button, Snackbar } from '@mui/material';
import { useAuth } from '../AuthProvider';
import { useUserSettingsStrings } from '../contexts/text';

const UserSettings = ({user, token, userAdded, setUserAdded}) => {
    const { login } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageOpen, setMessageOpen] = useState(false);
    const {
        hintNotMatch,
        hintUpdate,
        hintUpdateError,
        old_password,
        new_password,
        confirm_password,
        change
    } = useUserSettingsStrings();

    const handlePasswordChange = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setMessage({hintNotMatch});
            setNewPassword('');
            setConfirmNewPassword('');
            setMessageOpen(true);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/user/changePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (response.ok) {
                const { token: newToken } = await response.json();
                login({ username: user }, newToken);
                setMessage({hintUpdate});
                setMessageOpen(true);
                setUserAdded(!userAdded);
            } else {
                console.error('Password change failed');
                setOldPassword('');
                setMessage({hintUpdateError});
                setMessageOpen(true);
            }
        } catch (error) {
            console.error('Error changing password!', error);
            setMessage({hintUpdateError});
            setMessageOpen(true);
        }
    };

    const handleClose = () => {
        setMessageOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography className='pageTitle' variant="h2" align="center">{change}</Typography>
            <form onSubmit={handlePasswordChange} style={{ width: '300px', marginTop: '20px' }}>
                <TextField
                    label={old_password}
                    type="password"
                    fullWidth
                    margin="normal"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                />
                <TextField
                    label={new_password}
                    type="password"
                    fullWidth
                    margin="normal"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <TextField
                    label={confirm_password}
                    type="password"
                    fullWidth
                    margin="normal"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '20px' }}>
                    {change}
                </Button>
            </form>
            <Snackbar
                open={messageOpen}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
            />
        </Box>
    );
};

export default UserSettings;
