import { type IStorage } from "./types";
import { User, InsertUser, Record, InsertRecord } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users, records } from "@shared/schema";
import session from "express-session";
import PostgresStore from "connect-pg-simple";

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new (PostgresStore(session))({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
      tableName: 'session', // Use the existing session table
      pruneSessionInterval: 60 * 15, // Prune expired sessions every 15 minutes
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(insertUser)
        .returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Record methods
  async createRecord(record: InsertRecord): Promise<Record> {
    const [newRecord] = await db
      .insert(records)
      .values(record)
      .returning();
    return newRecord;
  }

  async getRecord(id: number): Promise<Record | undefined> {
    const [record] = await db.select().from(records).where(eq(records.id, id));
    return record;
  }

  async updateRecord(id: number, updates: Partial<Record>): Promise<Record> {
    const [updated] = await db
      .update(records)
      .set(updates)
      .where(eq(records.id, id))
      .returning();
    return updated;
  }

  async getUserRecords(userId: number): Promise<Record[]> {
    return db
      .select()
      .from(records)
      .where(eq(records.userId, userId))
      .orderBy(records.createdAt);
  }
}

export const storage = new DatabaseStorage();