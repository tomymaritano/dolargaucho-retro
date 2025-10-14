/**
 * Cookie Management Utilities
 *
 * Provides secure HTTP-only cookie management for JWT tokens
 * Includes CSRF protection and secure flag for production
 */

import { serialize, parse } from 'cookie';
import type { NextApiResponse } from 'next';

/**
 * Cookie name for authentication token
 */
export const AUTH_COOKIE_NAME = 'dg_auth_token';

/**
 * Cookie options for production security
 */
interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
}

/**
 * Get default cookie options based on environment
 */
function getDefaultCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: isProduction, // HTTPS only in production
    sameSite: 'lax', // CSRF protection
    path: '/', // Available throughout the app
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  };
}

/**
 * Set an authentication cookie in the response
 *
 * @param res - Next.js API response object
 * @param token - JWT token to store in cookie
 * @param options - Optional custom cookie options
 */
export function setAuthCookie(
  res: NextApiResponse,
  token: string,
  options?: Partial<CookieOptions>
): void {
  const cookieOptions = {
    ...getDefaultCookieOptions(),
    ...options,
  };

  const cookie = serialize(AUTH_COOKIE_NAME, token, cookieOptions);

  res.setHeader('Set-Cookie', cookie);
}

/**
 * Remove the authentication cookie from the response
 *
 * @param res - Next.js API response object
 */
export function removeAuthCookie(res: NextApiResponse): void {
  const cookieOptions = {
    ...getDefaultCookieOptions(),
    maxAge: 0, // Expire immediately
  };

  const cookie = serialize(AUTH_COOKIE_NAME, '', cookieOptions);

  res.setHeader('Set-Cookie', cookie);
}

/**
 * Get authentication token from request cookies
 *
 * @param cookieHeader - Cookie header string from request
 * @returns JWT token if found, null otherwise
 */
export function getAuthToken(cookieHeader?: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookies = parse(cookieHeader);
  return cookies[AUTH_COOKIE_NAME] || null;
}

/**
 * Parse all cookies from a cookie header string
 *
 * @param cookieHeader - Cookie header string from request
 * @returns Object with all parsed cookies
 */
export function parseCookies(cookieHeader?: string): Record<string, string | undefined> {
  if (!cookieHeader) {
    return {};
  }

  return parse(cookieHeader);
}

/**
 * Check if an auth cookie exists in the request
 *
 * @param cookieHeader - Cookie header string from request
 * @returns true if auth cookie exists, false otherwise
 */
export function hasAuthCookie(cookieHeader?: string): boolean {
  return getAuthToken(cookieHeader) !== null;
}
