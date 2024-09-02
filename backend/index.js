const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwt_secret = "jwt_secret_sign_key"; // TODO read from ENV
const multer = require('multer');

// read config/secrets from .env
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();

const pool = new Pool({
  user: dbUser,
  host: dbHost, // change if deployed
  database: dbName,
  password: dbPassword,
  port: dbPort,
});

async function isValidToken(req){
  const token = req.headers.authorization;
  // Check if the token is provided
  if (!token) {
    console.debug('Unauthorized. Token missing.');
    return false;
  }
  // Check if the token is valid
  try {
    const decodedToken = jwt.verify(token.split(' ')[1], jwt_secret);
    if (!decodedToken) {
      condole.debug('Unauthorized. Invalid token.');
      return false;
    }
    username = decodedToken.username;
  } catch (error) {
    console.error('Error verifying token', error);
    console.debug('Unauthorized. Invalid token.');
    return false;
  }
  
  // Check if the user exists
  try {
    const userExists = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

    if (userExists.rows.length === 0) {
        console.debug(`User: ${username} does not exist`);
        return false;
    }
  } catch (error) {
        console.error('Error checking user existence', error);
        return false;
  }
  return true;
}

// Admin
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
  }

  // Check if the user exists
  try {
    const result = await pool.query('SELECT username, password FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const hashedPassword = result.rows[0].password;
    
    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordMatch) {
      const token = jwt.sign({ username: result.rows[0].username }, jwt_secret, {
        expiresIn: '1h', // Token expiration time (adjust as needed)
      });
      res.status(200).json({ message: 'Login successful!', token });
    } else {
      res.status(401).json({ error: 'Invalid credentials. Password does not match.' });
    }
  } catch (error) {
    console.error('Error during login', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/api/registerUser', async (req, res) => {
    const { username, password } = req.body;
    // Basic validation
    if (!username || !password) {
      console.debug('Invalid request. Missing required parameters.');
      return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
    }
  
    // Check if the username is already taken
    try {
      const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
  
      if (existingUser.rows.length > 0) {
        console.debug("User already exists");
        return res.status(400).json({ error: 'Username already taken.' });
      }
    } catch (error) {
        console.error('Error checking existing user', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 12);
  
    // Register the user
    try {
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        console.debug(`User: ${username}:${hashedPassword} registerd successfully!`);
        res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/api/registerAdventCalendar', async (req, res) => {
  if (!isValidToken(req)){
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
  const token = req.headers.authorization;
  const { adventCalendarId } = req.body;
  
  try {
    const decodedToken = jwt.verify(token.split(' ')[1], jwt_secret);
    username = decodedToken.username;
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
  
  // Basic validation
  if (!adventCalendarId || !username) {
    return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
  }

  // Check if the calendar is already registered
  try {
    const existingCalendar = await pool.query('SELECT name FROM adventCalendars WHERE name = $1', [adventCalendarId]);

    if (existingCalendar.rows.length > 0) {
        console.log(`Advent calendar with a same name: ${adventCalendarId} already registered`);
        return res.status(400).json({ error: 'Advent calendar name already taken.' });
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
    await pool.query('INSERT INTO adventCalendars (owner, name) VALUES ($1, $2)', [userId.rows[0].id, adventCalendarId]);
    console.debug(`Advent calendar: ${adventCalendarId} registerd successfully!`);
    res.status(200).json({ message: 'Advent calendar registered successfully!' });
  } catch (error) {
    console.error('Error registering advent calendar', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/api/registerWindowHosting', async (req, res) => {
  if (!isValidToken(req)){
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
  const { calendar_id, window_nr, addressName, coords, time, locationHint, hasApero } = req.body;
  const token = req.headers.authorization;
  
  try {
    const decodedToken = jwt.verify(token.split(' ')[1], jwt_secret);
    username = decodedToken.username;
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
  
  // Basic validation
  if (!calendar_id || !window_nr || !addressName || !coords || !time || hasApero === null) {
    return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
  }

  // Check if window is free
  try {
    const existingWindow = await pool.query(
      'SELECT id FROM adventWindow WHERE window_nr = $2 AND calendar_id = $1',
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
    const userId = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );
    console.log("Owner id:", userId.rows[0].id);
    console.log("Calendar id:", calendar_id);
    console.log("Window nr:", window_nr);
    console.log(coords);
    // register window hosting
    await pool.query(
      'INSERT INTO adventWindow (id, owner, address_name, address, apero, time, location_hint, window_nr, calendar_id, pictures, comments) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [userId.rows[0].id, addressName, `(${coords[0]},${coords[1]})`, hasApero, time, locationHint, window_nr, calendar_id, [], []]
    );
    console.log(`Window hosting for calendar ${calendar_id}, window ${window_nr} registered successfully!`);
    res.status(200).json({ message: 'Window hosting registered successfully!' });
  } catch (error) {
    console.error('Error registering window hosting', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get Calender Data
app.get('/api/calendars', async (req, res) => {
    try {
      const result = await pool.query('SELECT id, name FROM adventCalendars');
      res.json(result.rows);
    } catch (error) {
      console.error('Error retrieving calendars', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/windowTile', async (req, res) => {
  try {
    const { calendar_id, window_nr } = req.query;
    /* Provide required data to render the windowTiles in the Calender:
      - whether the window is claimed or free for registration
      - Thumbnail (currently just 1st picture)
      
      The assumption is that 
        - if a record exists (result.rows.length > 0), the window
          was claimed / registered => isFree: false
        - otherwise it is free for registration => isFree: true
    */
    const selectQuery = `
      SELECT pictures[1] AS picture -- Fetch the first element from the pictures array
      FROM adventWindow
      WHERE calendar_id = $1 AND window_nr = $2
    `;

    const result = await pool.query(selectQuery, [calendar_id, window_nr]);

    if (result.rows.length > 0) {
      const picture = result.rows[0].picture;
      if (picture) {
        res.status(200).json({ success: true, isFree: false, picture: [picture] });
      } else {
        res.status(200).json({ success: true, isFree: false, picture: [] });
      }
    } else {
      res.status(200).json({ success: true, isFree: true, picture: [] });
    }
  } catch (error) {
    console.error('Error fetching picture:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
app.get('/api/window', async (req, res) => {
  const { calendar_id, window_nr } = req.query;
  try {
    // Fetch window info based on calendar_id and window_nr
    const result = await pool.query(
      'SELECT address_name, address, apero, time, location_hint FROM adventWindow WHERE window_nr = $2 AND calendar_id = $1',
      [calendar_id, window_nr]
    );
    if (result.rows.length > 0) {
      // The query returned some rows
      const windowData = result.rows[0];
      res.json({ success: true, windowData: windowData});
    } else {
      // The query did not return any rows
      res.json({ success: true, windowData: {} });
    }
  } catch (error) {
    console.error('Error fetching window infos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/pictures', async (req, res) => {
  try {
    const { calendar_id, window_nr } = req.query;

    // Retrieve all pictures from the database for the specified calendar and window
    const selectQuery = `
      SELECT pictures
      FROM adventWindow
      WHERE calendar_id = $1 AND window_nr = $2
    `;

    const result = await pool.query(selectQuery, [calendar_id, window_nr]);

    if (result.rows.length > 0) {
      const pictures = result.rows[0].pictures || [];
      res.status(200).json({ success: true, pictures });
    } else {
      res.status(404).json({ success: false, message: 'No pictures found for the specified calendar and window.' });
    }
  } catch (error) {
    console.error('Error fetching pictures:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
// TODO: maybe do some preprocessing on the image data before storing it in the database or set a limit
app.post('/api/pictures', upload.single('image'), async (req, res) => {
  try {
    const { calendar_id, window_nr } = req.query;
    const { buffer } = req.file; // Image data

    const updateQuery = `
      UPDATE adventWindow
      SET pictures = array_append(pictures, $2)
      WHERE calendar_id = $1 AND window_nr = $3
    `;

    await new Promise((resolve, reject) => {
      pool.query(updateQuery, [calendar_id, buffer, window_nr], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.rowCount);
        }
      });
    });

    res.status(200).json({ success: true, message: 'Image submitted successfully.' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/api/comments', async (req, res) => {
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
app.post('/api/comments', async (req, res) => {
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
app.get('/api/locations', async (req, res) => {
  const { calendar_id } = req.query;
  try {
    // Fetch coordwindow info based on calendar_id
    const result = await pool.query(
      'SELECT window_nr, address_name, address, time FROM adventWindow WHERE calendar_id = $1',
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


app.listen(7007, () => {
  console.log('Server listening on port 7007');
});


// TODOs:
// only allow "logged in" users to register calendars
// refresh navigation bar after registration to render new calendars