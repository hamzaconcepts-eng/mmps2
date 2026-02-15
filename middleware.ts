import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales } from './i18n';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'ar',

  // Always use a locale prefix
  localePrefix: 'always'
});

// Public pages that don't need an auth DB call
const PUBLIC_PATHS = ['/', '/auth/'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip the Supabase auth round-trip for public pages (landing, login)
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.endsWith(p) || pathname.includes('/auth/')
  );

  if (!isPublic) {
    // Only check auth for protected routes
    const authResponse = await updateSession(request);
    if (authResponse.status === 307 || authResponse.status === 308) {
      return authResponse;
    }
  }

  // Then handle i18n
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};
