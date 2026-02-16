'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { User, Lock, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { login } from './actions';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRTL = locale === 'ar';

  const handleSubmit = async (formData: FormData) => {
    setError('');
    setLoading(true);
    try {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    } catch (err: any) {
      setError(err.message || t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center overflow-hidden relative">

      <div className="w-full max-w-sm px-6 relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Image src="/logo.svg" alt="Mashaail" width={72} height={72} priority className="relative" />
            </div>
          </div>
          <h1 className="text-xl font-black text-text-primary mb-1" dir={isRTL ? 'rtl' : 'ltr'}>
            {t('common.schoolName')}
          </h1>
          <p className="text-xs text-text-secondary">{t('auth.signIn')}</p>
        </div>

        {/* Form Card — glassmorphism */}
        <div className="glass-strong rounded-xl p-6">
          {/* Language toggle — opposite corner from inputs */}
          <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} mb-4`}>
            <LanguageSwitcher />
          </div>

          <form action={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            <input type="hidden" name="locale" value={locale} />

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-text-secondary mb-1.5">
                {t('auth.username')}
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute top-1/2 -translate-y-1/2 text-text-tertiary"
                  style={{ [isRTL ? 'right' : 'left']: '0.5rem' }}
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`w-full glass-input rounded-md
                            py-2.5 text-sm text-white placeholder:text-text-tertiary
                            focus:outline-none
                            transition-all ${isRTL ? 'pr-6 pl-3' : 'pl-6 pr-3'}`}
                  placeholder={t('auth.username')}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-text-secondary mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute top-1/2 -translate-y-1/2 text-text-tertiary"
                  style={{ [isRTL ? 'right' : 'left']: '0.5rem' }}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`w-full glass-input rounded-md
                            py-2.5 text-sm text-white placeholder:text-text-tertiary
                            focus:outline-none
                            transition-all ${isRTL ? 'pr-6 pl-8' : 'pl-6 pr-8'}`}
                  placeholder={t('auth.password')}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 text-text-tertiary hover:text-brand-teal transition-colors"
                  style={{ [isRTL ? 'left' : 'right']: '0.5rem' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md bg-accent-orange text-white font-bold text-sm
                       shadow-[0_4px_20px_rgba(240,144,33,0.35)]
                       hover:shadow-[0_8px_30px_rgba(240,144,33,0.45)]
                       hover:-translate-y-0.5
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                       transition-all duration-300"
            >
              {loading ? t('common.loading') : t('auth.signIn')}
            </button>
          </form>
        </div>

        {/* Back */}
        <div className="text-center mt-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={14} className={isRTL ? 'rotate-180' : ''} />
            {t('common.backToHome')}
          </Link>
        </div>
      </div>
    </main>
  );
}
