import Image from 'next/image';
import { GraduationCap, Users, BookOpen, Calculator } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-orange to-brand-orange-warm rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-transform duration-300 p-4">
                <Image
                  src="/logo.svg"
                  alt="Mashaail School Logo"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Main Title - Arabic */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-brand-deep mb-4 leading-tight tracking-tight"
            dir="rtl"
          >
            مدرسة مشاعل
          </h1>

          {/* Subtitle - Arabic */}
          <p className="text-2xl sm:text-3xl font-bold text-brand-deep-soft mb-6 tracking-tight" dir="rtl">
            مسقط الخاصة
          </p>

          {/* English Title */}
          <h2 className="text-xl sm:text-2xl font-semibold text-brand-sky mb-3 tracking-wide">
            Mashaail Muscat Private School
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed font-medium">
            نظام إدارة مدرسية متكامل وحديث
          </p>
          <p className="text-sm sm:text-base text-text-tertiary mt-1 font-medium">
            Modern & Comprehensive School Management System
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Students Card */}
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-dream-sky to-dream-mint rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-brand-deep" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-brand-deep mb-2" dir="rtl">إدارة الطلاب</h3>
            <p className="text-sm text-text-secondary font-medium">Students Management</p>
          </div>

          {/* Teachers Card */}
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-dream-lavender to-dream-pink rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-brand-deep" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-brand-deep mb-2" dir="rtl">إدارة المعلمين</h3>
            <p className="text-sm text-text-secondary font-medium">Teachers Management</p>
          </div>

          {/* Academics Card */}
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-dream-peach to-dream-yellow rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-brand-deep" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-brand-deep mb-2" dir="rtl">الشؤون الأكاديمية</h3>
            <p className="text-sm text-text-secondary font-medium">Academic Affairs</p>
          </div>

          {/* Finance Card */}
          <div className="glass rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-dream-mint to-dream-sky rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calculator className="w-6 h-6 text-brand-deep" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-brand-deep mb-2" dir="rtl">إدارة الحسابات</h3>
            <p className="text-sm text-text-secondary font-medium">Finance Management</p>
          </div>
        </div>

        {/* Tech Stack & CTA */}
        <div className="text-center">
          {/* Tech Badges */}
          <div className="flex gap-3 justify-center flex-wrap mb-8">
            <span className="px-5 py-2.5 glass rounded-full text-sm font-bold text-brand-deep hover:scale-105 transition-transform">
              Next.js 15
            </span>
            <span className="px-5 py-2.5 glass rounded-full text-sm font-bold text-brand-deep hover:scale-105 transition-transform">
              Supabase
            </span>
            <span className="px-5 py-2.5 glass rounded-full text-sm font-bold text-brand-deep hover:scale-105 transition-transform">
              TypeScript
            </span>
            <span className="px-5 py-2.5 glass rounded-full text-sm font-bold text-brand-deep hover:scale-105 transition-transform">
              React 19
            </span>
          </div>

          {/* CTA Button */}
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-deep to-brand-sky rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <button className="relative px-10 py-4 bg-gradient-to-r from-brand-deep to-brand-deep-soft text-white font-bold rounded-full shadow-2xl shadow-brand-deep/30 hover:shadow-3xl hover:shadow-brand-deep/40 transform hover:scale-105 transition-all duration-300 text-base">
              <span className="block" dir="rtl">قريباً • Coming Soon</span>
            </button>
          </div>

          {/* Footer Text */}
          <p className="mt-8 text-sm text-text-tertiary font-medium">
            Built with 🔥 by Hamza Concepts Engineering
          </p>
        </div>
      </div>
    </main>
  );
}
