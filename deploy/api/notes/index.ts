import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { notes } from "../../db/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const { bookId } = req.query;
    const rows =
      typeof bookId === "string"
        ? await db.select().from(notes).where(eq(notes.bookId, bookId))
        : await db.select().from(notes);
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const { bookId, scope, chapter, verseRef, body } = req.body ?? {};
    if (!bookId || !scope || !body) {
      return res.status(400).json({ error: "bookId, scope, and body are required" });
    }

    const now = new Date().toISOString();
    const [row] = await db
      .insert(notes)
      .values({
        id: randomUUID(),
        bookId,
        scope,
        chapter: chapter ?? null,
        verseRef: verseRef ?? null,
        body,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return res.status(201).json(row);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end();
}
