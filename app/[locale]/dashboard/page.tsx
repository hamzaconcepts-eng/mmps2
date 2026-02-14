import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Users, GraduationCap, DollarSign, TrendingUp, Calendar, BookOpen, AlertCircle } from 'lucide-react';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const stats = [
    { key: 'students', icon: Users, value: '1,234', label: t('navigation.students'), change: '+12%', gradient: 'from-brand-teal to-brand-teal-light' },
    { key: 'teachers', icon: GraduationCap, value: '89', label: t('navigation.teachers'), change: '+5%', gradient: 'from-brand-cyan to-brand-ice-light' },
    { key: 'revenue', icon: DollarSign, value: 'OMR 125K', label: t('navigation.finance'), change: '+18%', gradient: 'from-brand-orange to-brand-orange-soft' },
    { key: 'attendance', icon: TrendingUp, value: '94.5%', label: t('navigation.attendance'), change: '+2.3%', gradient: 'from-brand-deep-teal to-brand-cyan' },
  ];

  const recentActivity = [
    { type: 'success', message: 'New student enrolled: Ahmed Al-Balushi', time: '10 mins ago' },
    { type: 'warning', message: 'Payment pending: Invoice #2891', time: '25 mins ago' },
    { type: 'success', message: 'Class schedule updated: Grade 10-A', time: '1 hour ago' },
    { type: 'info', message: 'New announcement published', time: '2 hours ago' },
    { type: 'success', message: 'Exam results published: Grade 9', time: '3 hours ago' },
  ];

  const upcomingEvents = [
    { title: 'Parent-Teacher Meeting', date: 'Tomorrow, 10:00 AM', class: 'All Grades' },
    { title: 'Math Exam', date: 'Feb 18, 2026', class: 'Grade 11' },
    { title: 'Sports Day', date: 'Feb 20, 2026', class: 'All Grades' },
    { title: 'Science Fair', date: 'Feb 22, 2026', class: 'Grades 8-12' },
  ];

  const quickStats = [
    { label: 'Classes Today', value: '42' },
    { label: 'Present', value: '1,145' },
    { label: 'Absent', value: '89' },
    { label: 'Pending Fees', value: 'OMR 45K' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col gap-3">
      {/* Header */}
      <div className="glass p-3 rounded-2xl border border-white/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-brand-deep">{t('common.dashboard')}</h1>
            <p className="text-xs text-gray-600">{t('common.welcome')}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-brand-deep">Saturday, Feb 15, 2026</p>
            <p className="text-xs text-gray-600">Academic Year 2025-2026</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.key} className="glass p-3 rounded-2xl border border-white/20 hover:scale-105 transition-transform">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.change}</span>
              </div>
              <h3 className="text-xl font-bold text-brand-deep">{stat.value}</h3>
              <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Recent Activity */}
        <div className="col-span-5 glass p-3 rounded-2xl border border-white/20 overflow-hidden flex flex-col">
          <h2 className="text-sm font-bold text-brand-deep mb-2 flex items-center gap-2">
            <AlertCircle size={16} />
            Recent Activity
          </h2>
          <div className="space-y-2 overflow-y-auto flex-1 scrollbar-thin pr-1">
            {recentActivity.map((activity, i) => (
              <div key={i} className="p-2 rounded-xl bg-white/40 hover:bg-white/60 transition-colors border border-white/10 flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' : activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 line-clamp-1">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-span-3 glass p-3 rounded-2xl border border-white/20">
          <h2 className="text-sm font-bold text-brand-deep mb-2">Quick Stats</h2>
          <div className="space-y-2">
            {quickStats.map((stat, i) => (
              <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-white/40">
                <span className="text-xs font-medium text-gray-700">{stat.label}</span>
                <span className="text-sm font-bold text-brand-deep">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="col-span-4 glass p-3 rounded-2xl border border-white/20 overflow-hidden flex flex-col">
          <h2 className="text-sm font-bold text-brand-deep mb-2 flex items-center gap-2">
            <Calendar size={16} />
            Upcoming Events
          </h2>
          <div className="space-y-2 overflow-y-auto flex-1 scrollbar-thin pr-1">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="p-2 rounded-xl bg-white/40 hover:bg-white/60 transition-colors border border-white/10">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-orange-soft flex items-center justify-center flex-shrink-0 shadow-md">
                    <BookOpen size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-brand-deep">{event.title}</h3>
                    <p className="text-xs text-gray-600">{event.date}</p>
                    <p className="text-xs text-gray-500">{event.class}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
