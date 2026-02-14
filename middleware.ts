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

export async function middleware(request: NextRequest) {
  // First, handle authentication
  const authResponse = await updateSession(request);

  // If auth middleware redirected, return that response
  if (authResponse.status === 307 || authResponse.status === 308) {
    return authResponse;
  }

  // Then handle i18n
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};
