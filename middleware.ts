import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/auth/setup'];

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('js-playground-session');
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect to auth setup if no session
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/auth/setup', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|chess-pieces).*)',
  ],
};
