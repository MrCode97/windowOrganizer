-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Create AdventCalendars table
CREATE TABLE IF NOT EXISTS adventCalendars (
    id SERIAL PRIMARY KEY,
    locked BOOLEAN DEFAULT FALSE,
    owner INT NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    additional_info TEXT,
    FOREIGN KEY (owner) REFERENCES users(id)
);

-- Create Comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    calendar_id INT NOT NULL,
    window_nr INT NOT NULL,
    author INT REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    UNIQUE (calendar_id, window_nr, id),
    FOREIGN KEY (calendar_id) REFERENCES adventCalendars(id) ON DELETE CASCADE
);

-- Create Pictures table
CREATE TABLE IF NOT EXISTS pictures (
    id SERIAL PRIMARY KEY,
    calendar_id INT NOT NULL,
    window_nr INT NOT NULL,
    author INT REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content BYTEA NOT NULL,
    UNIQUE (calendar_id, window_nr, id),
    FOREIGN KEY (calendar_id) REFERENCES adventCalendars(id) ON DELETE CASCADE
);


-- Create AdventWindow table
CREATE TABLE IF NOT EXISTS adventWindow (
    id SERIAL PRIMARY KEY,
    owner INT REFERENCES users(id),
    address_name VARCHAR(255),
    address POINT NOT NULL,
    apero BOOLEAN,
    time TIME,
    location_hint VARCHAR(255),
    window_nr INT NOT NULL,
    calendar_id INT NOT NULL,
    FOREIGN KEY (owner) REFERENCES users(id),
    FOREIGN KEY (calendar_id) REFERENCES adventCalendars(id) ON DELETE CASCADE,
    CONSTRAINT unique_window_calendar_key UNIQUE (window_nr, calendar_id)
);

-- Trigger to prevent updates if a calendar is locked
CREATE OR REPLACE FUNCTION prevent_updates_if_locked() RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT locked FROM adventCalendars WHERE id = NEW.calendar_id) THEN
        RAISE EXCEPTION 'Calendar is locked and cannot be updated';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for relevant tables
CREATE TRIGGER check_calendar_lock
BEFORE INSERT OR UPDATE ON adventWindow
FOR EACH ROW EXECUTE FUNCTION prevent_updates_if_locked();

CREATE TRIGGER check_calendar_lock_comments
BEFORE INSERT OR UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION prevent_updates_if_locked();

CREATE TRIGGER check_calendar_lock_pictures
BEFORE INSERT OR UPDATE ON pictures
FOR EACH ROW EXECUTE FUNCTION prevent_updates_if_locked();

--Example data
-- Insert data into users
INSERT INTO users (username, password) VALUES
    ('user1', '$2b$10$WyegkCk/niLebmx.exOfm.EMBhscILZ8/UTPHsVNvBIojEcSrr7m6'), --password1
    ('user2', '$2b$10$GAYsim0m3NxGrcIHLVBl0.qP/SB9TlC9Xe6eVINxhdceqgl2zG/De'), --password2
    ('user3', '$2b$10$BGa9DGKq1SdKJs8QGK29De3qPxqrDpRg52We6nRgx7LixHi6Ba0Ka'), --password3
    ('user4', 'password4'),
    ('user5', 'password5');

-- Insert data into adventCalendars with additional_info
INSERT INTO adventCalendars (owner, name, additional_info)
VALUES
    (1, 'Adventskalender Schlieren 8952', 'A unique advent calendar in Schlieren.'),
    (2, 'Adventskalender Basel 4057', 'Join the festive celebration in Basel!'),
    (3, 'Adventskalender Zürich 8053', 'Experience the magic of Zurich this December.');



INSERT INTO adventWindow (owner, address_name, address, apero, time, location_hint, window_nr, calendar_id)
VALUES
    (1, 'Pfingstweidstrasse 107, 8005 Zürich', POINT(47.39152336890094, 8.5046484808549649), true, '17:00:00', 'Open your eyes', 1, 1),
    (2, 'Förrlibuckstrasse 190, 8005 Zürich', POINT(47.39238739936754, 8.510283739643468), true, '18:00:00', 'Open your eyes', 4, 1),
    (3, 'Hardturmstrasse 132, 8005 Zürich', POINT(47.39387075500006, 8.511538606053824), true, '19:00:00', 'Open your eyes', 5, 1),
    (4, 'Blumengasse 5, 4051 Basel', POINT(47.5596, 7.5886), false, '20:00:00', 'Look to the left!', 2, 2),
    (5, 'Bahnhofquai 15, 8001 Zürich', POINT(47.3769, 8.5417), true, '19:30:00', 'Seriously, you can’t see it?', 3, 3);

INSERT INTO comments (calendar_id, window_nr, author, content)
VALUES
    (1, 1, 1, 'Nice view!'),
    (1, 1, 2, 'Great atmosphere!'),
    (1, 4, 1, 'Nice view!'),
    (1, 4, 3, 'Great atmosphere!'),
    (1, 5, 1, 'Nice view!'),
    (1, 5, 3, 'Great atmosphere!'),
    (2, 2, 2, 'Amazing location!'),
    (2, 2, 3, 'No apero this time.'),
    (3, 3, 3, 'Fantastic experience!'),
    (3, 3, 1, 'Loved the apero.');

INSERT INTO pictures (calendar_id, window_nr, author, content)
VALUES
    (1, 1, 1, '\\x89504e470d0a1a0a0000000d49484452'),
    (1, 4, 2, '\\x89504e470d0a1a0a0000000d49484452'),
    (1, 5, 3, '\\x89504e470d0a1a0a0000000d49484452'),
    (2, 2, 2, '\\x89504e470d0a1a0a0000000d49484452'),
    (3, 3, 1, '\\x89504e470d0a1a0a0000000d49484452');
