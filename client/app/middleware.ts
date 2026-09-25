import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register']

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/committee-dashboard',
  '/admin',
  '/students',
  '/teachers',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the auth token from cookies
  const authToken = request.cookies.get('auth_token')
  const isAuthenticated = !!authToken

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // If trying to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated and trying to access login/register, redirect to appropriate dashboard
  if (isAuthenticated && isPublicRoute) {
    // We'll handle role-based redirects client-side since we can't read user role from cookie here
    const dashboardUrl = new URL('/committee-dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
