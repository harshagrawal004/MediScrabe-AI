import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPatientSchema, insertConsultationSchema } from "@shared/schema";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);

  // Ensure all API routes are protected by authentication
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

  app.patch("/api/consultations/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const consultation = await storage.getConsultation(Number(req.params.id));
    if (!consultation) return res.sendStatus(404);
    if (consultation.doctorId !== req.user.id) return res.sendStatus(403);

    const { audioData, ...updates } = req.body;

    if (audioData) {
      try {
        const patient = await storage.getPatient(consultation.patientId);
        if (!patient) throw new Error("Patient not found");

        // Send to N8N webhook
        const response = await fetch(process.env.N8N_WEBHOOK_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            audioData,
            metadata: {
              consultation: {
                id: consultation.id,
                date: consultation.date,
                duration: updates.duration,
              },
              patient: {
                id: patient.id,
                patientId: patient.patientId,
                firstName: patient.firstName,
                lastName: patient.lastName,
                age: patient.age,
                gender: patient.gender,
              },
              doctor: {
                id: req.user.id,
                name: req.user.name,
              },
            }
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('N8N Error:', errorText);
          throw new Error(`Failed to process audio: ${response.status} ${response.statusText}`);
        }

        const n8nResponse = await response.json();
        console.log('N8N Response:', n8nResponse);

        if (n8nResponse && typeof n8nResponse === 'object') {
          // Update consultation with N8N processing results
          updates.transcription = n8nResponse.transcription || null;
          updates.status = "completed";
        } else {
          throw new Error('Invalid response from processing service');
        }
      } catch (error) {
        console.error('N8N processing error:', error);
        updates.status = "failed";
        return res.status(500).json({ 
          message: error instanceof Error ? error.message : 'Failed to process audio'
        });
      }
    }

    const updated = await storage.updateConsultation(consultation.id, updates);
    res.json(updated);
  });

  app.get("/api/consultations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const consultations = await storage.getDoctorConsultations(req.user.id);
    res.json(consultations);
  });

  app.get("/api/consultations/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const consultation = await storage.getConsultation(Number(req.params.id));
    if (!consultation) return res.sendStatus(404);
    if (consultation.doctorId !== req.user.id) return res.sendStatus(403);

    res.json(consultation);
  });

  const httpServer = createServer(app);
  return httpServer;
}