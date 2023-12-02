// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Registration from './components/Registration';
import Calendar from './components/Calendar';
import DefaultCalendar from './components/DefaultCalendar';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
  },
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  const [calendars, setCalendars] = useState([
    { name: 'Adventskalender Schlieren 8952', details: 'Details for Advent Calendar 1' },
    { name: 'Adventskalender Basel 4057', details: 'Details for Advent Calendar 2' },
    { name: 'some other registered calendar', details: 'Details for Advent Calendar 3' },
    // TODO: this will have to read from a database / backend API which are existing
  ]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Add this line

  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Welcome to the Advent Calendar
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <Toolbar />
          <List>
            <ListItem button component={Link} to="/register">
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
              <ListItem button onClick={() => setSelectedCalendar(calendar)}>
                <ListItemText primary={calendar.name} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <Toolbar />
          <Routes>
            <Route path="/register" element={<Registration setCalendars={setCalendars} />} />
            <Route path="/calendar" element={<Calendar calendar={selectedCalendar} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;