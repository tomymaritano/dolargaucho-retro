/**
 * Rate Limiting Middleware
 *
 * Protects against brute force attacks by limiting request frequency
 * Uses in-memory store for simplicity (use Redis/Vercel KV in production)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory store for rate limiting
 * In production, use Redis or Vercel KV for distributed systems
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limit configuration per endpoint
 */
export const RATE_LIMITS = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  register: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  forgotPassword: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  resetPassword: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const;

/**
 * Clean up expired entries (run periodically)
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Get client identifier (IP address)
 * Falls back to a default if IP is not available
 */
export function getClientIdentifier(req: any): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded[0];
  }

  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return typeof realIp === 'string' ? realIp : realIp[0];
  }

  // Fallback to socket IP
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Check if request is rate limited
 *
 * @param identifier - Client identifier (usually IP address)
 * @param endpoint - Endpoint being accessed
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  endpoint: keyof typeof RATE_LIMITS
): RateLimitResult {
  const config = RATE_LIMITS[endpoint];
  const key = `${endpoint}:${identifier}`;
  const now = Date.now();

  // Get or create entry
  let entry = rateLimitStore.get(key);

  // Create new entry if doesn't exist or has expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > config.maxAttempts) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000); // seconds

    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }

  return {
    success: true,
    remaining: config.maxAttempts - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Reset rate limit for a specific identifier and endpoint
 * Useful after successful authentication to clear failed attempts
 */
export function resetRateLimit(identifier: string, endpoint: keyof typeof RATE_LIMITS): void {
  const key = `${endpoint}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Rate limit middleware for Next.js API routes
 *
 * Usage:
 * ```typescript
 * export default async function handler(req, res) {
 *   const rateLimitResult = await rateLimitMiddleware(req, 'login');
 *   if (!rateLimitResult.success) {
 *     return res.status(429).json({
 *       success: false,
 *       error: 'Demasiados intentos. Por favor intenta de nuevo más tarde.',
 *       retryAfter: rateLimitResult.retryAfter,
 *     });
 *   }
 *
 *   // Continue with request...
 * }
 * ```
 */
export async function rateLimitMiddleware(
  req: any,
  endpoint: keyof typeof RATE_LIMITS
): Promise<RateLimitResult> {
  const identifier = getClientIdentifier(req);
  return checkRateLimit(identifier, endpoint);
}
