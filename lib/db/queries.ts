/**
 * Database Queries
 *
 * All database operations for users, preferences, and leads
 * Uses parameterized queries to prevent SQL injection
 */

import { sql } from '@vercel/postgres';

/**
 * User type from database
 */
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name?: string;
  nickname?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * User preferences type from database
 */
export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  currency: string;
  notifications_enabled: boolean;
  favorite_dolares: string[];
  favorite_currencies: string[];
  favorite_cryptos: string[];
  favorite_charts: string[];
  created_at: Date;
  updated_at: Date;
}

/**
 * User alert type from database
 */
export interface UserAlert {
  id: string;
  user_id: string;
  tipo: 'dolar' | 'inflacion' | 'riesgo-pais' | 'uva' | 'tasa';
  nombre: string;
  condicion: 'mayor' | 'menor' | 'igual';
  valor_objetivo: number;
  estado: 'activa' | 'disparada' | 'pausada';
  metadata: Record<string, any>;
  fecha_creacion: Date;
  fecha_ultima_verificacion?: Date;
  fecha_disparada?: Date;
  notificacion_enviada: boolean;
  mensaje?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Lead type from database
 */
export interface Lead {
  id: string;
  email: string;
  name?: string;
  source: string;
  status: 'pending' | 'contacted' | 'converted';
  created_at: Date;
}

/**
 * Safe user type (without password hash)
 */
export type SafeUser = Omit<User, 'password_hash'>;

// ============================================================================
// USER QUERIES
// ============================================================================

/**
 * Create a new user
 *
 * @param email - User email (unique)
 * @param passwordHash - Hashed password
 * @param name - Optional user name
 * @param nickname - Optional user nickname (fallback to name if not provided)
 * @returns Created user (without password hash)
 */
export async function createUser(
  email: string,
  passwordHash: string,
  name?: string,
  nickname?: string
): Promise<SafeUser> {
  const result = await sql`
    INSERT INTO users (email, password_hash, name, nickname)
    VALUES (${email}, ${passwordHash}, ${name || null}, ${nickname || name || null})
    RETURNING id, email, name, nickname, created_at, updated_at
  `;

  return result.rows[0] as SafeUser;
}

/**
 * Find user by email
 *
 * @param email - User email
 * @returns User (with password hash) or null if not found
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, password_hash, name, created_at, updated_at
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  return (result.rows[0] as User) || null;
}

/**
 * Find user by ID
 *
 * @param id - User ID
 * @returns User (without password hash) or null if not found
 */
export async function findUserById(id: string): Promise<SafeUser | null> {
  const result = await sql`
    SELECT id, email, name, nickname, created_at, updated_at
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;

  return (result.rows[0] as SafeUser) || null;
}

/**
 * Update user information
 *
 * @param id - User ID
 * @param updates - Fields to update
 * @returns Updated user (without password hash)
 */
export async function updateUser(
  id: string,
  updates: { name?: string; email?: string; nickname?: string }
): Promise<SafeUser> {
  const { name, email, nickname } = updates;

  const result = await sql`
    UPDATE users
    SET
      name = COALESCE(${name || null}, name),
      email = COALESCE(${email || null}, email),
      nickname = COALESCE(${nickname || null}, nickname),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, email, name, nickname, created_at, updated_at
  `;

  return result.rows[0] as SafeUser;
}

/**
 * Update user password
 *
 * @param id - User ID
 * @param newPasswordHash - New hashed password
 */
export async function updateUserPassword(id: string, newPasswordHash: string): Promise<void> {
  await sql`
    UPDATE users
    SET
      password_hash = ${newPasswordHash},
      updated_at = NOW()
    WHERE id = ${id}
  `;
}

/**
 * Delete user
 *
 * @param id - User ID
 */
export async function deleteUser(id: string): Promise<void> {
  await sql`
    DELETE FROM users
    WHERE id = ${id}
  `;
}

/**
 * Find user by nickname
 *
 * @param nickname - User nickname
 * @returns User (with password hash) or null if not found
 */
export async function findUserByNickname(nickname: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, password_hash, name, nickname, created_at, updated_at
    FROM users
    WHERE nickname = ${nickname}
    LIMIT 1
  `;

  return (result.rows[0] as User) || null;
}

/**
 * Get total count of registered users
 *
 * @returns Number of users
 */
export async function getUsersCount(): Promise<number> {
  const result = await sql`
    SELECT COUNT(*) as count
    FROM users
  `;

  return parseInt(result.rows[0].count, 10);
}

// ============================================================================
// USER PREFERENCES QUERIES
// ============================================================================

/**
 * Get user preferences
 *
 * @param userId - User ID
 * @returns User preferences or null if not found
 */
export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const result = await sql`
    SELECT *
    FROM user_preferences
    WHERE user_id = ${userId}
    LIMIT 1
  `;

