/**
 * Database Client for PostgreSQL
 *
 * Provides connection to Vercel Postgres with proper error handling
 * and connection pooling
 */

import { sql } from '@vercel/postgres';

/**
 * Database client using Vercel Postgres
 *
 * The connection is automatically configured through environment variables:
 * - POSTGRES_URL (or DATABASE_URL)
 *
 * Connection pooling is handled automatically by Vercel Postgres
 */
export const db = sql;

/**
 * Test database connection
 *
 * @returns true if connection successful, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1 as test`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Check if a table exists in the database
 *
 * @param tableName - Name of the table to check
 * @returns true if table exists, false otherwise
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
      ) as exists
    `;

    return result.rows[0]?.exists || false;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

/**
 * Execute raw SQL query (use with caution)
 *
 * @param query - SQL query to execute
 * @param params - Query parameters
 * @returns Query result
 */
export async function executeQuery<T = any>(query: string, ...params: any[]): Promise<T[]> {
  try {
    const result = await sql.query(query, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
