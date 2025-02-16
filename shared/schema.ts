import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("doctor"),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  patientId: text("patient_id").notNull().unique(),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  status: text("status").notNull().default("pending"),
  audioUrl: text("audio_url"),
  transcription: jsonb("transcription"),
  duration: integer("duration"),
});

export const sessions = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).extend({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  name: z.string().min(2).max(50),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  patientId: true,
}).extend({
  firstName: z.string().min(2).max(50).regex(/^[a-zA-Z\s]*$/),
  lastName: z.string().min(2).max(50).regex(/^[a-zA-Z\s]*$/),
  age: z.number().min(0).max(150),
  gender: z.enum(["male", "female", "other"]),
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  date: true,
  status: true,
  audioUrl: true,
  transcription: true,
  duration: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Patient = typeof patients.$inferSelect;
export type Consultation = typeof consultations.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;