// Database driver selection: local (better-sqlite3) vs Turso (libsql).
// Selected by presence of TURSO_DATABASE_URL environment variable.

import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

// Union type so downstream code can use either backend. Drizzle's query
// builder produces the same statement AST for both; we normalise return
// shapes at the storage layer.
export type AnyDB = LibSQLDatabase | BetterSQLite3Database;

const BOOTSTRAP_SQL = `
  CREATE TABLE IF NOT EXISTS reading_progress (
    book_id TEXT PRIMARY KEY,
    chapters_read INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS bible_notes (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    scope TEXT NOT NULL,
    chapter INTEGER,
    verse_ref TEXT,
    body TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_bible_notes_book ON bible_notes(book_id);
  CREATE INDEX IF NOT EXISTS idx_bible_notes_scope ON bible_notes(scope);
`;

export type DBKind = "libsql" | "sqlite";

export interface DBHandle {
  kind: DBKind;
  db: AnyDB;
}

let cached: DBHandle | null = null;

export async function getDB(): Promise<DBHandle> {
  if (cached) return cached;

  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    // Remote Turso (production on Vercel, or any hosted deploy).
    const { createClient } = await import("@libsql/client");
    const { drizzle } = await import("drizzle-orm/libsql");
    const client = createClient({ url: tursoUrl, authToken: tursoToken });

    // Bootstrap idempotently. libsql's batch splits on semicolons, so we
    // send each statement individually.
    const statements = BOOTSTRAP_SQL.split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const sql of statements) {
      await client.execute(sql);
    }

    const db = drizzle(client);
    cached = { kind: "libsql", db };
    return cached;
  }

  // Local dev / self-host: better-sqlite3 file.
  const Database = (await import("better-sqlite3")).default;
  const { drizzle } = await import("drizzle-orm/better-sqlite3");
  const filePath = process.env.SQLITE_PATH || "data.db";
  const sqlite = new Database(filePath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.exec(BOOTSTRAP_SQL);
  const db = drizzle(sqlite);
  cached = { kind: "sqlite", db };
  return cached;
}
