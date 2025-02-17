import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Add placeholder endpoint for future Supabase integration
  app.get("/api/auth/status", (req, res) => {
    res.json({ 
      authenticated: false,
      message: "Authentication will be implemented with Supabase" 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}