import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { apiRouter } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp() {
  const app = express();

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      if (req.path.startsWith("/api")) {
        console.log(`[API] ${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
      }
    });
    next();
  });

  // CORS headers
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Mount API router
  app.use("/api", apiRouter);

  // Serve static files in production or standalone mode
  const staticPath = path.resolve(__dirname, "..", "dist");

  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));

    // Handle client-side routing fallback for non-API routes
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }
      const indexPath = path.join(staticPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("SolarGrid frontend not built. Run pnpm build.");
      }
    });
  }

  return app;
}

async function startServer() {
  const app = await createApp();
  const server = createServer(app);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

  server.listen(port, "0.0.0.0", () => {
    console.log(`\n======================================================`);
    console.log(`⚡ SolarGrid Backend Server running at http://localhost:${port}/`);
    console.log(`⚡ Health Check: http://localhost:${port}/api/health`);
    console.log(`⚡ Telemetry:    http://localhost:${port}/api/telemetry`);
    console.log(`⚡ Energy:       http://localhost:${port}/api/energy-history`);
    console.log(`⚡ Hospital API: http://localhost:${port}/api/hospital/rooms`);
    console.log(`======================================================\n`);
  });
}

// Only auto-start if run directly
if (process.env.NODE_ENV !== "test") {
  startServer().catch(console.error);
}

