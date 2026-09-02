import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Single-user for now. If you add accounts later, add a `userId` column
// to both tables (default it to "default-user") and scope every query by it.

export const progress = sqliteTable("progress", {
  bookId: text("book_id").primaryKey(),
  chaptersRead: integer("chapters_read").notNull().default(0),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull(),
});

export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  bookId: text("book_id").notNull(),
  scope: text("scope", { enum: ["book", "chapter", "verse"] }).notNull(),
  chapter: integer("chapter"),
  verseRef: text("verse_ref"),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
