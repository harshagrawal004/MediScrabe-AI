// This file will be updated once we integrate Supabase
import { type IStorage } from "./types";

export class InMemoryStorage implements IStorage {
  // Storage methods will be implemented with Supabase
  constructor() {}
}

export const storage = new InMemoryStorage();