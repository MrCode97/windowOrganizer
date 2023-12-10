-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create AdventCalendar table
CREATE TABLE IF NOT EXISTS adventCalendar (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Create AdventCalendars table
CREATE TABLE IF NOT EXISTS adventCalendars (
    id SERIAL PRIMARY KEY,
    owner INT NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (name) REFERENCES adventCalendar(name),
    FOREIGN KEY (owner) REFERENCES users(id)
);

-- Create AdventWindow table
CREATE TABLE IF NOT EXISTS adventWindow (
    id SERIAL PRIMARY KEY,
    owner INT REFERENCES users(id),
    address POINT,
    apero BOOLEAN,
    time TIME,
    pictures BYTEA[], -- BYTEA for storing image data (in PostgreSQL)
    comments VARCHAR(255)[],
    FOREIGN KEY (owner) REFERENCES users(id)
);



--Example data
-- Insert data into users
INSERT INTO users (username, password) VALUES
    ('user1', 'password1'),
    ('user2', 'password2'),
    ('user3', 'password3');

-- Insert data into adventCalendar
INSERT INTO adventCalendar (name)
VALUES
    ('Adventskalender Schlieren 8952'),
    ('Adventskalender Basel 4057'),
    ('some other registered calendar');

-- Insert data into adventCalendars
INSERT INTO adventCalendars (owner, name)
VALUES
    (1, 'Adventskalender Schlieren 8952'),
    (2, 'Adventskalender Basel 4057'),
    (3, 'some other registered calendar');
