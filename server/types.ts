import { User, Patient, Consultation, InsertUser, InsertPatient, InsertConsultation } from "@shared/schema";
import session from "express-session";

export interface IStorage {
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patient methods
  createPatient(patient: InsertPatient): Promise<Patient>;
  getPatient(id: number): Promise<Patient | undefined>;
  
  // Consultation methods
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getConsultation(id: number): Promise<Consultation | undefined>;
  updateConsultation(id: number, updates: Partial<Consultation>): Promise<Consultation>;
  getDoctorConsultations(doctorId: number): Promise<Consultation[]>;
}
