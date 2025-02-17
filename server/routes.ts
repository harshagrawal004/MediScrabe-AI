import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Basic health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Patient routes
  app.post("/api/records", (req, res) => {
    try {
      // For now, return a mock response since we're not using Supabase yet
      res.json({
        id: Math.floor(Math.random() * 1000),
        ...req.body,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create record" });
    }
  });

  app.get("/api/records", (req, res) => {
    // Return mock data for now
    res.json([]);
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