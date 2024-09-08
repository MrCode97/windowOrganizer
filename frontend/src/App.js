import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemButton } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import DefaultCalendar from './components/DefaultCalendar';
import { useAuth } from './AuthProvider';
import WelcomePage from './components/WelcomePage';
import Login from './components/Login';
import UserRegistrationForm from './components/UserRegistrationForm';
import AdventCalendarRegistrationForm from './components/AdventCalendarRegistrationForm';
import UserSettings from './components/UserSettings';
import MyCalendars from './components/MyCalendars';
import MyWindows from './components/MyWindows';


const drawerWidth = 240;

const Root = styled('div')({
  display: 'flex',
});

const StyledAppBar = styled(AppBar)({
  position: 'fixed',
  height: '64px',
});

const MainBox = styled(Box)({
  flexGrow: 1,
  p: 3,
  marginTop: '64px',
  marginLeft: 0,
  mt: '64px',
});

const Footer = () => {
  return (
    <footer>
      Fundamentals of Web Engineering 2023
    </footer>
  )
}

function App() {
  const { user, token, logout } = useAuth();
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showRegistrationCalendar, setShowRegistrationCalendar] = useState(false);
  const [showMyCalendars, setShowMyCalendars] = useState(false);
  const [showMyWindows, setShowMyWindows] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [userAdded, setUserAdded] = useState(false);


  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/calendars`);
        const data = await response.json();
        setCalendars(data);
      } catch (error) {
        console.error('Error fetching calendars', error);
      }
    };

    fetchCalendars();
  }, [calendarAdded, userAdded, token]);


  return (
    <Router>
      <Root>
        <StyledAppBar>
          <Toolbar className='toolbar'>
            <Typography variant="h6" noWrap>
              {(selectedCalendar) ? selectedCalendar.name : 'Welcome to the Advent Calendar'}
            </Typography>
            {user && (
              <Typography variant="h6" noWrap style={{ marginLeft: 'auto' }}>
                Hello {user}
              </Typography>
            )}
            {user && (
              <Button sx={{ paddingLeft: '20px' }} color="inherit" onClick={logout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </StyledAppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              top: '64px',
              backgroundColor: 'rgb(173, 216, 230)'
            },
          }}
          variant="permanent"
          anchor="left"
          className='sidebar'
        >
          <List>
            <ListItem>
              <ListItemText>
                <Typography variant="p" style={{ fontWeight: 'bold' }}>
                  Info
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItemButton onClick={() => { 
              setShowLogin(false); setShowRegistration(false); setShowRegistrationCalendar(false); setSelectedCalendar(null); setShowMyCalendars(false); setShowMyWindows(false); setShowUserSettings(false);}}>
              <ListItemText primary="Welcome" />
            </ListItemButton>
            <ListItem>
            </ListItem>
          </List>

          <List>
            <ListItem>
              <ListItemText>
                <Typography variant="p" style={{ fontWeight: 'bold' }}>
                  Calendars
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <List>
            {calendars
              .filter(calendar =>
                calendar.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((calendar) => (
                <ListItemButton
                  onClick={() => {setSelectedCalendar(calendar);
                    setShowRegistration(false); setShowRegistrationCalendar(false); setShowLogin(false); setShowMyCalendars(false); setShowUserSettings(false); setShowMyWindows(false);
                  }}
                  key={calendar.name}
                >
                  <ListItemText primary={calendar.name} />
                </ListItemButton>
              ))}
            <ListItem>
            </ListItem>
          </List>
          <List>
            <ListItem>
              <ListItemText>
                <Typography variant="p" style={{ fontWeight: 'bold' }}>
                  Administration
                </Typography>
              </ListItemText>
            </ListItem>
            {!user && (
              <ListItemButton onClick={() => { setShowLogin(true); 
                setShowRegistration(false); setShowRegistrationCalendar(false); setSelectedCalendar(null); setShowMyCalendars(false); setShowUserSettings(false); setShowMyWindows(false); }}>
                <ListItemText primary="Login" />
              </ListItemButton>
            )}
            {!user && (
              <ListItemButton onClick={() => { setShowRegistration(true); 
                setShowLogin(false); setShowRegistrationCalendar(false); setSelectedCalendar(null); setShowMyCalendars(false); setShowUserSettings(false); setShowMyWindows(false);}}>
                <ListItemText primary="Register a User" />
              </ListItemButton>
            )}
            {user && (
              <ListItemButton onClick={() => { setShowMyCalendars(true);
                setShowRegistrationCalendar(false); setShowLogin(false); setShowRegistration(false); setSelectedCalendar(null); setShowUserSettings(false); setShowMyWindows(false);}}>
                <ListItemText primary="My Calendars" />
              </ListItemButton>
            )}
            {user && (
              <ListItemButton onClick={() => { setShowMyWindows(true);
                setShowMyCalendars(false); setShowUserSettings(false); setShowRegistrationCalendar(false); setShowLogin(false); setShowRegistration(false); setSelectedCalendar(null); }}>
                <ListItemText primary="My Windows" />
              </ListItemButton>
            )}
            {user && (
              <ListItemButton onClick={() => { setShowRegistrationCalendar(true); 
                setShowLogin(false); setShowRegistration(false); setSelectedCalendar(null); setShowMyCalendars(false); setShowMyCalendars(false); setShowMyWindows(false); setShowUserSettings(false);}}>
                <ListItemText primary="Register a Calender" />
              </ListItemButton>
            )}
            {user && (
              <ListItemButton onClick={() => { setShowUserSettings(true); 
                setShowRegistrationCalendar(false); setShowLogin(false); setShowRegistration(false); setSelectedCalendar(null); setShowMyCalendars(false); setShowMyWindows(false); }}>
                <ListItemText primary="User Settings" />
              </ListItemButton>
            )}
          </List>

        </Drawer>
        <MainBox component="main" className='mainBox'>
          <Container className='mainContainer' >
            {!user && (
              <>
              {showLogin && (
                <Login userAdded={userAdded} setUserAdded={setUserAdded} />
              )}
              {showRegistration && (
                <UserRegistrationForm />
              )}
              {calendars.length > 0 && selectedCalendar && (
                <DefaultCalendar
                id={selectedCalendar.id}
                name={selectedCalendar.name}
                user={user}
                token={token}
              />
              )}
              {!selectedCalendar && !showLogin && !showRegistration && (
                <WelcomePage/>
              )}
            </>
          )}
            {user && (
              <>
                {showRegistration && (
                  <UserRegistrationForm token={token} />
                )}
                {calendars.length > 0 && selectedCalendar && (
                          <DefaultCalendar
                            id={selectedCalendar.id}
                            name={selectedCalendar.name}
                            user={user}
                            token={token}
                          />
                        )}
                {showMyCalendars && (
                  <MyCalendars calendarAdded={calendarAdded} setCalendarAdded={setCalendarAdded} user={user} token={token}/>
                )}
                {showMyWindows && (
                  <MyWindows user={user} token={token}/>
                )}
                {showRegistrationCalendar && (
                  <AdventCalendarRegistrationForm calendarAdded={calendarAdded} setCalendarAdded={setCalendarAdded} token={token} />
                )}
                {showUserSettings && (
                  <UserSettings user={user} token={token} userAdded={userAdded} setUserAdded={setUserAdded}/>
                )}
                {!selectedCalendar && !showMyCalendars && !showMyWindows && !showRegistrationCalendar && !showUserSettings && (
                  <WelcomePage/>
                )}
              </>
            )}
          </Container>
          <br />
          <Footer />
        </MainBox>
      </Root>
    </Router>
  );
}

export default App;
