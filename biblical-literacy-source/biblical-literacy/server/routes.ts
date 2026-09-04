import type { Express } from "express";
import { createServer } from "node:http";
import type { Server } from "node:http";
import { storage } from "./storage";
import { insertReadingProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ---- Reading progress ----
  app.get("/api/progress", async (_req, res) => {
    res.json(await storage.getAllProgress());
  });

  app.post("/api/progress", async (req, res) => {
    const parsed = insertReadingProgressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    }
    res.json(await storage.upsertProgress(parsed.data));
  });

  app.post("/api/progress/reset", async (_req, res) => {
    await storage.resetAll();
    res.json({ ok: true });
  });

  // ---- Notes ----
  app.get("/api/notes", async (req, res) => {
    const bookId = typeof req.query.bookId === "string" ? req.query.bookId : undefined;
    const rows = bookId ? await storage.getNotesForBook(bookId) : await storage.getAllNotes();
    res.json(rows);
  });

  const createSchema = z.object({
    bookId: z.string().min(1),
    scope: z.enum(["book", "chapter", "verse"]),
    chapter: z.number().int().nullable().optional(),
    verseRef: z.string().nullable().optional(),
    body: z.string().default(""),
  });

  app.post("/api/notes", async (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
    const { bookId, scope, chapter, verseRef, body } = parsed.data;

    // Book- and chapter-scope are upserts (single entry per key).
    if (scope === "book") {
      return res.json(await storage.upsertBookScopeNote(bookId, body));
    }
    if (scope === "chapter") {
      if (chapter == null) return res.status(400).json({ error: "chapter required" });
      return res.json(await storage.upsertChapterScopeNote(bookId, chapter, body));
    }
    // Verse-scope creates a new record each call (many per book+chapter).
    const row = await storage.createNote({
      id: "",
      bookId,
      scope: "verse",
      chapter: chapter ?? null,
      verseRef: verseRef ?? "",
      body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    res.json(row);
  });

  app.patch("/api/notes/:id", async (req, res) => {
    const body = typeof req.body?.body === "string" ? req.body.body : "";
    const row = await storage.updateNote(req.params.id, body);
    if (!row) return res.status(404).json({ error: "not found" });
    res.json(row);
  });

  app.delete("/api/notes/:id", async (req, res) => {
    await storage.deleteNote(req.params.id);
    res.json({ ok: true });
  });

  return httpServer;
}
