import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/system'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { ThemeProvider } from '@mui/material/styles';

import { useAuth } from './AuthProvider';
import theme from './CreateTheme';

import ImpressumPage from './components/Impressum';
import AdventToolbar from './components/AdventToolbar';
import NavigationBar from './components/NavigationBar';
import DefaultCalendar from './components/DefaultCalendar';
import WelcomePage from './components/WelcomePage';
import Login from './components/Login';
import UserRegistrationForm from './components/UserRegistrationForm';
import AdventCalendarRegistrationForm from './components/AdventCalendarRegistrationForm';
import UserSettings from './components/UserSettings';
import MyCalendars from './components/MyCalendars';
import MyWindows from './components/MyWindows';

import { AggregateTextProvider, useAppStrings } from './contexts/text';

const Root = styled('div')({
  display: 'flex',
});

const MainBox = styled(Box)({
  flexGrow: 1,
  p: 3,
  marginTop: '64px',
  marginLeft: 0,
  mt: '64px',
  backgroundImage: `url(${require('./assets/images/blue-snow_colored.png')})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'repeat',
  backgroundColor: '#f0f0f0',
});

const locale = navigator.language;
let defaultlang;
if(localStorage.getItem('lang')) {
  defaultlang = localStorage.getItem('lang');
} else if (locale.startsWith("de")) {
  defaultlang = "de-DE";
} else {
  defaultlang = "en-US";
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const { user, token, logout } = useAuth();
  const [lang, setLang] = useState(defaultlang);
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

  const drawerWidth = 240; 

  const { noCalendarsFound } = useAppStrings();

  const query = useQuery();
  const calendarNameParam = query.get('calendarName');

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/calendars`);
        if (!response.ok) {
          throw new Error('Failed to fetch calendars');
        }

        const data = await response.json();
        setCalendars(data);

        // Check for 'calendarName' parameter in the URL
        if (calendarNameParam) {
          const calendar = data.find((c) => c.name === calendarNameParam);
          if (calendar) {
            setSelectedCalendar(calendar);
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

  const toggleSearchField = () => {
    setShowSearch((prevShowSearch) => !prevShowSearch);
  };

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <AggregateTextProvider lang={lang}>
            <AdventToolbar selectedCalendar={selectedCalendar} user={user} logout={logout} setShowLogin={setShowLogin} lang={lang} setLang={setLang}/>
          
            <NavigationBar
              drawerWidth={drawerWidth}
              info="Info"
              welcomePage="Welcome Page"
              impressum="Impressum"
              calendarsText="My Calendars"
              administration="Administration"
              search="Search"
              login="Login"
              registerUser="Register"
              myCalendars="My Calendars"
              myWindows="My Windows"
              registerCalendar="Register Calendar"
              userSettings="User Settings"
              selectedCalendar={selectedCalendar}
              user={user}
              showSearch={showSearch}
              searchTerm={searchTerm}
              calendars={calendars}
              setShowWelcome={setShowWelcome}
              setShowCalendar={setShowCalendar}
              setShowLogin={setShowLogin}
              setShowRegistration={setShowRegistration}
              setShowRegistrationCalendar={setShowRegistrationCalendar}
              setShowMyCalendars={setShowCalendar}
              setShowMyWindows={setShowMyWindows}
              setShowUserSettings={setShowUserSettings}
              setShowImpressum={setShowImpressum}
              setSearchTerm={setSearchTerm}
              setSelectedCalendar={setSelectedCalendar}
              setCalendarAdded={setCalendarAdded}
              toggleSearchField={toggleSearchField}
            />

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
                      calendarOwner={selectedCalendar.owner}
                      locked={selectedCalendar.locked}
                      user={user}
                      token={token}
                    />
                  )}
                  {calendars.length === 0 && (
                    <ListItem>
                      <ListItemText primary={noCalendarsFound} />
                    </ListItem>
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
                      locked={selectedCalendar.locked}
                      user={user}
                      token={token}
                    />
                  )}
                  {calendars.length === 0 && (
                    <ListItem>
                      <ListItemText primary={noCalendarsFound} />
                    </ListItem>
                  )}
                  {showMyCalendars && (
                    <MyCalendars calendarAdded={calendarAdded} setCalendarAdded={setCalendarAdded} setSelectedCalendar={setSelectedCalendar} user={user} token={token} />
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
        </AggregateTextProvider>
      </Root>
    </ThemeProvider>
  );
}

export default App;