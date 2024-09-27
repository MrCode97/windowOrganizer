import { useState, useEffect } from 'react';
import { Button, TextField, FormControlLabel, Checkbox, Typography } from '@mui/material';
import { translate } from './GeocodeAddress';

const OwnerEditSection = ({ calendar_id, window_nr, onClose, setIsFree, token, locationAdded, setLocationAdded }) => {
  const [addressName, setAddressName] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [locationHint, setLocationHint] = useState('');
  const [hasApero, setHasApero] = useState(false);
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/window?calendar_id=${calendar_id}&window_nr=${window_nr}`);
        const { windowData } = await response.json();
        const { address_name, address, apero, time, location_hint } = windowData;

        setAddressName(address_name);
        setCoordinates(address); // Assuming address is in coordinate format
        setLocationHint(location_hint);
        setHasApero(apero);
        setTime(time);
      } catch (error) {
        console.error('Error fetching window data:', error);
      }
    };

    fetchData();
  }, [calendar_id, window_nr]);

  useEffect(() => {
  }, [coordinates]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newCoords = await translate(addressName);
    setCoordinates(newCoords);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateWindowHosting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ calendar_id, window_nr, addressName, coords: newCoords, time, locationHint, hasApero }),
      });

      if (response.ok) {
        setMessage('Window details updated successfully!');
        if (setLocationAdded) { // if rendered from MyWindows, there is no globalMap so no need to reRender and parent doesn't have the property anyways
          setLocationAdded(!locationAdded);
        }
      } else {
        setMessage('Failed to update window details.');
      }
    } catch (error) {
      console.error('Error updating window details:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleDeleteWindow = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delWindowHosting?calendar_id=${calendar_id}&window_nr=${window_nr}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setMessage('Window deleted successfully');
        onClose();
        setLocationAdded(!locationAdded);
        setIsFree(true);
      } else {
        setMessage('Failed to delete window');
      }
    } catch (error) {
      setMessage('Error deleting window');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4">{window_nr}. Advent Window - Edit Mode</Typography>
      <TextField
        label="Address Name"
        value={addressName}
        onChange={(e) => setAddressName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Time"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Location Hint"
        value={locationHint}
        onChange={(e) => setLocationHint(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={hasApero}
            onChange={(e) => setHasApero(e.target.checked)}
          />
        }
        label="Has Apéro"
      />
      <Button type="submit" variant="contained" color="primary">
        Save Changes
      </Button>
      <Button onClick={handleDeleteWindow} variant="contained" color="secondary">
        Delete/Deregister Window
      </Button>
      {message && <Typography variant="body1" color="error">{message}</Typography>}
    </form>
  );
};

export default OwnerEditSection;
