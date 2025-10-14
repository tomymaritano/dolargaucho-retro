import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/auth/jwt-edge';
import { getAuthToken } from './lib/auth/cookies';

/**
 * Middleware - Route Protection
 * Protects dashboard routes from unauthenticated access using JWT
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('[Middleware] Processing request:', pathname);

  // Get JWT token from cookie
  const token = getAuthToken(request.headers.get('cookie') || '');
  console.log('[Middleware] Token present:', !!token);
  if (token) {
    console.log('[Middleware] Token value (first 20 chars):', token.substring(0, 20) + '...');
  }

  // Verify token (using Edge Runtime compatible jose library)
  let isAuthenticated = false;
  if (token) {
    const payload = await verifyTokenEdge(token);
    isAuthenticated = payload !== null;
    console.log('[Middleware] Authenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.error('[Middleware] Token verification failed - token exists but is invalid');
    } else {
      console.log('[Middleware] Token verified successfully, user:', payload?.email);
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      console.log('[Middleware] Redirecting unauthenticated user to login');
      // Redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    console.log('[Middleware] Authenticated user accessing dashboard');
  }

  // Redirect logged-in users away from auth pages
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    console.log('[Middleware] Redirecting authenticated user away from auth pages');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/data (Next.js data fetching - prevents redirect loops)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|_next/data|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|api).*)',
  ],
};
