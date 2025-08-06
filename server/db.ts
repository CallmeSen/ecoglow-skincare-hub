import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Health check function for database connectivity
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

// Database initialization with proper error handling
export async function initializeDatabase(): Promise<void> {
  try {
    console.log("Checking database connection...");
    const isHealthy = await checkDatabaseHealth();
    
    if (!isHealthy) {
      throw new Error("Database connection failed");
    }
    
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}