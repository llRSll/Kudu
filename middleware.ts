import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of routes that do not require authentication
const PUBLIC_PATHS = ['/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('sb-access-token')?.value;
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If token and trying to access login, redirect to dashboard
  if (token && pathname === '/login') {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Otherwise, allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect all routes except login
    '/((?!_next|api|static|favicon.ico|login).*)',
    '/login',
  ],
};
