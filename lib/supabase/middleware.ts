import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Skip auth if Supabase env vars are not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get the pathname from the request
  const pathname = request.nextUrl.pathname;

  // Extract locale from pathname
  const locale = pathname.split('/')[1];
  const isValidLocale = ['en', 'ar'].includes(locale);
  const localePath = isValidLocale ? `/${locale}` : '/ar';

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/students',
    '/teachers',
    '/classes',
    '/subjects',
    '/attendance',
    '/grades',
    '/exams',
    '/timetable',
    '/invoices',
    '/payments',
    '/finance',
    '/messages',
    '/announcements',
    '/reports',
    '/admin',
    '/profile',
  ];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.includes(route)
  );

  // Redirect to login if accessing protected route without auth
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL(`${localePath}/auth/login`, request.url));
  }

  // Redirect to dashboard if logged in user tries to access auth pages
  if (user && pathname.includes('/auth/')) {
    return NextResponse.redirect(new URL(`${localePath}/dashboard`, request.url));
  }

  return response;
}
