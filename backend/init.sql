-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
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
    address_name VARCHAR(255),
    address POINT,
    apero BOOLEAN,
    time TIME,
    location_hint VARCHAR(255),
    window_nr INT NOT NULL,
    calendar_id INT NOT NULL, -- Corrected reference to adventCalendar
    image_paths VARCHAR(255)[], -- @Patrick: what image_paths do we want to store here?
    pictures BYTEA[], -- BYTEA for storing image data (in PostgreSQL)
    comments VARCHAR(255)[],
    FOREIGN KEY (owner) REFERENCES users(id),
    FOREIGN KEY (calendar_id) REFERENCES adventCalendar(id),
    CONSTRAINT unique_window_calendar_key UNIQUE (window_nr, calendar_id)
);

--Example data
-- Insert data into users
INSERT INTO users (username, password) VALUES
    ('user1', '$2b$10$WyegkCk/niLebmx.exOfm.EMBhscILZ8/UTPHsVNvBIojEcSrr7m6'), --password1
    ('user2', '$2b$10$GAYsim0m3NxGrcIHLVBl0.qP/SB9TlC9Xe6eVINxhdceqgl2zG/De'), --password2
    ('user3', '$2b$10$BGa9DGKq1SdKJs8QGK29De3qPxqrDpRg52We6nRgx7LixHi6Ba0Ka'), --password3
    ('user4', 'password4'),
    ('user5', 'password5');

-- Insert data into adventCalendar
INSERT INTO adventCalendar (name)
VALUES
    ('Adventskalender Schlieren 8952'),
    ('Adventskalender Basel 4057'),
    ('Adventskalender Zürich 8053');

-- Insert data into adventCalendars
INSERT INTO adventCalendars (owner, name)
VALUES
    (1, 'Adventskalender Schlieren 8952'),
    (2, 'Adventskalender Basel 4057'),
    (3, 'Adventskalender Zürich 8053');


INSERT INTO adventWindow (owner, address_name, address, apero, time, location_hint, window_nr, calendar_id, image_paths, pictures, comments)
VALUES
    (1, 'Pfingstweidstrasse 107, 8005 Zürich', POINT(47.39152336890094, 8.5046484808549649), true, '17:00:00', 'Open your eyes', 1, 1, ARRAY['https://www.goenhard.ch/wp-content/uploads/P1130972Adventsfenster_Goenhard_Aarau_2020.jpg'], ARRAY[]::bytea[], ARRAY['Nice view!', 'Great atmosphere!']),
    (2, 'Förrlibuckstrasse 190, 8005 Zürich', POINT(47.39238739936754, 8.510283739643468), true, '18:00:00', 'Open your eyes', 4, 1, ARRAY[]::VARCHAR[], ARRAY[]::bytea[], ARRAY['Nice view!', 'Great atmosphere!']),
    (3, 'Hardturmstrasse 132, 8005 Zürich', POINT(47.39387075500006, 8.511538606053824), true, '19:00:00', 'Open your eyes', 5, 1, ARRAY['https://www.goenhard.ch/wp-content/uploads/P1130972Adventsfenster_Goenhard_Aarau_2020.jpg'], ARRAY[]::bytea[], ARRAY['Nice view!', 'Great atmosphere!']),
    (4, 'Blumengasse 5, 4051 Basel', POINT(47.5596, 7.5886), false, '20:00:00', 'Look to the left!', 2, 2, ARRAY['https://www.goenhard.ch/wp-content/uploads/P1130972Adventsfenster_Goenhard_Aarau_2020.jpg'], ARRAY[]::bytea[], ARRAY['Amazing location!', 'No apero this time.']),
    (5, 'Bahnhofquai 15, 8001 Zürich', POINT(47.3769, 8.5417), true, '19:30:00', 'Seriously, you cant see it?', 3, 3, ARRAY['https://www.goenhard.ch/wp-content/uploads/P1130972Adventsfenster_Goenhard_Aarau_2020.jpg'], ARRAY[]::bytea[], ARRAY['Fantastic experience!', 'Loved the apero.']);