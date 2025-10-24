/**
 * PostgreSQL Database Connection Pool
 *
 * Singleton pool para conexiones a PostgreSQL
 */

import { Pool, QueryResult, QueryResultRow } from 'pg';

let pool: Pool | null = null;

/**
 * Get or create PostgreSQL connection pool
 */
function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Log pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }

  return pool;
}

/**
 * Execute a SQL query
 *
 * @param text - SQL query string
 * @param params - Query parameters
 * @returns Query result
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  const start = Date.now();

  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    // Log slow queries (> 1s)
    if (duration > 1000) {
      console.warn(`Slow query detected (${duration}ms):`, {
        text: text.substring(0, 100),
        params,
      });
    }

    return result;
  } catch (error) {
    console.error('Database query error:', {
      error,
      text: text.substring(0, 100),
      params,
    });
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  const pool = getPool();
  return await pool.connect();
}

/**
 * Close the connection pool
 * (Only use in scripts or when shutting down)
 */
export async function end() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
