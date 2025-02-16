
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const connectionString = process.env.DATABASE_URL;
const queryClient = postgres(connectionString, { max: 1 });
export const db = drizzle(queryClient) as PostgresJsDatabase;
export const sql = queryClient;
