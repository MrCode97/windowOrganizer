const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const jwt_secret = process.env.JWT_SECRET;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: dbUser,
  host: dbHost, // change if deployed
  database: dbName,
  password: dbPassword,
  port: dbPort,
});

// Access Control Utility Function
async function isValidToken(req) {
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
async function isLocked(calendar_id) {
  try {
    // Query the database to check if the calendar is locked
    const lockQuery = await pool.query('SELECT locked FROM adventCalendars WHERE id = $1', [calendar_id]);

    if (lockQuery.rows.length === 0) {
      console.debug(`Calendar with id ${calendar_id} does not exist.`);
      return false;
    }

    // Check if the calendar is locked
    if (lockQuery.rows[0].locked) {
      console.debug(`Calendar ${calendar_id} is locked.`);
      return true;
    } else {
      console.debug(`Calendar ${calendar_id} is not locked.`);
      return false;
    }
  } catch (error) {
    console.error('Error checking if calendar is locked:', error);
    return false;
  }
}

// Admin User
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
        expiresIn: '1h',
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
app.post('/api/user/changePassword', async (req, res) => {
  // Validate token
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { oldPassword, newPassword } = req.body;
  let username;
  const token = req.headers.authorization;

  try {
    // Decode the token to get the username
    const decodedToken = jwt.verify(token.split(' ')[1], jwt_secret);
    username = decodedToken.username;
  } catch (error) {
    console.error('Error decoding token', error);
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
  // Basic validation
  if (!username || !oldPassword || !newPassword) {
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
    const passwordMatch = await bcrypt.compare(oldPassword, hashedPassword);

    if (passwordMatch) {
      const token = jwt.sign({ username: result.rows[0].username }, jwt_secret, {
        expiresIn: '6h',
      });
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await pool.query('UPDATE users SET password = $1 WHERE username = $2', [hashedNewPassword, username]);
      res.status(200).json({ message: 'Password successfully changed!', token });
    } else {
      res.status(401).json({ error: 'Invalid credentials. Password does not match.' });
    }
  } catch (error) {
    console.error('Error during login', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Admin Calendar
app.post('/api/registerAdventCalendar', async (req, res) => {
  if (! await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
  const token = req.headers.authorization;
  const { adventCalendarId, additionalInfo } = req.body;

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
      return res.status(400).json({ error: 'Advent calendar name already taken.' });
    }
  } catch (error) {
    console.error('Error checking existing calendar', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Register the advent calendar
  try {
    const userIdResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userIdResult.rows[0].id;

    // Register advent calendar with additional info
    await pool.query(
      'INSERT INTO adventCalendars (owner, name, additional_info) VALUES ($1, $2, $3)',
      [userId, adventCalendarId, additionalInfo]
    );
    console.debug(`Advent calendar: ${adventCalendarId} registerd successfully!`);
    res.status(200).json({ message: 'Advent calendar registered successfully!' });
  } catch (error) {
    console.error('Error registering advent calendar', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/api/updateAdventCalendar', async (req, res) => {
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { calendar_id, name, additionalInfo } = req.body;
  const token = req.headers.authorization;
  let username;

  try {
    const decodedToken = jwt.verify(token.split(' ')[1], jwt_secret);
    username = decodedToken.username;
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  // Basic validation
  if (!calendar_id || !name) {
    return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
  }

  if (await isLocked(calendar_id)) {
    return res.status(403).json({ error: 'Forbidden. The calendar is locked and cannot be modified.' });
  }

  try {
    // Verify that the user owns the calendar
    const userQuery = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userQuery.rows[0]?.id;

    if (!userId) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the user is the owner of the calendar
    const ownershipQuery = await pool.query('SELECT owner FROM adventCalendars WHERE id = $1 AND owner = $2', [calendar_id, userId]);

    if (ownershipQuery.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden. You do not have permission to edit this calendar.' });
    }

    // Update the advent calendar details
    await pool.query('UPDATE adventCalendars SET name = $1, additional_info = $2 WHERE id = $3', [name, additionalInfo, calendar_id]);
    console.debug(`Advent calendar ${calendar_id} updated successfully!`);
    res.status(200).json({ message: 'Advent calendar updated successfully!' });

  } catch (error) {
    console.error('Error updating advent calendar', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.delete('/api/delAdventCalendar', async (req, res) => {
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { calendar_id } = req.query;
  const token = req.headers.authorization;
  let username;

  try {
    const decodedToken = jwt.verify(token.split(' ')[1], jwt_secret);
    username = decodedToken.username;
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  // Basic validation
  if (!calendar_id) {
    return res.status(400).json({ error: 'Invalid request. Missing calendar ID.' });
  }

  if (await isLocked(calendar_id)) {
    return res.status(403).json({ error: 'Forbidden. The calendar is locked and cannot be modified.' });
  }

  try {
    // Get the user's ID from the token
    const userQuery = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userQuery.rows[0]?.id;

    if (!userId) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the user is the owner of the calendar
    const ownershipQuery = await pool.query('SELECT owner FROM adventCalendars WHERE id = $1 AND owner = $2', [calendar_id, userId]);

    if (ownershipQuery.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden. You do not have permission to delete this calendar.' });
    }

    // Delete the advent calendar and associated data
    await pool.query('DELETE FROM adventCalendars WHERE id = $1', [calendar_id]);
    
    console.debug(`Advent calendar ${calendar_id} and its associated data deleted successfully!`);
    res.status(200).json({ message: 'Advent calendar deleted successfully!' });

  } catch (error) {
    console.error('Error deleting advent calendar:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/api/lockAdventCalendar', async (req, res) => {
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { calendar_id, lock } = req.body;
  const token = req.headers.authorization;
  let username;

  try {
    const decodedToken = jwt.verify(token.split(' ')[1], jwt_secret);
    username = decodedToken.username;
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  // Basic validation
  if (!calendar_id || typeof lock !== 'boolean') {
    return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
  }

  try {
    // Get the user's ID from the token
    const userQuery = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userQuery.rows[0]?.id;

    if (!userId) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the user is the owner of the calendar
    const ownershipQuery = await pool.query('SELECT owner FROM adventCalendars WHERE id = $1 AND owner = $2', [calendar_id, userId]);

    if (ownershipQuery.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden. You do not have permission to lock/unlock this calendar.' });
    }

    // Lock or unlock the advent calendar
    await pool.query('UPDATE adventCalendars SET locked = $1 WHERE id = $2', [lock, calendar_id]);
    
    const lockStatus = lock ? 'locked' : 'unlocked';
    console.debug(`Advent calendar ${calendar_id} ${lockStatus} successfully!`);
    res.status(200).json({ message: `Advent calendar ${lockStatus} successfully!` });

  } catch (error) {
    console.error('Error locking/unlocking advent calendar:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Admin Window
app.post('/api/registerWindowHosting', async (req, res) => {
  if (! await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
  const { calendar_id, window_nr, addressName, coords, time, locationHint, hasApero } = req.body;
  const token = req.headers.authorization;

  try {
    const decodedToken = jwt.verify(token.split(' ')[1], jwt_secret);
    const username = decodedToken.username;
    const userIdQuery = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userIdQuery.rows[0].id;

    if (!calendar_id || !window_nr || !addressName || !coords || !time || hasApero === null) {
      return res.status(400).json({ error: 'Invalid request. Missing required parameters.' });
    }

    if (await isLocked(calendar_id)) {
      return res.status(403).json({ error: 'Forbidden. The calendar is locked and cannot be modified.' });
    }

    const existingWindow = await pool.query(
      'SELECT id FROM adventWindow WHERE window_nr = $2 AND calendar_id = $1',
      [calendar_id, window_nr]
    );

    if (existingWindow.rows.length > 0) {
      return res.status(400).json({ error: 'Advent window already registered.' });
    }

    await pool.query(
      'INSERT INTO adventWindow (owner, address_name, address, apero, time, location_hint, window_nr, calendar_id) VALUES ($1, $2, POINT($3, $4), $5, $6, $7, $8, $9)',
      [userId, addressName, coords[0], coords[1], hasApero, time, locationHint, window_nr, calendar_id]
    );

    res.status(200).json({ message: 'Window hosting registered successfully!' });
  } catch (error) {
    console.error('Error registering window hosting:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/api/updateWindowHosting', async (req, res) => {
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const token = req.headers.authorization;
  const { calendar_id, window_nr, addressName, coords, time, locationHint, hasApero } = req.body;

  try {
    const decodedToken = jwt.verify(token.split(' ')[1], jwt_secret);
    const username = decodedToken.username;

    const userQuery = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userQuery.rows[0]?.id;

    if (!userId) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (await isLocked(calendar_id)) {
      return res.status(403).json({ error: 'Forbidden. The calendar is locked and cannot be modified.' });
    }

    const ownershipQuery = await pool.query(`
      SELECT w.owner AS window_owner, c.owner AS calendar_owner
      FROM adventWindow w
      JOIN adventCalendars c ON w.calendar_id = c.id
      WHERE w.calendar_id = $1 AND w.window_nr = $2 AND (w.owner = $3 OR c.owner = $3)
    `, [calendar_id, window_nr, userId]);

    if (ownershipQuery.rows.length === 0) {
      return res.status(403).json({ error: 'Forbidden. You do not have permission to edit this window.' });
    }

    await pool.query(`
      UPDATE adventWindow
      SET address_name = $1, address = POINT($2, $3), time = $4, location_hint = $5, apero = $6
      WHERE calendar_id = $7 AND window_nr = $8
    `, [addressName, coords[0], coords[1], time, locationHint, hasApero, calendar_id, window_nr]);

    res.status(200).json({ message: 'Advent window updated successfully!' });

  } catch (error) {
    console.error('Error updating advent window:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.delete('/api/delWindowHosting', async (req, res) => {
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { calendar_id, window_nr } = req.query;
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, jwt_secret);
  const username = decodedToken.username;

  try {
    // Lookup the user ID
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userResult.rows[0].id;

    if (await isLocked(calendar_id)) {
      return res.status(403).json({ error: 'Forbidden. The calendar is locked and cannot be modified.' });
    }

    // Fetch window owner and calendar owner
    const windowResult = await pool.query(`
      SELECT aw.owner AS window_owner, ac.owner AS calendar_owner
      FROM adventWindow aw
      JOIN adventCalendars ac ON aw.calendar_id = ac.id
      WHERE aw.calendar_id = $1 AND aw.window_nr = $2
    `, [calendar_id, window_nr]);

    if (windowResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Window not found.' });
    }

    const { window_owner, calendar_owner } = windowResult.rows[0];

    // Check if the user is the window owner or the calendar owner
    if (userId === window_owner || userId === calendar_owner) {
      // Begin transaction
      await pool.query('BEGIN');

      // Delete related pictures
      await pool.query('DELETE FROM pictures WHERE calendar_id = $1 AND window_nr = $2', [calendar_id, window_nr]);

      // Delete related comments
      await pool.query('DELETE FROM comments WHERE calendar_id = $1 AND window_nr = $2', [calendar_id, window_nr]);

      // Delete the window itself
      await pool.query('DELETE FROM adventWindow WHERE calendar_id = $1 AND window_nr = $2', [calendar_id, window_nr]);

      // Commit transaction
      await pool.query('COMMIT');

      res.json({ success: true, message: 'Window hosting and related data deleted successfully.' });
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this window hosting.' });
    }
  } catch (error) {
    console.error('Error deleting window hosting:', error);
    // Rollback transaction in case of error
    await pool.query('ROLLBACK');
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Data Retrieval - User
app.get('/api/user/ownedCalendars', async (req, res) => {
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { user } = req.query;
  const token = req.headers.authorization;

  try {
    const selectQuery = `
      SELECT 
        ac.id,
        ac.name,
        ac.additional_info,
        ac.locked
      FROM 
        adventCalendars ac
      JOIN 
        users u ON u.id = ac.owner
      WHERE 
        u.username = $1;
    `;
    const result = await pool.query(selectQuery, [user]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving calendars', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/user/ownedWindows', async (req, res) => {
  /*
    Return owned windows of a user, i.e. (username) => [{calendar_id, [window_nr]}]
    Requires authenticated user, but doesn't have to be the owing user, i.e. fetch other users owned windows is allowed
  */
  if (! await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
  const { user } = req.query;
  const token = req.headers.authorization;

  try {
    const selectQuery = `
      SELECT 
        aw.calendar_id,
        JSON_AGG(aw.window_nr ORDER BY aw.window_nr) AS windows
      FROM 
        adventWindow aw
      JOIN 
        users u ON u.id = aw.owner
      WHERE 
        u.username = $1
      GROUP BY 
        aw.calendar_id;
    `;
    const result = await pool.query(selectQuery, [user]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving calendars', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/user/idToUser', async (req, res) => {
  /*
    Return owned windows of a user, i.e. (username) => [{calendar_id, [window_nr]}]
    Requires authenticated user, but doesn't have to be the owing user, i.e. fetch other users owned windows is allowed
  */
  if (! await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }
  const { id } = req.query;
  const token = req.headers.authorization;

  try {
    const selectQuery = `
      SELECT username FROM users WHERE id = $1`;
    const result = await pool.query(selectQuery, [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json({});
    }
  } catch (error) {
    console.error('Error retrieving calendars', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/user/userToId', async (req, res) => {
  /*
    Return the user ID for a given username.
    Requires authenticated user.
  */
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { user } = req.query; // Get the username from the query parameters

  try {
    const selectQuery = `
      SELECT id FROM users WHERE username = $1`;
    const result = await pool.query(selectQuery, [user]);

    if (result.rows.length > 0) {
      res.json({ id: result.rows[0].id });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Data Retrieval - Calendar
app.get('/api/calendars', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, owner, additional_info, locked FROM adventCalendars'); // Fetch additional info
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving calendars', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/calendar', async (req, res) => {
  const { calendar_id } = req.query;
  try {
    const result = await pool.query('SELECT id, name, owner, additional_info FROM adventCalendars WHERE id = $1', [calendar_id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving calendars', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Data Retrieval - Window
app.get('/api/windowTile', async (req, res) => {
  /* Provide required data to render the windowTiles in the Calender:
  - whether the window is claimed or free for registration
  - Thumbnail (currently just 1st picture)
  
  The assumption is that 
    - if a record exists (result.rows.length > 0), the window
      was claimed / registered => isFree: false
    - otherwise it is free for registration => isFree: true
*/
  try {
    const { calendar_id, window_nr } = req.query;

    // Check if the window has been registered
    const windowResult = await pool.query(`
    SELECT 1 FROM adventWindow
    WHERE calendar_id = $1 AND window_nr = $2
  `, [calendar_id, window_nr]);

    // If no registration is found, the window is free
    if (windowResult.rows.length === 0) {
      return res.status(200).json({ success: true, isFree: true, picture: null });
    }

    // If the window is registered, check for a picture
    const pictureResult = await pool.query(`
    SELECT content AS picture
    FROM pictures
    WHERE calendar_id = $1 AND window_nr = $2
    LIMIT 1
  `, [calendar_id, window_nr]);

    const picture = pictureResult.rows.length > 0 ? pictureResult.rows[0].picture : null;

    res.status(200).json({ success: true, isFree: false, picture });
  } catch (error) {
    console.error('Error fetching windowTile data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
app.get('/api/windowTile/owner', async (req, res) => {
  /* Provide owner-username to authenticated users
    The assumption is that we call this endpoint only form SlidingWindow.js, where we already established that the window is claimed, hence owner exists
    */
  if (! await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { calendar_id, window_nr } = req.query;
  try {
    const selectQuery = `
      SELECT u.username
      FROM adventWindow aw
      JOIN users u ON aw.owner = u.id
      WHERE aw.calendar_id = $1 AND aw.window_nr = $2
    `;

    const result = await pool.query(selectQuery, [calendar_id, window_nr]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching finding owner:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});
app.get('/api/window', async (req, res) => {
  // Window info based on calendar_id and window_nr
  const { calendar_id, window_nr } = req.query;
  try {
    const result = await pool.query(
      'SELECT address_name, address, apero, time, location_hint, owner FROM adventWindow WHERE window_nr = $2 AND calendar_id = $1',
      [calendar_id, window_nr]
    );
    if (result.rows.length > 0) {
      const windowData = result.rows[0];
      res.json({ success: true, windowData: windowData });
    } else {
      res.json({ success: true, windowData: {} });
    }
  } catch (error) {
    console.error('Error fetching window infos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// Data Retrieval - Pictures
app.get('/api/getPictures', async (req, res) => {
  const { calendar_id, window_nr } = req.query;

  try {
    const result = await pool.query(`
      SELECT id, author, timestamp, content 
      FROM pictures 
      WHERE calendar_id = $1 AND window_nr = $2
      ORDER BY timestamp ASC
    `, [calendar_id, window_nr]);

    if (result.rows.length === 0) {
      return res.json({ success: true, pictures: [] });
    }

    res.json({ success: true, pictures: result.rows });
  } catch (error) {
    console.error('Error fetching pictures:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// Data Retrieval - Comments
app.get('/api/getComments', async (req, res) => {
  const { calendar_id, window_nr } = req.query;

  try {
    const result = await pool.query(`
      SELECT id, author, timestamp, content 
      FROM comments 
      WHERE calendar_id = $1 AND window_nr = $2 
      ORDER BY timestamp ASC
    `, [calendar_id, window_nr]);

    if (result.rows.length === 0) {
      return res.json({ success: true, comments: [] });
    }

    res.json({ success: true, comments: result.rows });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
// Data Retrieval - Location
app.get('/api/locations', async (req, res) => {
  // Fetch all locations for a particular calendar
  const { calendar_id } = req.query;
  try {
    const result = await pool.query(
      'SELECT window_nr, address_name, address, time FROM adventWindow WHERE calendar_id = $1',
      [calendar_id]
    );
    if (result.rows.length > 0) {
      const calendarMapInfos = [];
      for (const row of result.rows) {
        calendarMapInfos.push({
          window_nr: row.window_nr,
          address_name: row.address_name,
          address: row.address,
          time: row.time
        });
      }
      res.json({ success: true, calendarMapInfos: calendarMapInfos });
    } else {
      res.json({ success: true, calendarMapInfos: [] });
    }
  } catch (error) {
    console.error('Error fetching calendar map infos:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Data Modifications
app.post('/api/pictures', upload.single('image'), async (req, res) => {
  // TODO: maybe do some preprocessing on the image data before storing it in the database or set a limit
  // Take uploaded image for a particular window
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { window_nr, calendar_id } = req.query;
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, jwt_secret);
  const username = decodedToken.username;

  if (await isLocked(calendar_id)) {
    return res.status(403).json({ error: 'Forbidden. The calendar is locked and cannot be modified.' });
  }

  try {
    // Get user ID from username
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userResult.rows[0].id;

    // Get the uploaded image buffer
    const pictureBuffer = req.file.buffer; // multer stores the file data in req.file

    // Insert the picture with userId
    await pool.query(`
      INSERT INTO pictures (calendar_id, window_nr, author, content, timestamp)
      VALUES ($1, $2, $3, $4, NOW())
    `, [calendar_id, window_nr, userId, pictureBuffer]);

    res.json({ success: true, message: 'Picture added successfully' });
  } catch (error) {
    console.error('Error adding picture:', error);
    res.status(500).json({ success: false, message: 'Internal Server error' });
  }
});
app.delete('/api/delPicture', async (req, res) => {
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { picture_id, calendar_id, window_nr } = req.query;
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, jwt_secret);
  const username = decodedToken.username;

  try {
    // Lookup the user ID
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userResult.rows[0].id;

    if (await isLocked(calendar_id)) {
      return res.status(403).json({ error: 'Forbidden. The calendar is locked and cannot be modified.' });
    }

    // Fetch picture, window owner, and calendar owner
    const pictureResult = await pool.query(`
      SELECT p.author, aw.owner AS window_owner, ac.owner AS calendar_owner
      FROM pictures p
      JOIN adventWindow aw ON p.window_nr = aw.window_nr AND p.calendar_id = aw.calendar_id
      JOIN adventCalendars ac ON p.calendar_id = ac.id
      WHERE p.id = $1 AND p.calendar_id = $2 AND p.window_nr = $3
    `, [picture_id, calendar_id, window_nr]);

    const { author, window_owner, calendar_owner } = pictureResult.rows[0];

    // Check if user is the picture author, window owner, or calendar owner
    if (userId === author || userId === window_owner || userId === calendar_owner) {
      // Delete the picture
      await pool.query('DELETE FROM pictures WHERE id = $1', [picture_id]);
      return res.json({ success: true, message: 'Picture deleted successfully.' });
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this picture.' });
    }
  } catch (error) {
    console.error('Error deleting picture:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.post('/api/addComment', async (req, res) => {
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { window_nr, calendar_id, comment } = req.body;

  if (!window_nr || !calendar_id || !comment) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, jwt_secret);
  const username = decodedToken.username;

  if (await isLocked(calendar_id)) {
    return res.status(403).json({ error: 'Forbidden. The calendar is locked and cannot be modified.' });
  }

  try {
    // Get user ID from username
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userResult.rows[0].id;

    console.log(`${userId}: added a comment`);
    // Insert the comment with userId
    await pool.query(`
      INSERT INTO comments (calendar_id, window_nr, author, content, timestamp)
      VALUES ($1, $2, $3, $4, NOW())
    `, [calendar_id, window_nr, userId, comment]);

    res.json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.delete('/api/delComment', async (req, res) => {
  if (!await isValidToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Invalid token.' });
  }

  const { comment_id, calendar_id, window_nr } = req.query;
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, jwt_secret);
  const username = decodedToken.username;

  if (await isLocked(calendar_id)) {
    return res.status(403).json({ error: 'Forbidden. The calendar is locked and cannot be modified.' });
  }

  try {
    // Log parameters to debug potential issues
    console.log('Deleting comment with:', { comment_id, calendar_id, window_nr });

    // Lookup the user ID
    const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    const userId = userResult.rows[0]?.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Invalid user' });
    }

    // Fetch comment, window owner, and calendar owner
    const commentResult = await pool.query(`
      SELECT c.author, aw.owner AS window_owner, ac.owner AS calendar_owner 
      FROM comments c 
      JOIN adventWindow aw ON c.window_nr = aw.window_nr AND c.calendar_id = aw.calendar_id
      JOIN adventCalendars ac ON c.calendar_id = ac.id
      WHERE c.id = $1 AND c.calendar_id = $2 AND c.window_nr = $3
    `, [comment_id, calendar_id, window_nr]);

    // Check if the query returned any results
    if (commentResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const { author, window_owner, calendar_owner } = commentResult.rows[0];

    // Check if user is the comment author, window owner, or calendar owner
    if (userId === author || userId === window_owner || userId === calendar_owner) {
      // Delete the comment
      await pool.query('DELETE FROM comments WHERE id = $1', [comment_id]);
      return res.json({ success: true, message: 'Comment deleted successfully.' });
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment.' });
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.listen(7007, () => {
  console.log('Server listening on port 7007');
});