// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
            <ListItem button component={Link} to="/calendar">
              <ListItemText primary="Calendar" />
            </ListItem>
            <ListItem button component={Link} to="/default">
              <ListItemText primary="Default Calendar" />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <Toolbar />
          <Routes>
            <Route path="/register" element={<Registration />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/default" element={<DefaultCalendar />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;