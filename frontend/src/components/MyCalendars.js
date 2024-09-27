import { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Button, Snackbar, TextField, Tooltip } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MyCalendars = ({ calendarAdded, setCalendarAdded, setSelectedCalendar, user, token }) => {
  const [calendarData, setCalendarData] = useState([]);
  const [openCalendars, setOpenCalendars] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [showShareLink, setShowShareLink] = useState({}); 
  const [copySuccess, setCopySuccess] = useState('');
  const [lockState, setLockState] = useState(false);

  useEffect(() => {
    // Fetch owned calendars by the user
    const fetchOwnedCalendars = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/ownedCalendars?user=${user}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch owned calendars.');
        }

        const calendars = await response.json();
        setCalendarData(calendars);

        // Initialize updateData with fetched calendars
        const initialUpdateData = calendars.reduce((acc, calendar) => {
          acc[calendar.id] = {
            name: calendar.name || '',
            additionalInfo: calendar.additional_info || '',
            locked: calendar.locked || false,
          };
          return acc;
        }, {});

        setUpdateData(initialUpdateData);
        setLockState(calendars.locked);
      } catch (error) {
        console.error('Error fetching calendars:', error);
      }
    };

    fetchOwnedCalendars();
  }, [token, user, calendarAdded, lockState]);

  // Handle opening/closing of the list items
  const handleToggle = (calendarId) => {
    setOpenCalendars((prevOpenCalendars) => ({
      ...prevOpenCalendars,
      [calendarId]: !prevOpenCalendars[calendarId],
    }));
  };

  // Handle input changes
  const handleInputChange = (calendarId, field, value) => {
    setUpdateData((prevData) => ({
      ...prevData,
      [calendarId]: {
        ...prevData[calendarId],
        [field]: value,
      },
    }));
  };

  // Handle updating a calendar
  const handleUpdateCalendar = async (calendarId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/updateAdventCalendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ calendar_id: calendarId, ...updateData[calendarId] }),
      });

      if (response.ok) {
        setCalendarAdded(!calendarAdded);
        updateData[calendarId] = '';
        setMessage('Advent calendar updated successfully!');
        setMessageOpen(true);
      } else {
        console.error('Failed to update advent calendar');
        setMessage('Failed to update advent calendar');
        setMessageOpen(true);
      }
    } catch (error) {
      console.error('Error during calendar update:', error);
      setMessage('Error during calendar update');
      setMessageOpen(true);
    }
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = (calendarName) => {
    const shareableLink = `${window.location.origin}/?calendarName=${encodeURIComponent(calendarName)}`;
    navigator.clipboard.writeText(shareableLink)
      .then(() => setCopySuccess('Link copied to clipboard!'))
      .catch(() => setCopySuccess('Failed to copy link'));
  };

  // Handle locking a calendar
  const handleLockCalendar = async (calendarId, lockState) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/lockAdventCalendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ calendar_id: calendarId, lock: lockState }),
      });

      if (response.ok) {
        setMessage(`Advent calendar ${lockState ? 'locked' : 'unlocked'} successfully!`);
        setLockState(lockState);
        setMessageOpen(true);
      } else {
        console.error(`Failed to ${lockState ? 'lock' : 'unlock'} advent calendar`);
        setMessage(`Failed to ${lockState ? 'lock' : 'unlock'} advent calendar`);
        setMessageOpen(true);
      }
    } catch (error) {
      console.error(`Error during calendar ${lockState ? 'lock' : 'unlock'}:`, error);
      setMessage(`Error during calendar ${lockState ? 'lock' : 'unlock'}`);
      setMessageOpen(true);
    }
  };

  // Handle deleting a calendar
  const handleDeleteCalendar = async (calendarId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delAdventCalendar?calendar_id=${calendarId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSelectedCalendar(null);
        setCalendarAdded(!calendarAdded);
        setMessage('Advent calendar deleted successfully!');
        setMessageOpen(true);
      } else {
        console.error('Failed to delete advent calendar');
        setMessage('Failed to delete advent calendar');
        setMessageOpen(true);
      }
    } catch (error) {
      console.error('Error during calendar deletion:', error);
      setMessage('Error during calendar deletion');
      setMessageOpen(true);
    }
  };

  // Close message snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setMessageOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography className='pageTitle' variant="h2" align="center">My Calendars</Typography>
      <List>
        {calendarData.map((calendar) => (
          <div key={calendar.id}>
            <ListItem button onClick={() => handleToggle(calendar.id)}>
              <ListItemText
                primary={`${calendar.name} ${calendar.additionalInfo || ""} ${calendar.locked ? "(Locked)" : "(Unlocked)"}`|| "Loading..."}
                secondary={calendar.additionalInfo || ""} // Display additional info below name
              />
              {openCalendars[calendar.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            {openCalendars[calendar.id] && (
              <Box sx={{ p: 2 }}>
                <TextField
                  label="Calendar Name"
                  fullWidth
                  value={updateData[calendar.id]?.name || ''}
                  onChange={(e) => handleInputChange(calendar.id, 'name', e.target.value)}
                />
                <TextField
                  label="Additional Information"
                  fullWidth
                  multiline
                  rows={4}
                  value={updateData[calendar.id]?.additionalInfo || ''}
                  onChange={(e) => handleInputChange(calendar.id, 'additionalInfo', e.target.value)}
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: 'green' }}
                  onClick={() => handleUpdateCalendar(calendar.id)}
                >
                  Update Calendar
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => setShowShareLink((prev) => ({ ...prev, [calendar.id]: !prev[calendar.id] }))}
                >
                  Share Calendar
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleLockCalendar(calendar.id, !calendar.locked)}
                >
                  {calendar.locked ? "Unlock Calendar" : "Lock Calendar"}
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleDeleteCalendar(calendar.id)}
                >
                  Delete Calendar
                </Button>

                {showShareLink[calendar.id] && (
                  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <TextField
                      value={`${window.location.origin}/?calendarName=${encodeURIComponent(calendar.name)}`}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ width: '300px', marginRight: '10px' }}
                    />
                    <Tooltip title="Copy to Clipboard">
                      <Button onClick={() => handleCopyToClipboard(calendar.name)} variant="contained">
                        Copy
                      </Button>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            )}
          </div>
        ))}
      </List>
      <Snackbar open={messageOpen} autoHideDuration={3000} onClose={handleClose} message={message} />
      {copySuccess && <Typography color="success.main">{copySuccess}</Typography>}
    </Box>
  );
}

export default MyCalendars;
