// Vercel serverless entry point.
//
// All /api/* traffic is routed here by vercel.json. We create the Express
// app once per warm invocation and delegate every request to it.

import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "../server/app";

// Lazy-init: build the app once per lambda instance (survives across
// warm invocations, rebuilt on cold start).
let appPromise: ReturnType<typeof createApp> | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!appPromise) appPromise = createApp();
  const { app } = await appPromise;
  return (app as any)(req, res);
}

// Vercel Node runtime config: bump the timeout a bit for cold starts.
export const config = {
  maxDuration: 15,
};
