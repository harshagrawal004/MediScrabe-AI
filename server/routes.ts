import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPatientSchema, insertConsultationSchema } from "@shared/schema";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Admin endpoint to create the test doctor account
  app.post("/api/admin/create-doctor", async (req, res) => {
    try {
      const doctorData = {
        username: "testdoctor",
        password: "testpassword",
        name: "Test Doctor",
        role: "doctor"
      };

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(doctorData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Test doctor account already exists" });
      }

      const user = await storage.createUserWithHashedPassword(doctorData);

      res.status(201).json({
        message: "Doctor account created successfully",
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Error creating doctor account:', error);
      res.status(500).json({ message: 'Failed to create doctor account' });
    }
  });

  app.post("/api/patients", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertPatientSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const patient = await storage.createPatient(parsed.data);
    res.status(201).json(patient);
  });

  app.post("/api/consultations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertConsultationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const consultation = await storage.createConsultation(parsed.data);
    res.status(201).json(consultation);
  });

  app.get("/api/consultations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const consultations = await storage.getDoctorConsultations(req.user.id);
    res.json(consultations);
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  const httpServer = createServer(app);
  return httpServer;
}