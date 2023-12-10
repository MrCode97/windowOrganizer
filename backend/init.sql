-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create AdventCalendar table
CREATE TABLE IF NOT EXISTS adventCalendar (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create AdventCalendars table
CREATE TABLE IF NOT EXISTS adventCalendars (
    id SERIAL PRIMARY KEY,
    adventCalendarId INT UNIQUE NOT NULL,
    owner INT,
    FOREIGN KEY (adventCalendarId) REFERENCES adventCalendar(id),
    FOREIGN KEY (owner) REFERENCES users(id)
);

-- Create AdventWindow table
CREATE TABLE IF NOT EXISTS adventWindow (
    id SERIAL PRIMARY KEY,
    owner INT,
    address POINT,
    apero BOOLEAN,
    time TIME,
    pictures BYTEA[], -- BYTEA for storing image data (in PostgreSQL)
    comments VARCHAR(255)[],
    FOREIGN KEY (owner) REFERENCES users(id)
);
