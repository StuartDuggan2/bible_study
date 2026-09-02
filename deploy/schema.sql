-- Run this once in the Turso web SQL console (app.turso.tech -> your database -> "Shell" / "Query")
-- to create the tables. This is the raw SQL equivalent of db/schema.ts, so you
-- don't need Node/drizzle-kit installed locally to set up the database.

CREATE TABLE IF NOT EXISTS progress (
  book_id TEXT PRIMARY KEY,
  chapters_read INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  scope TEXT NOT NULL CHECK (scope IN ('book', 'chapter', 'verse')),
  chapter INTEGER,
  verse_ref TEXT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
