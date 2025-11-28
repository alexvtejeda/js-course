import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// For migrations
export const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });

// For queries - limit connection pool to prevent exhausting DB connections
const queryClient = postgres(process.env.DATABASE_URL, {
  max: 10, // Maximum 10 connections per instance
  idle_timeout: 20, // Close idle connections after 20 seconds
  max_lifetime: 60 * 30, // Close connections after 30 minutes
});
export const db = drizzle(queryClient, { schema });
