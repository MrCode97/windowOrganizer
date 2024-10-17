import { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Button, Snackbar, TextField, Tooltip } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useMyCalendarsStrings } from '../contexts/text';

const MyCalendars = ({ calendarAdded, setCalendarAdded, setSelectedCalendar, user, token }) => {
  const [calendarData, setCalendarData] = useState([]);
  const [openCalendars, setOpenCalendars] = useState({});
  const [updateData, setUpdateData] = useState({});
  const [message, setMessage] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const [showShareLink, setShowShareLink] = useState({}); 
  const [copySuccess, setCopySuccess] = useState('');
  const [lockState, setLockState] = useState(false);

  const { title, calendarName, description, share, lockCalendar, unlockCalendar, deleteCalendar, hintCopy, hintCopyError, updatedSuccessfully, updatedUnsuccessfully, adventcalendar, lock, unlocked, successfully, failed, deleteSuccess, deleteError, copy } = useMyCalendarsStrings();

  useEffect(() => {
    // Fetch owned calendars by the user
    const fetchOwnedCalendars = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/user/ownedCalendars?user=${user}`, {
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

  const handleToggle = (calendarId) => {
    setOpenCalendars((prevOpenCalendars) => ({
      ...prevOpenCalendars,
      [calendarId]: !prevOpenCalendars[calendarId],
    }));
  };

  const handleInputChange = (calendarId, field, value) => {
    setUpdateData((prevData) => ({
      ...prevData,
      [calendarId]: {
        ...prevData[calendarId],
        [field]: value,
      },
    }));
  };

  const handleUpdateCalendar = async (calendarId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/updateAdventCalendar`, {
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
        setMessage({updatedSuccessfully});
        setMessageOpen(true);
      } else {
        console.error('Failed to update advent calendar');
        setMessage(updatedUnsuccessfully);
        setMessageOpen(true);
      }
    } catch (error) {
      console.error('Error during calendar update:', error);
      setMessage({updatedUnsuccessfully});
      setMessageOpen(true);
    }
  };

  const handleCopyToClipboard = (calendarName) => {
    const shareableLink = `${window.location.origin}/?calendarName=${encodeURIComponent(calendarName)}`;
    navigator.clipboard.writeText(shareableLink)
      .then(() => setCopySuccess({hintCopy}))
      .catch(() => setCopySuccess({hintCopyError}));
  };

  const handleLockCalendar = async (calendarId, lockState) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/lockAdventCalendar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ calendar_id: calendarId, lock: lockState }),
      });

      if (response.ok) {
        setMessage(`${adventcalendar} ${lockState ? ({lock}) : ({unlocked})} ${successfully}!`);

        setLockState(lockState);
        setCalendarAdded(!calendarAdded);
        setMessageOpen(true);
      } else {
        console.error(`${failed} ${lockState ? ({lock}) : ({unlocked})} ${adventcalendar}`);
        setMessage(`Failed to ${lockState ? 'lock' : 'unlock'} advent calendar`);
        setMessageOpen(true);
      }
    } catch (error) {
      console.error(`Error during calendar ${lockState ? 'lock' : 'unlock'}:`, error);
      setMessage(`Error during calendar ${lockState ? 'lock' : 'unlock'}`);
      setMessageOpen(true);
    }
  };

  const handleDeleteCalendar = async (calendarId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/delAdventCalendar?calendar_id=${calendarId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSelectedCalendar(null);
        setCalendarAdded(!calendarAdded);
        setMessage({deleteSuccess});
        setMessageOpen(true);
      } else {
        console.error('Failed to delete advent calendar');
        setMessage({deleteError});
        setMessageOpen(true);
      }
    } catch (error) {
      console.error('Error during calendar deletion:', error);
      setMessage('Error during calendar deletion');
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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography className='pageTitle' variant="h2" align="center">{title}</Typography>
      <List>
        {calendarData.map((calendar) => (
          <div key={calendar.id}>
            <ListItem button onClick={() => handleToggle(calendar.id)}>
              <ListItemText
                primary={`${calendar.name} ${calendar.additionalInfo || ""} ${calendar.locked ? "(Locked)" : "(Unlocked)"}`|| "Loading..."}
                secondary={calendar.additionalInfo || ""}
              />
              {openCalendars[calendar.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            {openCalendars[calendar.id] && (
              <Box sx={{ p: 2 }}>
                <TextField
                  label={calendarName}
                  fullWidth
                  value={updateData[calendar.id]?.name || ''}
                  onChange={(e) => handleInputChange(calendar.id, 'name', e.target.value)}
                />
                <TextField
                  label={description}
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
                  {share}
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleLockCalendar(calendar.id, !calendar.locked)}
                >
                  {calendar.locked ? `${unlockCalendar}` : `${lockCalendar}` }
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleDeleteCalendar(calendar.id)}
                >
                  {deleteCalendar}
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
                        {copy}
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
