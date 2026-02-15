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
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg w-full
                 transition-all duration-200 text-red-400/80
                 hover:bg-red-500/10 hover:text-red-400 font-semibold text-[12px]"
    >
      <LogOut size={15} />
      <span>{t('auth.signOut')}</span>
    </button>
  );
}
