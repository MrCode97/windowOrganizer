const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors()); // Enable CORS for all routes

const pool = new Pool({
  user: 'fwe',
  host: 'localhost', // Docker Compose service name
  database: 'adventcalendar',
  password: 'VerySecureAdventsklaenderPW',
  port: 5432,
});

app.use(express.json());

// New route to register users
app.post('/api/registerUser', async (req, res) => {
    const { username, password } = req.body;
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
    }
  
    // Check if the username is already taken
    try {
      const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  
      if (existingUser.rows.length > 0) {
        console.log(`Username: ${username} already taken`);
        return res.status(400).json({ error: 'Username already taken.' });
      }
      console.log(`User: ${username} registerd successfully!`);
    } catch (error) {
      console.error('Error checking existing user', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Register the user
    try {
      await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
      res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
      console.error('Error registering user', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Existing route to retrieve users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// New route to register advent calendars
app.post('/api/registerAdventCalendar', async (req, res) => {
  const { adventCalendarId, username } = req.body;

  // Basic validation
  if (!adventCalendarId || !username) {
    return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
  }

  // Check if the user exists
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userExists.rows.length === 0) {
      return res.status(400).json({ error: 'User does not exist.' });
    }
  } catch (error) {
    console.error('Error checking user existence', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Check if the calendar is already registered
  try {
    const existingCalendar = await pool.query('SELECT * FROM advent_calendars WHERE advent_calendar_id = $1', [adventCalendarId]);

    if (existingCalendar.rows.length > 0) {
      return res.status(400).json({ error: 'Advent calendar already registered.' });
    }
  } catch (error) {
    console.error('Error checking existing calendar', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Register the advent calendar
  try {
    await pool.query('INSERT INTO advent_calendars (advent_calendar_id, username) VALUES ($1, $2)', [adventCalendarId, username]);
    res.status(200).json({ message: 'Advent calendar registered successfully!' });
  } catch (error) {
    console.error('Error registering advent calendar', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(7007, () => {
  console.log('Server listening on port 7007');
});
