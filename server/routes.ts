import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPatientSchema, insertConsultationSchema } from "@shared/schema";
import fetch from "node-fetch";
import { z } from 'zod'; // Added for schema validation


// Placeholder for a proper password hashing function
async function hashPassword(password: string): Promise<string> {
  // In a real application, use a strong hashing library like bcrypt
  return `hashed_${password}`; 
}

// Define a user schema (replace with your actual schema)
const insertUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().default('user'), // added default role
  // Add other user fields as needed
});


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

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Admin endpoint to create users
  app.post("/api/admin/create-doctor", async (req, res) => {
  try {
    const user = await storage.createUserWithHashedPassword({
      username: "Harshagrawal004",
      password: "Harsh@2004",
      name: "Harsh Agrawal",
      role: "doctor"
    });
    
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

app.post("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.sendStatus(403);
    }

    const parsed = insertUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    try {
      const hashedPassword = await hashPassword(parsed.data.password);
      const user = await storage.createUser({
        ...parsed.data,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}