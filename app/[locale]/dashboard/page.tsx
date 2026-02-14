import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Users, GraduationCap, DollarSign, TrendingUp, Calendar, Bell, Plus } from 'lucide-react';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const isRTL = locale === 'ar';

  const stats = [
    { key: 'students', icon: Users, value: '1,240', label: t('navigation.students'), change: '+12', gradient: 'from-teal-700 to-teal-500' },
    { key: 'teachers', icon: GraduationCap, value: '86', label: t('navigation.teachers'), change: '+5', gradient: 'from-teal-400 to-teal-300' },
    { key: 'revenue', icon: DollarSign, value: 'OMR 125K', label: t('navigation.finance'), change: '+18%', gradient: 'from-orange-500 to-orange-400' },
    { key: 'attendance', icon: TrendingUp, value: '94.2%', label: t('navigation.attendance'), change: '+2.3%', gradient: 'from-teal-600 to-teal-400' },
  ];

  const recentActivity = [
    { type: 'success', title: 'New Student Enrolled', desc: 'Ahmed Al-Balushi - Grade 5-A', time: '10m ago' },
    { type: 'warning', title: 'Payment Pending', desc: 'Invoice #2891 - Sara Khalid', time: '25m ago' },
    { type: 'info', title: 'Class Updated', desc: 'Grade 10-A schedule modified', time: '1h ago' },
    { type: 'success', title: 'Announcement', desc: 'Parent-teacher meeting tomorrow', time: '2h ago' },
    { type: 'success', title: 'Exam Results', desc: 'Grade 9 Math results published', time: '3h ago' },
  ];

  const attendance = [
    { student: 'Ahmed Ali', grade: '5-A', status: 'present' },
    { student: 'Sara Khalid', grade: '3-B', status: 'present' },
    { student: 'Omar Salim', grade: '5-A', status: 'late' },
    { student: 'Fatima Nasser', grade: '4-C', status: 'absent' },
    { student: 'Yousuf Said', grade: '6-A', status: 'present' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] overflow-auto bg-gray-50">
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-800">{t('common.dashboard')}</h1>
            <p className="text-sm text-gray-500 mt-1">Saturday, Feb 15, 2026 · Academic Year 2025-2026</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-semibold hover:bg-teal-600 transition-colors">
              <Plus size={16} />
              <span>Quick Action</span>
            </button>
            <button className="relative p-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.key} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-dark-800 mb-0.5">{stat.value}</h3>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Today's Attendance */}
          <div className="col-span-5 bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-dark-800">Today's Attendance</h2>
              <button className="text-xs font-semibold text-teal-600 hover:text-teal-700">/attendance/daily</button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 pb-2 border-b border-gray-100">
                <div className="col-span-5 text-xs font-bold text-gray-400 uppercase tracking-wide">Student</div>
                <div className="col-span-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Grade</div>
                <div className="col-span-4 text-xs font-bold text-gray-400 uppercase tracking-wide">Status</div>
              </div>
              {attendance.map((record, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 py-2 border-b border-gray-50 last:border-0">
                  <div className="col-span-5 text-sm text-dark-800">{record.student}</div>
                  <div className="col-span-3 text-sm text-gray-600">{record.grade}</div>
                  <div className="col-span-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      record.status === 'present' ? 'bg-green-50 text-green-700' :
                      record.status === 'late' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-4 bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-bold text-dark-800 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark-800">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.desc}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="col-span-3 bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-sm font-bold text-dark-800 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Classes Today</span>
                <span className="text-lg font-bold text-dark-800">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Present</span>
                <span className="text-lg font-bold text-teal-600">1,145</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Absent</span>
                <span className="text-lg font-bold text-orange-600">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Fees</span>
                <span className="text-lg font-bold text-dark-800">OMR 45K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
