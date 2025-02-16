import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("doctor"),
});

// Patients table
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  age: integer("age").notNull(),
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
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).extend({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  name: z.string().min(2).max(50),
});

export const insertPatientSchema = createInsertSchema(patients).extend({
  patientId: z.string().min(3),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female", "other"]),
  age: z.number().min(0).max(150),
});

export const insertConsultationSchema = createInsertSchema(consultations).extend({
  doctorId: z.number(),
  patientId: z.number(),
  duration: z.number().optional(),
  status: z.enum(["pending", "in-progress", "completed", "failed"]).default("pending"),
  transcription: z.string().optional(),
  summary: z.string().optional(),
  metadata: z.object({}).optional(),
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type Consultation = typeof consultations.$inferSelect;