import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { notes } from "../../db/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  if (typeof id !== "string") return res.status(400).json({ error: "invalid id" });

  if (req.method === "PATCH") {
    const { body } = req.body ?? {};
    if (typeof body !== "string") return res.status(400).json({ error: "body is required" });

    const [row] = await db
      .update(notes)
      .set({ body, updatedAt: new Date().toISOString() })
      .where(eq(notes.id, id))
      .returning();

    if (!row) return res.status(404).json({ error: "note not found" });
    return res.status(200).json(row);
  }

  if (req.method === "DELETE") {
    await db.delete(notes).where(eq(notes.id, id));
    return res.status(204).end();
  }

  res.setHeader("Allow", ["PATCH", "DELETE"]);
  return res.status(405).end();
}
