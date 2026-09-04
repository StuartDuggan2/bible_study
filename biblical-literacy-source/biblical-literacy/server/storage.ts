import { readingProgress, bibleNotes } from "@shared/schema";
import type { ReadingProgress, InsertReadingProgress, BibleNote, InsertBibleNote } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { getDB } from "./db";

export interface IStorage {
  getAllProgress(): Promise<ReadingProgress[]>;
  getProgress(bookId: string): Promise<ReadingProgress | undefined>;
  upsertProgress(row: InsertReadingProgress): Promise<ReadingProgress>;
  resetAll(): Promise<void>;
  // Notes
  getAllNotes(): Promise<BibleNote[]>;
  getNotesForBook(bookId: string): Promise<BibleNote[]>;
  createNote(row: InsertBibleNote): Promise<BibleNote>;
  updateNote(id: string, body: string): Promise<BibleNote | undefined>;
  deleteNote(id: string): Promise<void>;
  upsertBookScopeNote(bookId: string, body: string): Promise<BibleNote>;
  upsertChapterScopeNote(bookId: string, chapter: number, body: string): Promise<BibleNote>;
}

function now() {
  return Date.now();
}
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class DatabaseStorage implements IStorage {
  async getAllProgress(): Promise<ReadingProgress[]> {
    const { db } = await getDB();
    return await db.select().from(readingProgress).all();
  }

  async getProgress(bookId: string): Promise<ReadingProgress | undefined> {
    const { db } = await getDB();
    return await db.select().from(readingProgress).where(eq(readingProgress.bookId, bookId)).get();
  }

  async upsertProgress(row: InsertReadingProgress): Promise<ReadingProgress> {
    const { db } = await getDB();
    const existing = await this.getProgress(row.bookId);
    if (existing) {
      return await db
        .update(readingProgress)
        .set({
          chaptersRead: row.chaptersRead ?? existing.chaptersRead,
          completed: row.completed ?? existing.completed,
          notes: row.notes ?? existing.notes,
        })
        .where(eq(readingProgress.bookId, row.bookId))
        .returning()
        .get();
    }
    return await db.insert(readingProgress).values(row).returning().get();
  }

  async resetAll(): Promise<void> {
    const { db } = await getDB();
    await db.delete(readingProgress).run();
    await db.delete(bibleNotes).run();
  }

  // ---- Notes ----
  async getAllNotes(): Promise<BibleNote[]> {
    const { db } = await getDB();
    return await db.select().from(bibleNotes).orderBy(desc(bibleNotes.updatedAt)).all();
  }

  async getNotesForBook(bookId: string): Promise<BibleNote[]> {
    const { db } = await getDB();
    return await db
      .select()
      .from(bibleNotes)
      .where(eq(bibleNotes.bookId, bookId))
      .orderBy(desc(bibleNotes.updatedAt))
      .all();
  }

  async createNote(row: InsertBibleNote): Promise<BibleNote> {
    const { db } = await getDB();
    const t = now();
    const values: InsertBibleNote = {
      id: row.id || uuid(),
      bookId: row.bookId,
      scope: row.scope,
      chapter: row.chapter ?? null,
      verseRef: row.verseRef ?? null,
      body: row.body ?? "",
      createdAt: row.createdAt ?? t,
      updatedAt: row.updatedAt ?? t,
    };
    return await db.insert(bibleNotes).values(values).returning().get();
  }

  async updateNote(id: string, body: string): Promise<BibleNote | undefined> {
    const { db } = await getDB();
    return await db
      .update(bibleNotes)
      .set({ body, updatedAt: now() })
      .where(eq(bibleNotes.id, id))
      .returning()
      .get();
  }

  async deleteNote(id: string): Promise<void> {
    const { db } = await getDB();
    await db.delete(bibleNotes).where(eq(bibleNotes.id, id)).run();
  }

  async upsertBookScopeNote(bookId: string, body: string): Promise<BibleNote> {
    const { db } = await getDB();
    const rows = await db
      .select()
      .from(bibleNotes)
      .where(eq(bibleNotes.bookId, bookId))
      .all();
    const existing = rows.find((r) => r.scope === "book");
    if (existing) {
      return (await this.updateNote(existing.id, body))!;
    }
    return await this.createNote({
      id: uuid(),
      bookId,
      scope: "book",
      chapter: null,
      verseRef: null,
      body,
      createdAt: now(),
      updatedAt: now(),
    });
  }

  async upsertChapterScopeNote(bookId: string, chapter: number, body: string): Promise<BibleNote> {
    const { db } = await getDB();
    const rows = await db
      .select()
      .from(bibleNotes)
      .where(eq(bibleNotes.bookId, bookId))
      .all();
    const existing = rows.find((r) => r.scope === "chapter" && r.chapter === chapter);
    if (existing) {
      return (await this.updateNote(existing.id, body))!;
    }
    return await this.createNote({
      id: uuid(),
      bookId,
      scope: "chapter",
      chapter,
      verseRef: null,
      body,
      createdAt: now(),
      updatedAt: now(),
    });
  }
}

export const storage = new DatabaseStorage();
