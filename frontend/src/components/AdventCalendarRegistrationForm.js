import { useState } from 'react';
import { Typography, TextField, Button, Snackbar, Checkbox, FormControlLabel } from '@mui/material';

function LoginHint() {
  return (
    <div>
      <Typography className='pageTitle' variant="h4">Advent Calendar Registration</Typography>
      <Typography sx={{ padding: '10px' }} variant="body1">
        Please log in first to register an advent calendar.
      </Typography>
    </div>
  );
}

function AdventCalendarRegistrationForm({ calendarAdded, setCalendarAdded, token }) {
  const [adventCalendarId, setAdventCalendarId] = useState('');
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState(''); 
  const [consentChecked, setConsentChecked] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!consentChecked) {
      setMessage('You must agree to the terms before registering.');
      setMessageOpen(true);
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/registerAdventCalendar`, {
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
        setMessage('Advent calendar registered successfully!');
        setMessageOpen(true);
        window.location.href = `/?calendarName=${adventCalendarId}`;
      } else {
        console.error('Failed to register advent calendar');
        setMessage('Failed to register advent calendar');
        setMessageOpen(true);
      }
    } catch (error) {
      console.error('Error during form submission', error);
      setMessage('Error during form submission');
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
          <Typography className='pageTitle' variant="h4">Advent Calendar Registration</Typography>
          <TextField
            label="Advent Calendar Name"
            fullWidth
            value={adventCalendarId}
            onChange={(e) => setAdventCalendarId(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />
          <TextField
            label="Additional Information"
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
            label="I agree that the creator of the calendar is responsible for ensuring that no unlawful content, such as sexist, racist, religious, or offensive comments or images, is uploaded to this calendar. The creator must actively monitor and remove any problematic content."
            sx={{ marginBottom: '20px' }}
          />
          
          <Button type="submit" variant="contained" sx={{ backgroundColor: 'green' }}>
            Register
          </Button>
          
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </form>
      ) : (
        <LoginHint />
      )}
    </div>
  );
}

export default AdventCalendarRegistrationForm;
