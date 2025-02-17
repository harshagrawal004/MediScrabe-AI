import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Patients table to store patient information
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  identifier: text("identifier").notNull(), // Medical record number or other unique identifier
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Consultations table to store consultation sessions
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => patients.id),
  doctorId: integer("doctor_id")
    .notNull()
    .references(() => users.id),
  date: timestamp("date").notNull().defaultNow(),
  duration: integer("duration"), // in seconds
  status: text("status").notNull().default("pending"), // pending, processing, completed, error
  audioData: text("audio_data"), // base64 encoded audio data
  transcription: jsonb("transcription").default({}), // Stores both text and summary
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas with proper validation
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["user", "admin", "doctor"]).default("user"),
}).omit({ id: true, createdAt: true });

export const insertPatientSchema = createInsertSchema(patients, {
  name: z.string().min(2, "Patient name is required"),
  identifier: z.string().min(1, "Patient identifier is required"),
}).omit({ id: true, createdAt: true });

export const insertConsultationSchema = createInsertSchema(consultations, {
  patientId: z.number().int().positive(),
  doctorId: z.number().int().positive(),
  date: z.date().default(() => new Date()),
  duration: z.number().int().optional(),
  status: z.enum(["pending", "processing", "completed", "error"]).default("pending"),
  audioData: z.string().optional(),
  transcription: z.record(z.unknown()).optional(),
}).omit({ id: true, createdAt: true });

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;