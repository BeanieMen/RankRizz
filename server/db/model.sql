CREATE TABLE IF NOT EXISTS Users (
  id TEXT PRIMARY KEY UNIQUE,
  username TEXT NOT NULL UNIQUE,
  passKey TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Images (
  id TEXT PRIMARY KEY UNIQUE,
  userId TEXT REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Stars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  imageId INTEGER REFERENCES Images(id) ON DELETE CASCADE,
  starReviewCount INTEGER CHECK (starReviewCount BETWEEN 1 AND 5)
);

CREATE TABLE IF NOT EXISTS Comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  imageId INTEGER REFERENCES Images(id) ON DELETE CASCADE,
  comment TEXT
);

CREATE TABLE IF NOT EXISTS IpLookup (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ipAddress TEXT NOT NULL UNIQUE,
  userId TEXT REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RatingLookup (
  ipAddress TEXT REFERENCES IpLookup(ipAddress) ON DELETE CASCADE,
  imageId INTEGER REFERENCES Images(id) ON DELETE CASCADE,
  commented BOOLEAN NOT NULL,
  starRated BOOLEAN NOT NULL,
  PRIMARY KEY (ipAddress, imageId)
);
