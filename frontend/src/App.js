import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
import { ThemeProvider } from '@mui/material/styles';
import theme from './CreateTheme';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ImpressumPage from './components/Impressum';

const drawerWidth = 240;


const Root = styled('div')({
  display: 'flex',
});

const MainBox = styled(Box)({
  flexGrow: 1,
  p: 3,
  marginTop: '64px',
  marginLeft: 0,
  mt: '64px',
  backgroundImage: `url(${require('./assets/images/blue-snow_colored.png')})`, // Using require to dynamically load the image
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat',
  backgroundColor: '#f0f0f0',
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
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
  const [showSearch, setShowSearch] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showImpressum, setShowImpressum] = useState(false);

  const query = useQuery();
  const calendarNameParam = query.get('calendarName');

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/calendars`);
        if (!response.ok) {
          throw new Error('Failed to fetch calendars');
        }

        const data = await response.json();
        setCalendars(data);

        // Check for 'calendarName' parameter in the URL
        if (calendarNameParam) {
          const calendar = data.find((c) => c.name === calendarNameParam);
          if (calendar) {
            setSelectedCalendar(calendar); // Preselect the calendar
            setShowCalendar(true);
            setShowWelcome(false);
          }
        }
      } catch (error) {
        console.error('Error fetching calendars', error);
      }
    };

    fetchCalendars();
  }, [calendarAdded, userAdded, token, calendarNameParam]);

  // Function to toggle search field visibility
  const toggleSearchField = () => {
    setShowSearch((prevShowSearch) => !prevShowSearch); // Toggle between true and false
  };

  return (
    <ThemeProvider theme={theme}>

      <Root>
        <AppBar position="fixed">
          <Toolbar className='toolbar'>
            <Typography variant="h6" noWrap>
              {selectedCalendar ? selectedCalendar.name : 'Welcome to the Advent Calendar'}
            </Typography>
            {user && (
              <Typography variant="h6" noWrap sx={{ marginLeft: 'auto' }}>
                Hello {user}
              </Typography>
            )}
            {user && (
              <Button sx={{ paddingLeft: '20px', color: '#FFF4E0' }} onClick={() => { logout(); setShowLogin(false); }}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              top: '64px',
              backgroundColor: '#2D2923',
              color: '#FFF4E0', // Light beige text color
              borderRight: '2px solid #D4AF37', // Golden border for an elegant look
              display: 'flex',
              flexDirection: 'column',
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
              setShowWelcome(true); setShowCalendar(false); setShowLogin(false); setShowRegistration(false); setShowRegistrationCalendar(false); setShowMyCalendars(false); setShowMyWindows(false); setShowUserSettings(false); setSearchTerm(''); setShowSearch(false); setShowImpressum(false);
            }}>
              <ListItemText primary="Welcome" />
            </ListItemButton>
            <ListItemButton onClick={() => {
              setShowImpressum(true); setShowWelcome(false); setShowCalendar(false); setShowLogin(false); setShowRegistration(false); setShowRegistrationCalendar(false); setShowMyCalendars(false); setShowMyWindows(false); setShowUserSettings(false); setSearchTerm(''); setShowSearch(false);
            }}>
              <ListItemText primary="Impressum" />
            </ListItemButton>
          </List>

          <List>
            <ListItem>
              <ListItemText>
                <Typography variant="p" style={{ fontWeight: 'bold' }}>
                  Calendars
                </Typography>
              </ListItemText>
              {/* Search Icon */}
              <IconButton onClick={toggleSearchField}>
                <SearchIcon sx={{ color: '#FFF4E0' }} />
              </IconButton>
            </ListItem>
            {selectedCalendar && !showSearch && (
              <ListItem sx={{
                border: '2px solid orange', // Orange border
                borderRadius: '4px', // Optional: rounded corners
                padding: '8px', // Optional: add padding to the item
              }}>
                <ListItemButton
                  onClick={() => { setShowWelcome(false); setShowCalendar(true); setSearchTerm(''); setShowSearch(false); setShowRegistration(false); setShowMyWindows(false); setShowMyCalendars(false); setShowUserSettings(false); setShowRegistrationCalendar(false); setShowLogin(false); setShowMyWindows(false); setShowUserSettings(false); setShowImpressum(false); }}
                  key={selectedCalendar.name}
                >
                  <ListItemText primary={selectedCalendar.name} />
                </ListItemButton>
              </ListItem>
            )}
          </List>


          {/* Conditionally Render Search Field */}
          {showSearch && (
            <>
              <TextField
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ margin: '0 10px', borderRadius: '5px', border: '1px solid #D4AF37' }} /><List>
                {/* Render calendars conditionally */}
                {calendars
                  .filter((calendar) => calendar.name.toLowerCase().includes(searchTerm.toLowerCase())) // Filter calendars based on search term
                  .map((calendar) => (
                    <ListItemButton
                      onClick={() => { setShowWelcome(false); setShowCalendar(true); setSelectedCalendar(calendar); setSearchTerm(''); setShowSearch(false); setShowRegistration(false); setShowMyWindows(false); setShowMyCalendars(false); setShowUserSettings(false); setShowRegistrationCalendar(false); setShowLogin(false); setShowMyWindows(false); setShowUserSettings(false); setShowImpressum(false); }}
                      key={calendar.name}
                    >
                      <ListItemText primary={calendar.name} />
                    </ListItemButton>
                  ))}
              </List>
            </>
          )}

          <List>
            <ListItem>
              <ListItemText>
                <Typography variant="p" style={{ fontWeight: 'bold' }}>
                  Administration
                </Typography>
              </ListItemText>
            </ListItem>
            {!user && (
              <ListItemButton onClick={() => {
                setShowLogin(true);
                setShowWelcome(false); setShowCalendar(false); setShowRegistration(false); setShowRegistrationCalendar(false); setShowMyCalendars(false); setShowUserSettings(false); setShowMyWindows(false); setSearchTerm(''); setShowSearch(false); setShowImpressum(false);
              }}>
                <ListItemText primary="Login" />
              </ListItemButton>
            )}
            {!user && (
              <ListItemButton onClick={() => {
                setShowRegistration(true);
                setShowWelcome(false); setShowCalendar(false); setShowLogin(false); setShowRegistrationCalendar(false); setShowMyCalendars(false); setShowUserSettings(false); setShowMyWindows(false); setSearchTerm(''); setShowSearch(false); setShowImpressum(false);
              }}>
                <ListItemText primary="Register a User" />
              </ListItemButton>
            )}
            {user && (
              <ListItemButton onClick={() => {
                setShowMyCalendars(true);
                setShowWelcome(false); setShowCalendar(false); setShowRegistrationCalendar(false); setShowLogin(false); setShowRegistration(false); setShowUserSettings(false); setShowMyWindows(false); setSearchTerm(''); setShowSearch(false); setShowImpressum(false);
              }}>
                <ListItemText primary="My Calendars" />
              </ListItemButton>
            )}
            {user && (
              <ListItemButton onClick={() => {
                setShowMyWindows(true);
                setShowWelcome(false); setShowCalendar(false); setShowMyCalendars(false); setShowUserSettings(false); setShowRegistrationCalendar(false); setShowLogin(false); setShowRegistration(false); setSearchTerm(''); setShowSearch(false); setShowImpressum(false);
              }}>
                <ListItemText primary="My Windows" />
              </ListItemButton>
            )}
            {user && (
              <ListItemButton onClick={() => {
                setShowRegistrationCalendar(true);
                setShowWelcome(false); setShowCalendar(false); setShowLogin(false); setShowRegistration(false); setShowMyCalendars(false); setShowMyWindows(false); setShowUserSettings(false); setSearchTerm(''); setShowSearch(false); setShowImpressum(false);
              }}>
                <ListItemText primary="Register a Calender" />
              </ListItemButton>
            )}
            {user && (
              <ListItemButton onClick={() => {
                setShowUserSettings(true);
                setShowWelcome(false); setShowCalendar(false); setShowRegistrationCalendar(false); setShowLogin(false); setShowRegistration(false); setShowMyCalendars(false); setShowMyWindows(false); setSearchTerm(''); setShowSearch(false); setShowImpressum(false);
              }}>
                <ListItemText primary="User Settings" />
              </ListItemButton>
            )}
          </List>

        </Drawer>
        <MainBox component="main" className='mainBox' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }} >
          <Container className='mainContainer' >
            {!user && (
              <>
                {showLogin && (
                  <Login userAdded={userAdded} setUserAdded={setUserAdded} />
                )}
                {showRegistration && (
                  <UserRegistrationForm setShowRegistration={setShowRegistration} setShowLogin={setShowLogin} />
                )}
                {showCalendar && calendars.length > 0 && selectedCalendar && (
                  <DefaultCalendar
                    id={selectedCalendar.id}
                    name={selectedCalendar.name}
                    additionalInfo={selectedCalendar.additional_info}
                    owner={selectedCalendar.owner}
                    user={user}
                    token={token}
                  />
                )}
              </>
            )}
            {user && (
              <>
                {showRegistration && (
                  <UserRegistrationForm token={token} />
                )}
                {showCalendar && calendars.length > 0 && selectedCalendar && (
                  <DefaultCalendar
                    id={selectedCalendar.id}
                    name={selectedCalendar.name}
                    additionalInfo={selectedCalendar.additional_info}
                    calendarOwner={selectedCalendar.owner}
                    user={user}
                    token={token}
                  />
                )}
                {showMyCalendars && (
                  <MyCalendars calendarAdded={calendarAdded} setCalendarAdded={setCalendarAdded} user={user} token={token} />
                )}
                {showMyWindows && (
                  <MyWindows user={user} token={token} />
                )}
                {showRegistrationCalendar && (
                  <AdventCalendarRegistrationForm calendarAdded={calendarAdded} setCalendarAdded={setCalendarAdded} setShowRegistrationCalendar={setShowRegistrationCalendar} token={token} />
                )}
                {showUserSettings && (
                  <UserSettings user={user} token={token} userAdded={userAdded} setUserAdded={setUserAdded} />
                )}
              </>
            )}
            {showWelcome && (
                  <WelcomePage />
                )}
            {showImpressum && (
                  <ImpressumPage />
                )}
          </Container>
          <br />
        </MainBox>
      </Root>

    </ThemeProvider>
  );
}

export default App;
