import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'konnect_super_secret_jwt_key_2026_default'
);

const COOKIE_NAME = 'konnect_admin_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

    if (!sessionToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
      
      const role = payload.role as string;
      if ((pathname.startsWith('/admin/users') || pathname === '/admin/settings') && role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      return NextResponse.next();
    } catch (err) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // If logged in and visiting /admin/login, redirect to /admin/dashboard
  if (pathname === '/admin/login') {
    const sessionToken = request.cookies.get(COOKIE_NAME)?.value;
    if (sessionToken) {
      try {
        await jwtVerify(sessionToken, JWT_SECRET);
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } catch (err) {
        // Invalid token, allow access to login page
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
