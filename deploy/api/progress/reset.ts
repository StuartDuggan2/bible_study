import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../../db/client";
import { progress } from "../../db/schema";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  // Clears reading progress only; notes are left intact.
  await db.delete(progress);
  return res.status(200).json({ ok: true });
}
