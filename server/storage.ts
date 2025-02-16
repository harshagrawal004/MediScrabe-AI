import { type IStorage } from "./types";
import { User, Patient, Consultation, InsertUser, InsertPatient, InsertConsultation } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";
import { nanoid } from "nanoid";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private consultations: Map<number, Consultation>;
  sessionStore: session.Store;
  currentId: { users: number; patients: number; consultations: number };

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.consultations = new Map();
    this.currentId = { users: 1, patients: 1, consultations: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, role: "doctor" };
    this.users.set(id, user);
    return user;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.currentId.patients++;
    const patientId = nanoid(10);
    const patient: Patient = { ...insertPatient, id, patientId };
    this.patients.set(id, patient);
    return patient;
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = this.currentId.consultations++;
    const consultation: Consultation = {
      ...insertConsultation,
      id,
      date: new Date(),
      status: "pending",
      audioUrl: null,
      transcription: null,
      duration: null,
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async getConsultation(id: number): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }

  async updateConsultation(id: number, updates: Partial<Consultation>): Promise<Consultation> {
    const consultation = await this.getConsultation(id);
    if (!consultation) throw new Error("Consultation not found");
    
    const updated = { ...consultation, ...updates };
    this.consultations.set(id, updated);
    return updated;
  }

  async getDoctorConsultations(doctorId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values())
      .filter(c => c.doctorId === doctorId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}

export const storage = new MemStorage();
