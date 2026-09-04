import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import type * as z from "zod/mini";

// Per-book reading progress. Rows are keyed by bookId (e.g., "genesis").
export const readingProgress = sqliteTable("reading_progress", {
  bookId: text("book_id").primaryKey(),
  chaptersRead: integer("chapters_read").notNull().default(0),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  notes: text("notes").notNull().default(""),
});

export const insertReadingProgressSchema = createInsertSchema(readingProgress).pick({
  bookId: true,
  chaptersRead: true,
  completed: true,
  notes: true,
});

export type InsertReadingProgress = z.infer<typeof insertReadingProgressSchema>;
export type ReadingProgress = typeof readingProgress.$inferSelect;

// Free-form notes at three levels of granularity:
//   - scope="book"    → chapter=null, verseRef=null, one note per book
//   - scope="chapter" → chapter=N,    verseRef=null, one note per (book, chapter)
//   - scope="verse"   → chapter=null, verseRef="Gen 1:26-27" (user-typed reference)
// Composite uniqueness is enforced in app code (upsert path) rather than by
// DB constraint so verse notes can share a book+chapter without collision.
export const bibleNotes = sqliteTable("bible_notes", {
  id: text("id").primaryKey(), // uuid
  bookId: text("book_id").notNull(),
  scope: text("scope", { enum: ["book", "chapter", "verse"] }).notNull(),
  chapter: integer("chapter"),
  verseRef: text("verse_ref"),
  body: text("body").notNull().default(""),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const insertBibleNoteSchema = createInsertSchema(bibleNotes).pick({
  id: true,
  bookId: true,
  scope: true,
  chapter: true,
  verseRef: true,
  body: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBibleNote = z.infer<typeof insertBibleNoteSchema>;
export type BibleNote = typeof bibleNotes.$inferSelect;
