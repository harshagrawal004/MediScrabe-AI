import type { Express } from "express";
import { createServer, type Server } from "http";

// Mock data for development
const mockConsultations = [
  {
    id: "1",
    date: new Date().toISOString(),
    patientId: "P001",
    duration: 1800, // 30 minutes
    status: "completed",
    audioUrl: "https://example.com/audio1.mp3",
    transcription: {
      text: "Sample transcription text",
      summary: "Patient visited for routine checkup",
      keyPoints: ["Normal blood pressure", "No significant issues"]
    }
  },
  {
    id: "2",
    date: new Date().toISOString(),
    patientId: "P002",
    duration: 900, // 15 minutes
    status: "processing",
    audioUrl: "https://example.com/audio2.mp3",
  }
];

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

  // Consultation routes
  app.get("/api/consultations", (req, res) => {
    res.json(mockConsultations);
  });

  app.get("/api/consultations/:id", (req, res) => {
    const consultation = mockConsultations.find(c => c.id === req.params.id);
    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }
    res.json(consultation);
  });

  app.post("/api/consultations", (req, res) => {
    try {
      const newConsultation = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        ...req.body,
        status: "processing"
      };
      mockConsultations.push(newConsultation);
      res.json(newConsultation);
    } catch (error) {
      res.status(500).json({ error: "Failed to create consultation" });
    }
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