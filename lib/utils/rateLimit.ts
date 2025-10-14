/**
 * Simple in-memory rate limiter using Map
 * For production, consider using Redis or Upstash
 */

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per interval
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const cache = new Map<string, RateLimitRecord>();

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the requester (IP, user ID, etc.)
 * @param options - Rate limit configuration
 * @returns Object with success status and retry information
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const record = cache.get(identifier);

  // Clean up expired entries periodically
  if (cache.size > 1000) {
    for (const [key, value] of cache.entries()) {
      if (value.resetTime < now) {
        cache.delete(key);
      }
    }
  }

  // No record or expired record - create new one
  if (!record || record.resetTime < now) {
    const resetTime = now + options.interval;
    cache.set(identifier, {
      count: 1,
      resetTime,
    });

    return {
      success: true,
      limit: options.maxRequests,
      remaining: options.maxRequests - 1,
      reset: resetTime,
    };
  }

  // Check if limit exceeded
  if (record.count >= options.maxRequests) {
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  cache.set(identifier, record);

  return {
    success: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - record.count,
    reset: record.resetTime,
  };
}

/**
 * Rate limiter for Next.js API routes
 *
 * @example
 * ```typescript
 * import { rateLimitMiddleware } from '@/lib/utils/rateLimit';
 *
 * export default async function handler(req, res) {
 *   const rateLimitResult = await rateLimitMiddleware(req, res, {
 *     interval: 60 * 1000, // 1 minute
 *     maxRequests: 10,
 *   });
 *
 *   if (!rateLimitResult.success) {
 *     return; // Response already sent
 *   }
 *
 *   // Your API logic here
 * }
 * ```
 */
export async function rateLimitMiddleware(
  req: any,
  res: any,
  options: RateLimitOptions
): Promise<{ success: boolean }> {
  // Get identifier (IP address or forwarded IP)
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;

  const identifier = ip || 'anonymous';
  const result = checkRateLimit(identifier, options);

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', result.limit.toString());
  res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
  res.setHeader('X-RateLimit-Reset', new Date(result.reset).toISOString());

  if (!result.success) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    });
    return { success: false };
  }

  return { success: true };
}

/**
 * Create a rate limiter instance
 * Useful for API routes that need custom limits
 */
export function createRateLimiter(options: RateLimitOptions) {
  return {
    check: (identifier: string) => checkRateLimit(identifier, options),
    middleware: (req: any, res: any) => rateLimitMiddleware(req, res, options),
  };
}

// Pre-configured rate limiters for common use cases
export const rateLimiters = {
  // Strict: for sensitive operations (auth, payments, etc.)
  strict: createRateLimiter({
    interval: 60 * 1000, // 1 minute
    maxRequests: 5,
  }),

  // Standard: for regular API calls
  standard: createRateLimiter({
    interval: 60 * 1000, // 1 minute
    maxRequests: 30,
  }),

  // Generous: for read-only operations
  generous: createRateLimiter({
    interval: 60 * 1000, // 1 minute
    maxRequests: 100,
  }),
};
