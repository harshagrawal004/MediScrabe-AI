import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, hashPassword } from "./auth";
import { storage } from "./storage";
import { insertUserSchema, insertRecordSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Admin endpoint to create the test doctor account
  app.post("/api/admin/create-doctor", async (req, res) => {
    try {
      const doctorData = insertUserSchema.parse({
        username: "testdoctor",
        password: "testpassword",
        name: "Test Doctor",
        role: "doctor"
      });

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(doctorData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Test doctor account already exists" });
      }

      const hashedPassword = await hashPassword(doctorData.password);
      const user = await storage.createUser({
        ...doctorData,
        password: hashedPassword
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

  // Protected routes for records
  app.post("/api/records", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const parsed = insertRecordSchema.safeParse({
      ...req.body,
      userId: req.user.id,
    });

    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() });
    }

    const record = await storage.createRecord(parsed.data);
    res.status(201).json(record);
  });

  app.get("/api/records", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const records = await storage.getUserRecords(req.user.id);
    res.json(records);
  });

  app.get("/api/records/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const record = await storage.getRecord(parseInt(req.params.id));
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    if (record.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(record);
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