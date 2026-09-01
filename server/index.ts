import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { apiRouter } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp() {
  const app = express();

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for non-API routes
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(staticPath, "index.html"), (err) => {
      if (err) {
        // Fallback for dev mode when dist/public might not be built
        res.status(404).send("SolarGrid Frontend not built yet. Run npm run dev or npm run build.");
      }
    });
  });

  return app;
}

async function startServer() {
  const app = await createApp();
  const server = createServer(app);

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`SolarGrid Server running on http://localhost:${port}/`);
    console.log(`SolarGrid API available at http://localhost:${port}/api/health`);
  });
}

// Only auto-start if run directly
if (process.env.NODE_ENV !== "test") {
  startServer().catch(console.error);
}
