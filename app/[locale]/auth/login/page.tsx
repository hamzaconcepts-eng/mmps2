'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { usernameToEmail } from '@/lib/auth/helpers';
import { User, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return <LoginPageClient locale={locale} />;
}

function LoginPageClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convert username to email format for Supabase
      const email = usernameToEmail(username);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-dream-pink rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-drift-slow" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-dream-lavender rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-drift-slower" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-dream-sky rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-drift" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-sky/30 blur-2xl rounded-full" />
              <Image
                src="/logo.svg"
                alt="Mashaail Logo"
                width={120}
                height={120}
                className="relative drop-shadow-2xl"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-black text-brand-deep mb-2" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {locale === 'ar' ? 'مدرسة مشاعل' : 'Mashaail School'}
          </h1>
          <p className="text-gray-600 font-medium">
            {t('auth.signIn')}
          </p>
        </div>

        {/* Login Form */}
        <div className="glass p-8 rounded-3xl border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                {t('auth.username')}
              </label>
              <div className="relative">
                <User size={20} className="absolute top-1/2 -translate-y-1/2 text-gray-400"
                      style={{ [locale === 'ar' ? 'right' : 'left']: '1rem' }} />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full bg-white/50 border border-gray-200 rounded-2xl py-3
                            ${locale === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'}
                            focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent
                            transition-all duration-200`}
                  placeholder={t('auth.username')}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock size={20} className="absolute top-1/2 -translate-y-1/2 text-gray-400"
                      style={{ [locale === 'ar' ? 'right' : 'left']: '1rem' }} />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-white/50 border border-gray-200 rounded-2xl py-3
                            ${locale === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'}
                            focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent
                            transition-all duration-200`}
                  placeholder={t('auth.password')}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href={`/${locale}/auth/forgot-password`}
                className="text-sm font-medium text-brand-sky hover:text-brand-deep transition-colors"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-deep to-brand-sky text-white
                       py-3 rounded-2xl font-bold text-lg
                       hover:shadow-xl hover:scale-105 active:scale-95
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>{t('common.loading')}</span>
                </>
              ) : (
                t('auth.signIn')
              )}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href={`/${locale}`}
            className="text-sm font-medium text-gray-600 hover:text-brand-deep transition-colors"
          >
            ← {locale === 'ar' ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </main>
  );
}
