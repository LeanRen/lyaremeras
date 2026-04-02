import { NextResponse } from 'next/server';

export function middleware(request) {
  // Leemos la cookie de sesión que pondremos en el Login
  const isLogged = request.cookies.get('isLogged')?.value;
  const { pathname } = request.nextUrl;

  // Si intenta entrar al admin sin la cookie, al login
  if (pathname.startsWith('/admin') && isLogged !== 'true') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};