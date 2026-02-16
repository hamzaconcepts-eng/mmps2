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

  // Quick cookie check: if no Supabase auth cookie exists at all,
  // the user is definitely not logged in — skip the network call.
  const hasAuthCookie = request.cookies.getAll().some(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  );

  const pathname = request.nextUrl.pathname;
  const locale = pathname.split('/')[1];
  const isValidLocale = ['en', 'ar'].includes(locale);
  const localePath = isValidLocale ? `/${locale}` : '/ar';

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
    '/transport',
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.includes(route)
  );

  // No auth cookie + protected route → redirect immediately, no network call
  if (!hasAuthCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL(`${localePath}/auth/login`, request.url));
  }

  // No auth cookie + public route → no need to verify anything
  if (!hasAuthCookie) {
    return response;
  }

  // Has auth cookie → verify with Supabase (refreshes token if needed)
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

  // Token was invalid/expired → redirect to login
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL(`${localePath}/auth/login`, request.url));
  }

  // Logged-in user trying to access auth pages → redirect to dashboard
  if (user && pathname.includes('/auth/')) {
    return NextResponse.redirect(new URL(`${localePath}/dashboard`, request.url));
  }

  return response;
}
