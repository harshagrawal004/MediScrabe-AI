import { type IStorage } from "./types";
import { User, Patient, Consultation, InsertUser, InsertPatient, InsertConsultation } from "@shared/schema";
import PostgresStore from "connect-pg-simple";
import session from "express-session";
import { nanoid } from "nanoid";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users, patients, consultations } from "@shared/schema";

export import bcrypt from 'bcryptjs';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new (PostgresStore(session))({
      createTableIfMissing: true,
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByName(name: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.name, name));
    return user;
  }


  async createUserWithHashedPassword(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await hashPassword(insertUser.password);
    const [user] = await db.insert(users).values({
      ...insertUser,
      password: hashedPassword
    }).returning();
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const patientId = nanoid(10);
    const [patient] = await db
      .insert(patients)
      .values({ ...insertPatient, patientId })
      .returning();
    return patient;
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient;
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const [consultation] = await db
      .insert(consultations)
      .values({
        ...insertConsultation,
        date: new Date(),
        status: "pending",
        audioUrl: null,
        transcription: null,
        duration: null,
      })
      .returning();
    return consultation;
  }

  async getConsultation(id: number): Promise<Consultation | undefined> {
    const [consultation] = await db
      .select()
      .from(consultations)
      .where(eq(consultations.id, id));
    return consultation;
  }

  async updateConsultation(id: number, updates: Partial<Consultation>): Promise<Consultation> {
    const [consultation] = await db
      .update(consultations)
      .set(updates)
      .where(eq(consultations.id, id))
      .returning();
    return consultation;
  }

  async getDoctorConsultations(doctorId: number): Promise<Consultation[]> {
    return db
      .select()
      .from(consultations)
      .where(eq(consultations.doctorId, doctorId))
      .orderBy(consultations.date);
  }
}

export const storage = new DatabaseStorage();