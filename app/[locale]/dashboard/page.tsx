import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Users, GraduationCap, DollarSign, TrendingUp } from 'lucide-react';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  const stats = [
    {
      key: 'students',
      icon: Users,
      value: '1,234',
      label: t('navigation.students'),
      color: 'from-dream-pink to-dream-lavender',
      change: '+12%',
    },
    {
      key: 'teachers',
      icon: GraduationCap,
      value: '89',
      label: t('navigation.teachers'),
      color: 'from-dream-lavender to-dream-sky',
      change: '+5%',
    },
    {
      key: 'revenue',
      icon: DollarSign,
      value: 'OMR 125K',
      label: t('navigation.finance'),
      color: 'from-dream-sky to-dream-mint',
      change: '+18%',
    },
    {
      key: 'attendance',
      icon: TrendingUp,
      value: '94.5%',
      label: t('navigation.attendance'),
      color: 'from-dream-peach to-dream-yellow',
      change: '+2.3%',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass p-8 rounded-3xl border border-white/20">
        <h1 className="text-4xl font-black text-brand-deep mb-2">
          {t('common.dashboard')}
        </h1>
        <p className="text-gray-600 text-lg">
          {t('common.welcome')} 👋
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              className="glass p-6 rounded-3xl border border-white/20
                         hover:scale-105 transition-all duration-300
                         hover:shadow-xl group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color}
                               flex items-center justify-center
                               group-hover:scale-110 transition-transform duration-300
                               shadow-lg`}>
                  <Icon size={28} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-black text-brand-deep mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 font-medium">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass p-8 rounded-3xl border border-white/20">
          <h2 className="text-2xl font-bold text-brand-deep mb-6">
            {t('navigation.announcements')}
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/30 hover:bg-white/50
                           transition-colors cursor-pointer border border-white/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-brand-deep">
                    Sample Announcement {i}
                  </h3>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <p className="text-sm text-gray-600">
                  This is a sample announcement description...
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass p-8 rounded-3xl border border-white/20">
          <h2 className="text-2xl font-bold text-brand-deep mb-6">
            {t('navigation.reports')}
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/30">
              <span className="font-medium text-gray-700">Today's Attendance</span>
              <span className="font-bold text-brand-deep">92%</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/30">
              <span className="font-medium text-gray-700">Pending Invoices</span>
              <span className="font-bold text-brand-deep">23</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/30">
              <span className="font-medium text-gray-700">Unread Messages</span>
              <span className="font-bold text-brand-deep">7</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/30">
              <span className="font-medium text-gray-700">Active Classes</span>
              <span className="font-bold text-brand-deep">42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
