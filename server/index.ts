import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { migrate } from "./migrations";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

const app = express();
// Increase JSON payload limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Add basic request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

let server: ReturnType<typeof createServer>;

// Graceful shutdown handler
process.on('SIGTERM', () => {
  if (server) {
    server.close(() => {
      console.log('Server terminated');
      process.exit(0);
    });
  }
});

(async () => {
  try {
    // Ensure session secret is set
    if (!process.env.SESSION_SECRET) {
      throw new Error("SESSION_SECRET environment variable is required");
    }

    // Run migrations before starting the server
    await migrate();

    server = await registerRoutes(app);

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Server error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const PORT = Number(process.env.PORT) || 3000;
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();