  return (result.rows[0] as UserPreferences) || null;
}

/**
 * Create default user preferences
 *
 * @param userId - User ID
 * @returns Created preferences
 */
export async function createUserPreferences(userId: string): Promise<UserPreferences> {
  const result = await sql`
    INSERT INTO user_preferences (user_id)
    VALUES (${userId})
    RETURNING *
  `;

  return result.rows[0] as UserPreferences;
}

/**
 * Update user preferences
 *
 * @param userId - User ID
 * @param preferences - Preferences to update
 * @returns Updated preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<UserPreferences> {
  const {
    theme,
    currency,
    notifications_enabled,
    favorite_dolares,
    favorite_currencies,
    favorite_cryptos,
    favorite_charts,
  } = preferences;

  const result = await sql`
    UPDATE user_preferences
    SET
      theme = COALESCE(${theme || null}, theme),
      currency = COALESCE(${currency || null}, currency),
      notifications_enabled = COALESCE(${notifications_enabled ?? null}, notifications_enabled),
      favorite_dolares = COALESCE(${favorite_dolares ? JSON.stringify(favorite_dolares) : null}::text[], favorite_dolares),
      favorite_currencies = COALESCE(${favorite_currencies ? JSON.stringify(favorite_currencies) : null}::text[], favorite_currencies),
      favorite_cryptos = COALESCE(${favorite_cryptos ? JSON.stringify(favorite_cryptos) : null}::text[], favorite_cryptos),
      favorite_charts = COALESCE(${favorite_charts ? JSON.stringify(favorite_charts) : null}::text[], favorite_charts),
      updated_at = NOW()
    WHERE user_id = ${userId}
    RETURNING *
  `;

  return result.rows[0] as UserPreferences;
}

// ============================================================================
// LEAD QUERIES
// ============================================================================

/**
 * Create a new lead
 *
 * @param email - Lead email
 * @param source - Where the lead came from
 * @param name - Optional lead name
 * @returns Created lead
 */
export async function createLead(email: string, source: string, name?: string): Promise<Lead> {
  const result = await sql`
    INSERT INTO leads (email, name, source)
    VALUES (${email}, ${name || null}, ${source})
    RETURNING *
  `;

  return result.rows[0] as Lead;
}

/**
 * Find lead by email
 *
 * @param email - Lead email
 * @returns Lead or null if not found
 */
export async function findLeadByEmail(email: string): Promise<Lead | null> {
  const result = await sql`
    SELECT *
    FROM leads
    WHERE email = ${email}
    LIMIT 1
  `;

  return (result.rows[0] as Lead) || null;
}

/**
 * Update lead status
 *
 * @param id - Lead ID
 * @param status - New status
 */
export async function updateLeadStatus(
  id: string,
  status: 'pending' | 'contacted' | 'converted'
): Promise<void> {
  await sql`
    UPDATE leads
    SET status = ${status}
    WHERE id = ${id}
  `;
}

/**
 * Get all leads (with optional filtering)
 *
 * @param status - Optional status filter
 * @param limit - Maximum number of results
 * @returns Array of leads
 */
