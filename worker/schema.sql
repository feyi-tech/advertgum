-- Adverts Table
CREATE TABLE adverts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    youtube_link TEXT,
    start_date INTEGER NOT NULL,
    end_date INTEGER NOT NULL,
    prize1 REAL NOT NULL,
    prize2 REAL NOT NULL,
    prize3 REAL NOT NULL,
    prize4 REAL NOT NULL,
    min_clicks INTEGER NOT NULL,
    creator_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    image1_url TEXT NOT NULL,
    image2_url TEXT,
    image3_url TEXT
);

-- Participants Table
CREATE TABLE participants (
    id TEXT PRIMARY KEY,
    advert_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    unique_code TEXT NOT NULL UNIQUE,
    FOREIGN KEY (advert_id) REFERENCES adverts(id) ON DELETE CASCADE
);

-- Clicks Table
CREATE TABLE clicks (
    id TEXT PRIMARY KEY,
    advert_id TEXT NOT NULL,
    participant_id TEXT NOT NULL,
    clicked_at INTEGER NOT NULL,
    FOREIGN KEY (advert_id) REFERENCES adverts(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Indexes to improve query performance
CREATE INDEX idx_adverts_dates ON adverts (start_date, end_date);
CREATE INDEX idx_participants_user_advert ON participants (user_id, advert_id);
CREATE INDEX idx_clicks_participant ON clicks (participant_id);
