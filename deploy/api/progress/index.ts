import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { progress } from "../../db/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const rows = await db.select().from(progress);
    return res.status(200).json(rows);
  }

  if (req.method === "POST") {
    const { bookId, chaptersRead, completed } = req.body ?? {};
    if (!bookId) return res.status(400).json({ error: "bookId is required" });

    const now = new Date().toISOString();
    await db
      .insert(progress)
      .values({
        bookId,
        chaptersRead: chaptersRead ?? 0,
        completed: completed ?? false,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: progress.bookId,
        set: { chaptersRead: chaptersRead ?? 0, completed: completed ?? false, updatedAt: now },
      });

    const [row] = await db.select().from(progress).where(eq(progress.bookId, bookId));
    return res.status(200).json(row);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end();
}
