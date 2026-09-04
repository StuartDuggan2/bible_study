// Shared Express app factory. Used by:
// - server/index.ts (local dev + self-host production)
// - api/index.ts    (Vercel serverless entry — API only, static served by Vercel)

import express, { type Response, type NextFunction, type Request, type Express } from "express";
import { createServer, type Server } from "node:http";
import { registerRoutes } from "./routes";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export interface AppBundle {
  app: Express;
  httpServer: Server;
}

/**
 * Create an Express app with JSON parsing, request logging, API routes,
 * and error handling — but WITHOUT static file serving. The caller is
 * responsible for either mounting Vite (dev), static files (self-host),
 * or nothing (Vercel serves static separately).
 */
export async function createApp(): Promise<AppBundle> {
  const app = express();
  const httpServer = createServer(app);

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(express.urlencoded({ extended: false }));

  // Request logging for /api paths.
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let line = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          line += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        log(line);
      }
    });

    next();
  });

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) return next(err);
    return res.status(status).json({ message });
  });

  return { app, httpServer };
}
