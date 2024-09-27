import { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Collapse, Grid2 } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WindowTile from './WindowTile';

const MyWindows = ({ user, token }) => {
  const [windowsData, setWindowsData] = useState([]);
  const [calendarDetails, setCalendarDetails] = useState({});
  const [openCalendars, setOpenCalendars] = useState({});

  useEffect(() => {
    // Fetch windows owned by the user
    const fetchOwnedWindows = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/ownedWindows?user=${user}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch owned windows.');
        }

        const windows = await response.json();
        setWindowsData(windows);

        // Fetch calendar details for each unique calendar_id
        const calendarRequests = windows.map(async (windowItem) => {
          const { calendar_id } = windowItem;
          const calendarResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/calendar?calendar_id=${calendar_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!calendarResponse.ok) {
            throw new Error(`Failed to fetch calendar details for calendar_id: ${calendar_id}`);
          }

          const calendarData = await calendarResponse.json();
          return { id: calendarData.id, name: calendarData.name, owner: calendarData.owner, additionalInfo: calendarData.additional_info }; // Fetch additional info
        });

        const calendars = await Promise.all(calendarRequests);
        const calendarMap = calendars.reduce((acc, calendar) => {
          acc[calendar.id] = { name: calendar.name, owner: calendar.owner, additionalInfo: calendar.additionalInfo }; // Store name and additional info
          return acc;
        }, {});

        setCalendarDetails(calendarMap);
      } catch (error) {
        console.error('Error fetching windows or calendar details:', error);
      }
    };

    fetchOwnedWindows();
  }, [token, user]);

  // Handle opening/closing of the list items
  const handleToggle = (calendarId) => {
    setOpenCalendars((prevOpenCalendars) => ({
      ...prevOpenCalendars,
      [calendarId]: !prevOpenCalendars[calendarId],
    }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography className='pageTitle' variant="h2" align="center">My Windows</Typography>
      <List>
        {windowsData.map((windowItem) => (
          <div key={windowItem.calendar_id}>
            <ListItem button onClick={() => handleToggle(windowItem.calendar_id)}>
              <ListItemText 
                primary={calendarDetails[windowItem.calendar_id]?.name || "Loading..."} 
                secondary={calendarDetails[windowItem.calendar_id]?.additionalInfo || ""} // Display additional info
              />
              {openCalendars[windowItem.calendar_id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={openCalendars[windowItem.calendar_id]} timeout="auto" unmountOnExit>
              <Grid2 container spacing={2}>
                {windowItem.windows.map((windowNr) => (
                  <WindowTile window_nr={windowNr} calendar_id={windowItem.calendar_id} user={user} calendarOwner={calendarDetails[windowItem.calendar_id]?.owner || null} token={token} />
                ))}
              </Grid2>
            </Collapse>
          </div>
        ))}
      </List>
    </Box>
  );
};

export default MyWindows;
