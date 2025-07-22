import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/login', '/register', '/api', '/test-mapping'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Durante desarrollo, permitir acceso a rutas de researcher sin verificación estricta
  if (process.env.NODE_ENV === 'development' && pathname.startsWith('/dashboard/researcher')) {
    return NextResponse.next();
  }

  // Verificar si hay token de autenticación
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Si no hay token y no es una ruta pública, redirigir a login
  if (!token && !pathname.startsWith('/api')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rutas restringidas por rol
  const adminRoutes = ['/dashboard/admin', '/researchers', '/admin'];
  const researcherRoutes = ['/dashboard/researcher'];
  const directorRoutes = ['/dashboard/director'];
  const studentRoutes = ['/dashboard/student'];
  const institutionRoutes = ['/dashboard/institution'];
  const guestRoutes = ['/dashboard/guest'];

  // Verificar acceso a rutas específicas por rol
  if (token) {
    try {
      // Decodificar el token JWT para obtener el rol
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const userRole = payload.role?.toLowerCase();

      // Verificar acceso a rutas de admin
      if (adminRoutes.some(route => pathname.startsWith(route))) {
        if (userRole !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      // Verificar acceso a rutas de researcher
      if (researcherRoutes.some(route => pathname.startsWith(route))) {
        if (userRole !== 'researcher' && userRole !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      // Verificar acceso a rutas de director
      if (directorRoutes.some(route => pathname.startsWith(route))) {
        if (userRole !== 'director' && userRole !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      // Verificar acceso a rutas de student
      if (studentRoutes.some(route => pathname.startsWith(route))) {
        if (userRole !== 'student' && userRole !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      // Verificar acceso a rutas de institution
      if (institutionRoutes.some(route => pathname.startsWith(route))) {
        if (userRole !== 'institution' && userRole !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

      // Verificar acceso a rutas de guest
      if (guestRoutes.some(route => pathname.startsWith(route))) {
        if (userRole !== 'guest' && userRole !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      }

    } catch (error) {
      // Si hay error al decodificar el token, redirigir a login
      console.error('Error decoding token:', error);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 