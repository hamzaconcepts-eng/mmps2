import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales } from './i18n';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'ar',
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  // Auth check (skips network call when no auth cookie present)
  const authResponse = await updateSession(request);
  if (authResponse.status === 307 || authResponse.status === 308) {
    return authResponse;
  }

  // Then handle i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*']
};
