import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with clean structure
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("doctor"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas with proper validation
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
}).omit({ id: true, createdAt: true });

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Patients table
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  age: integer("age").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Consultations table
export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").notNull(),
  patientId: integer("patient_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  duration: integer("duration"),
  status: text("status").notNull().default("pending"),
  transcription: text("transcription"),
  summary: text("summary"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schemas with proper validation
export const insertPatientSchema = createInsertSchema(patients, {
  patientId: z.string().min(3, "Patient ID must be at least 3 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female", "other"]),
  age: z.number().min(0).max(150),
}).omit({ id: true, createdAt: true });

export const insertConsultationSchema = createInsertSchema(consultations, {
  doctorId: z.number(),
  patientId: z.number(),
  duration: z.number().optional(),
  status: z.enum(["pending", "in-progress", "completed", "failed"]).default("pending"),
  transcription: z.string().optional(),
  summary: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
}).omit({ id: true, createdAt: true });

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;