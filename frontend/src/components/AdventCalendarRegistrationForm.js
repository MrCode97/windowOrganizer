import { useState } from 'react';
import { Typography, TextField, Button, Snackbar, Checkbox, FormControlLabel } from '@mui/material';
import { useAdventCalendarRegistrationFormStrings } from '../contexts/text';

function LoginHint(hint) {
  return (
    <div>
      <Typography className='pageTitle' variant="h4">Advent Calendar Registration</Typography>
      <Typography sx={{ padding: '10px' }} variant="body1">
        {hint}
      </Typography>
    </div>
  );
}

function AdventCalendarRegistrationForm({ calendarAdded, setCalendarAdded, setShowRegistrationCalendar, token }) {
  const [adventCalendarId, setAdventCalendarId] = useState('');
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState(''); 
  const [consentChecked, setConsentChecked] = useState(false);

  const {
    title,
    name,
    description,
    consent,
    register,
    hintSuccess,
    hintError,
    hintConsent,
    hintLogin,
  } = useAdventCalendarRegistrationFormStrings();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!consentChecked) {
      setMessage({hintConsent});
      setMessageOpen(true);
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/registerAdventCalendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ adventCalendarId, additionalInfo }),
      });
  
      if (response.ok) {
        setCalendarAdded(!calendarAdded);
        setAdventCalendarId('');
        setAdditionalInfo('');
        setMessage({hintSuccess});
        setMessageOpen(true);
        window.location.href = `/?calendarName=${adventCalendarId}`;
        setShowRegistrationCalendar(false);
      } else {
        console.error('Failed to register advent calendar');
        setMessage({hintError});
        setMessageOpen(true);
      }
    } catch (error) {
      console.error('Error during form submission', error);
      setMessageOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageOpen(false);
  };

  return (
    <div> 
      {token ? (
        <form onSubmit={handleSubmit}>
          <Typography className='pageTitle' variant="h4">{title}</Typography>
          <TextField
            label={name}
            fullWidth
            value={adventCalendarId}
            onChange={(e) => setAdventCalendarId(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            label={description}
            fullWidth
            multiline
            rows={4}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          
          <FormControlLabel
            control={
              <Checkbox
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                name="consentCheckbox"
                color="primary"
              />
            }
            label={consent}
            sx={{ marginBottom: '20px' }}
          />
          
          <Button type="submit" variant="contained" sx={{ backgroundColor: 'green' }}>
            {register}
          </Button>
          
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </form>
      ) : (
        <LoginHint hint={hintLogin} />
      )}
    </div>
  );
}

export default AdventCalendarRegistrationForm;