export async function getLeads(
  status?: 'pending' | 'contacted' | 'converted',
  limit: number = 100
): Promise<Lead[]> {
  if (status) {
    const result = await sql`
      SELECT *
      FROM leads
      WHERE status = ${status}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return result.rows as Lead[];
  }

  const result = await sql`
    SELECT *
    FROM leads
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return result.rows as Lead[];
}

// ============================================================================
// USER ALERTS QUERIES
// ============================================================================

/**
 * Get user alerts
 *
 * @param userId - User ID
 * @returns Array of user alerts
 */
export async function getUserAlerts(userId: string): Promise<UserAlert[]> {
  const result = await sql`
    SELECT *
    FROM user_alerts
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;

  return result.rows as UserAlert[];
}

/**
 * Create user alert
 *
 * @param userId - User ID
 * @param alert - Alert data
 * @returns Created alert
 */
export async function createUserAlert(
  userId: string,
  alert: {
    tipo: string;
    nombre: string;
    condicion: string;
    valorObjetivo: number;
    casaDolar?: string;
    mensaje?: string;
  }
): Promise<UserAlert> {
  const metadata = alert.casaDolar ? { casaDolar: alert.casaDolar } : {};

  const result = await sql`
    INSERT INTO user_alerts (
      user_id,
      tipo,
      nombre,
      condicion,
      valor_objetivo,
      metadata,
      mensaje
    )
    VALUES (
      ${userId},
      ${alert.tipo},
      ${alert.nombre},
      ${alert.condicion},
      ${alert.valorObjetivo},
      ${JSON.stringify(metadata)}::jsonb,
      ${alert.mensaje || null}
    )
    RETURNING *
  `;

  return result.rows[0] as UserAlert;
}

/**
 * Update user alert
 *
 * @param alertId - Alert ID
 * @param userId - User ID (for security)
 * @param updates - Fields to update
 * @returns Updated alert
 */
export async function updateUserAlert(
  alertId: string,
  userId: string,
  updates: {
    estado?: string;
    notificacionEnviada?: boolean;
    fechaDisparada?: string;
    fechaUltimaVerificacion?: string;
  }
): Promise<UserAlert> {
  const result = await sql`
    UPDATE user_alerts
    SET
      estado = COALESCE(${updates.estado || null}, estado),
      notificacion_enviada = COALESCE(${updates.notificacionEnviada ?? null}, notificacion_enviada),
      fecha_disparada = COALESCE(${updates.fechaDisparada || null}::timestamp, fecha_disparada),
      fecha_ultima_verificacion = COALESCE(${updates.fechaUltimaVerificacion || null}::timestamp, fecha_ultima_verificacion),
      updated_at = NOW()
    WHERE id = ${alertId} AND user_id = ${userId}
    RETURNING *
  `;

  return result.rows[0] as UserAlert;
}

/**
 * Delete user alert
 *
 * @param alertId - Alert ID
 * @param userId - User ID (for security)
 */
export async function deleteUserAlert(alertId: string, userId: string): Promise<void> {
  await sql`
    DELETE FROM user_alerts
    WHERE id = ${alertId} AND user_id = ${userId}
  `;
}

/**
 * Delete all user alerts
 *
 * @param userId - User ID
 */
export async function deleteAllUserAlerts(userId: string): Promise<void> {
  await sql`
    DELETE FROM user_alerts
    WHERE user_id = ${userId}
  `;
}

/**
 * Get all users with active alerts
 *
 * @returns Array of users who have active alerts
 */
export async function getUsersWithActiveAlerts(): Promise<
  Array<{ user_id: string; email: string; name: string | null }>
> {
  const result = await sql`
    SELECT DISTINCT u.id as user_id, u.email, u.name
    FROM users u
    INNER JOIN user_alerts a ON u.id = a.user_id
    WHERE a.estado = 'activa'
  `;

  return result.rows as Array<{ user_id: string; email: string; name: string | null }>;
}
