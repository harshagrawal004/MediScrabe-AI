import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPatientSchema, insertConsultationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

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

  app.patch("/api/consultations/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const consultation = await storage.getConsultation(Number(req.params.id));
    if (!consultation) return res.sendStatus(404);
    if (consultation.doctorId !== req.user.id) return res.sendStatus(403);

    const updated = await storage.updateConsultation(consultation.id, req.body);
    res.json(updated);
  });

  const httpServer = createServer(app);
  return httpServer;
}
