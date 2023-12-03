// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { styled } from '@mui/system';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Registration from './components/Registration';
import Calendar from './components/Calendar';
import DefaultCalendar from './components/DefaultCalendar';

const drawerWidth = 240;

const Root = styled('div')({
  display: 'flex',
});

const StyledAppBar = styled(AppBar)({
  position: 'fixed',
  width: `calc(100% - ${drawerWidth}px)`,
  height: '64px',
});

const MainBox = styled(Box)({
  flexGrow: 1,
  p: 3,
  marginTop: '64px',
  marginLeft: drawerWidth,
  mt: '64px',
});

function App() {
  const [calendars, setCalendars] = useState([
    { name: 'Adventskalender Schlieren 8952', details: 'Details for Advent Calendar 1' },
    { name: 'Adventskalender Basel 4057', details: 'Details for Advent Calendar 2' },
    { name: 'some other registered calendar', details: 'Details for Advent Calendar 3' },
    // TODO: this will have to read from a database / backend API which are existing
  ]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);


  return (
    <Router>
      <Root>
        <StyledAppBar>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Welcome to the Advent Calendar
            </Typography>
          </Toolbar>
        </StyledAppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              top: '64px',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <List>
            <ListItem button onClick={() => setShowRegistration(true)}>
              <ListItemText primary="Register" />
            </ListItem>
          </List>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <List>
            {calendars.filter(calendar => calendar.name.includes(searchTerm)).map((calendar) => (
              <ListItem 
                button 
                onClick={() => {
                  setSelectedCalendar(null);
                  setSelectedCalendar(calendar);
                  setShowRegistration(false);
                }} 
                key={calendar.name}
              >
                <ListItemText primary={calendar.name} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <MainBox component="main">
          <Container>
            {showRegistration ? (
              <Registration setCalendars={setCalendars} />
            ) : (
              <DefaultCalendar 
                name={selectedCalendar ? selectedCalendar.name : 'Default Calendar'}
                details={selectedCalendar ? selectedCalendar.details : 'This is the default calendar page.'}
              />
            )}
            <Routes>
              <Route path="/calendar/:id" element={<Calendar />} />
            </Routes>
          </Container>
        </MainBox>
      </Root>
    </Router>
  );
}

export default App;