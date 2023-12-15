const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'fwe',
  host: 'localhost', // change if deployed
  database: 'adventcalendar',
  password: 'VerySecureAdventsklaenderPW',
  port: 5432,
});

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
        console.log(`User: ${username} registerd successfully!`);
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
    console.log('Invalid request. Missing required parameters.');
    return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
  }

  // Check if the user exists
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userExists.rows.length === 0) {
        console.log(`User: ${username} does not exist`);
        return res.status(400).json({ error: 'User does not exist.' });
    }
  } catch (error) {
        console.error('Error checking user existence', error);
        return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Check if the calendar is already registered
  try {
    const existingCalendar = await pool.query('SELECT name FROM adventCalendars WHERE name = $1', [adventCalendarId]);

    if (existingCalendar.rows.length > 0) {
        console.log(`Advent calendar: ${adventCalendarId} already registered`);
        return res.status(400).json({ error: 'Advent calendar already registered.' });
    }
  } catch (error) {
        console.error('Error checking existing calendar', error);
        return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Register the advent calendar
  try {
    // get user id from username
    const userId = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    // register advent calendar
    await pool.query('INSERT INTO adventCalendar (name) VALUES ($1)', [adventCalendarId]);
    await pool.query('INSERT INTO adventCalendars (owner, name) VALUES ($1, $2)', [userId.rows[0].id, adventCalendarId]);
    console.log(`Advent calendar: ${adventCalendarId} registerd successfully!`);
    res.status(200).json({ message: 'Advent calendar registered successfully!' });
  } catch (error) {
    console.error('Error registering advent calendar', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/calendars', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM adventCalendars');
      res.json(result.rows);
    } catch (error) {
      console.error('Error retrieving calendars', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Logic to add a new comment
app.post("/api/calendars", async (req, res) => {
  const { windowId, comment} = req.body;
  try {
    // Insert the comment into the database
    // Checks if comment array exists, if not inserts comment as array else concatenates existing array with new comment array
    const result = await pool.query(
      'INSERT INTO adventWindow (id, comments) VALUES ($1, ARRAY[$2]) ON CONFLICT (id) DO UPDATE SET comments = adventWindow.comments || ARRAY[$2]',
      [windowId, comment]
    );

    res.json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/calendar/comments', async (req, res) => {
  const { calendar_id, window_nr } = req.query;
  try {
    // Fetch comments based on calendar_id and window_nr
    const result = await pool.query(
      'SELECT * FROM adventWindow WHERE window_nr = $2 AND calendar_id = $1',
      [calendar_id, window_nr]
    );
    const comments = result.rows.length > 0 ? result.rows[0].comments : [];
    const hasApero = result.rows[0].apero;
    const location_hint = result.rows[0].location_hint.length > 0 ? result.rows[0].location_hint : "";

    res.json({ success: true, comments: comments, hasApero: hasApero, location_hint: location_hint});
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/windowThumbnail', async (req, res) => {
  const { calendar_id, window_nr } = req.query;
  try {
    // Fetch window info based on calendar_id and window_nr
    const result = await pool.query(
      'SELECT * FROM adventWindow WHERE window_nr = $2 AND calendar_id = $1',
      [calendar_id, window_nr]
    );
    if (result.rows.length > 0) {
      // The query returned some rows
      const imagePaths = result.rows[0].image_paths.length > 0 ? result.rows[0].image_paths : [""];
      res.json({ success: true, isFree: false, imagePath: imagePaths[0]});
    } else {
      // The query did not return any rows
      res.json({ success: true, isFree: true, imagePath: "" });
    }
  } catch (error) {
    console.error('Error fetching window infos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/calendarMapInfo', async (req, res) => {
  const { calendar_id } = req.query;
  try {
    // Fetch coordwindow info based on calendar_id
    const result = await pool.query(
      'SELECT * FROM adventWindow WHERE calendar_id = $1',
      [calendar_id]
    );
    if (result.rows.length > 0) {
      // The query returned some rows
      const calendarMapInfos = [];
      for (const row of result.rows) {
        calendarMapInfos.push({
          window_nr: row.window_nr,
          address_name: row.address_name,
          address: row.address,
          time: row.time
        });
      }
      res.json({ success: true, calendarMapInfos: calendarMapInfos});
    } else {
      // The query did not return any rows
      res.json({ success: true, calendarMapInfos: []});
    }
  } catch (error) {
    console.error('Error fetching calendar map infos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/calendars/addComment', async (req, res) => {
  const { window_nr, calendar_id } = req.query;
  const { comment } = req.body;
  try {
    // Insert the comment into the database
    // Checks if comment array exists, if not inserts comment as array else concatenates existing array with new comment array
    const result = await pool.query(
      'INSERT INTO adventWindow (window_nr, calendar_id, comments) VALUES ($1, $2, ARRAY[$3]) ON CONFLICT (window_nr, calendar_id) DO UPDATE SET comments = adventWindow.comments || ARRAY[$3]',
      [window_nr, calendar_id, comment]
    );

    res.json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// New route to register window hosting
app.post('/api/registerWindowHosting', async (req, res) => {
  const { calendar_id, window_nr, username, addressName, time, locationHint  } = req.body;

  // Check if the user exists
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userExists.rows.length === 0) {
      console.log(`User: ${username} does not exist`);
      return res.status(400).json({ error: 'User does not exist.' });
    }
  } catch (error) {
      console.error('Error checking user existence', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Check if the window has already been registered in the meantime
  try {
    const existingWindow = await pool.query(
      'SELECT * FROM adventWindow WHERE window_nr = $2 AND calendar_id = $1',
      [calendar_id, window_nr]
    );

    if (existingWindow.rows.length > 0) {
      console.log(`Advent calendar: ${calendar_id} already registered`);
       return res.status(400).json({ error: 'Advent calendar already registered.' });
    }
  } catch (error) {
      console.error('Error checking existing calendar', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Register the window hosting
  try {
    // get user id from username
    const userId = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    console.log("Owner id:", userId.rows[0].id);
    console.log("Calendar id:", calendar_id);
    console.log("Window nr:", window_nr);
    // register window hosting
    await pool.query(
      'INSERT INTO adventWindow (id, owner, address_name, time, location_hint, window_nr, calendar_id) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)',
      [userId.rows[0].id, addressName, time, locationHint, window_nr, calendar_id]
    );
    console.log(`Window hosting for calendar ${calendar_id}, window ${window_nr} registered successfully!`);
    res.status(200).json({ message: 'Window hosting registered successfully!' });
  } catch (error) {
    console.error('Error registering window hosting', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(7007, () => {
  console.log('Server listening on port 7007');
});


// TODOs:
// only allow "logged in" users to register calendars
// refresh navigation bar after registration to render new calendars