import { Flame } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="glass glass-strong rounded-xl p-12 max-w-2xl text-center space-y-6 transition-all hover:scale-105">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-orange-warm to-brand-orange rounded-2xl flex items-center justify-center shadow-lg shadow-brand-orange/30">
            <Flame className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-brand-deep" dir="rtl">
          مدرسة مشاعل مسقط الخاصة
        </h1>

        <h2 className="text-2xl font-bold text-brand-deep-soft">
          Mashaail Muscat Private School
        </h2>

        <p className="text-text-secondary text-base">
          نظام إدارة مدرسية متكامل • School Management System
        </p>

        <div className="flex gap-3 justify-center flex-wrap pt-4">
          <span className="px-4 py-2 bg-dream-sky/50 rounded-full text-xs font-bold text-brand-deep">
            Next.js 15
          </span>
          <span className="px-4 py-2 bg-dream-peach/50 rounded-full text-xs font-bold text-brand-deep">
            Supabase
          </span>
          <span className="px-4 py-2 bg-dream-lavender/50 rounded-full text-xs font-bold text-brand-deep">
            TypeScript
          </span>
          <span className="px-4 py-2 bg-dream-mint/50 rounded-full text-xs font-bold text-brand-deep">
            Tailwind CSS
          </span>
        </div>

        <div className="pt-6 space-y-2">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-brand-deep to-brand-deep-soft text-white font-bold rounded-full shadow-lg shadow-brand-deep/20 hover:shadow-xl hover:shadow-brand-deep/30 transition-all cursor-pointer">
            قريباً • Coming Soon
          </div>
        </div>
      </div>
    </main>
  );
}
