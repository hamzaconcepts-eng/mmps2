'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';

export default function SignOutButton({ locale }: { locale: string }) {
  const t = useTranslations();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}/auth/login`);
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full
                 transition-all duration-300 hover:bg-red-50 text-red-600
                 hover:text-red-700 font-medium"
    >
      <LogOut size={20} />
      <span>{t('auth.signOut')}</span>
    </button>
  );
}
