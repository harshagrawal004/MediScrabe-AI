import { User, Record, InsertUser, InsertRecord } from "@shared/schema";
import session from "express-session";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Record methods
  createRecord(record: InsertRecord): Promise<Record>;
  getRecord(id: number): Promise<Record | undefined>;
  updateRecord(id: number, updates: Partial<Record>): Promise<Record>;
  getUserRecords(userId: number): Promise<Record[]>;
}