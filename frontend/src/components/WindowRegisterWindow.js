// WindowRegisterWindow.js
import { useState } from 'react';
import { Dialog, DialogContent, Typography, TextField, Button, FormControlLabel, Checkbox, Snackbar } from '@mui/material';
import { translate } from './GeocodeAddress';
import { useWindowRegistrationWindowStrings } from '../contexts/text';

function WindowRegisterWindow({ window_nr, calendar_id, onClose, token, locationAdded, setLocationAdded }) {
  const [addressName, setAddressName] = useState('');
  const [time, setTime] = useState('');
  const [locationHint, setLocationHint] = useState('');
  const [hasApero, setHasApero] = useState(false);
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const {
    hintSuccess,
    hintError,
    title,
    address,
    timeText,
    description,
    apero,
    host,
    hintLogin
  } = useWindowRegistrationWindowStrings();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const coords = await translate(addressName);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/registerWindowHosting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ calendar_id, window_nr, addressName, coords, time, locationHint, hasApero }),
      });

      if (response.ok) {
        setMessage({ hintSuccess });
        setLocationAdded(!locationAdded);
        setMessageOpen(true);
        onClose();
      } else {
        console.error('Failed to register window hosting');
        setMessage({ hintError });
      }
    } catch (error) {
      console.error('Error during window hosting registration', error);
      setMessage({ hintError });
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
        <Dialog open={true} onClose={onClose} sx={{ zIndex: 9999, top: '4%', position: 'fixed', overflowY: 'auto' }}>
          <DialogContent sx={{ width: '400px', height: '700px', }}>
            <form onSubmit={handleSubmit}>
              <Typography variant="h4">{title}</Typography>
              <TextField
                label={address}
                fullWidth
                value={addressName}
                onChange={(e) => setAddressName(e.target.value)}
              />
              <TextField
                label={timeText}
                fullWidth
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <TextField
                label={description}
                fullWidth
                value={locationHint}
                onChange={(e) => setLocationHint(e.target.value)}
              />
              <span className='buttonContainerSlidingWindow'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasApero}
                      onChange={(e) => setHasApero(e.target.checked)}
                      name="hasApero"
                    />
                  }
                  label={apero}
                />
                <Button type="submit" variant="contained" sx={{ backgroundColor: 'green' }}>
                  {host}
                </Button>
              </span>
            </form>
          </DialogContent>
          <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
        </Dialog>
      ) : (
        <div>
          <Dialog open={true} onClose={onClose} sx={{ zIndex: 9999, position: 'sticky' }}>
            <DialogContent sx={{ width: '400px', height: '700px' }}>
              <Typography variant="h4">{title}</Typography>
              <Typography variant="p">{hintLogin}</Typography>
            </DialogContent>
            <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default WindowRegisterWindow;