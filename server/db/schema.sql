CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY UNIQUE,
  username TEXT UNIQUE,
  pass_key TEXT NOT NULL UNIQUE,
  image_location TEXT,
  stars TEXT
);

