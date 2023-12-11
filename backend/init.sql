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
    owner INT NOT NULL,
    address POINT,
    apero BOOLEAN,
    time TIME,
    location_hint VARCHAR(255),
    window_nr INT,
    calendar_id INT NOT NULL, -- Corrected reference to adventCalendar
    pictures BYTEA[], -- BYTEA for storing image data (in PostgreSQL)
    comments VARCHAR(255)[],
    FOREIGN KEY (owner) REFERENCES users(id),
    FOREIGN KEY (calendar_id) REFERENCES adventCalendar(id)
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



-- Insert data into adventWindow
INSERT INTO adventWindow (owner, address, apero, time, location_hint, window_nr, calendar_id, comments)
VALUES
    (1, POINT(47.3902, 8.5039), true, '18:00:00', 'Open your eyes', 1, 1, ARRAY['Nice view!', 'Great atmosphere!']),
    (2, POINT(47.5596, 7.5886), false, '20:00:00', 'Look to the left!', 2, 2, ARRAY['Amazing location!', 'No apero this time.']),
    (3, POINT(47.3769, 8.5417), true, '19:30:00', 'Seriously, you cant see it?', 3, 3, ARRAY['Fantastic experience!', 'Loved the apero.']);
