import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Users, GraduationCap, DollarSign, TrendingUp, Bell, Plus } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { getDashboardStats, getRecentStudents } from '@/lib/supabase/cached-queries';
import { formatCurrency, formatStudentName } from '@/lib/utils/format';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // Both calls hit the Data Cache — near-instant on cache hit
  const [stats, recentStudents] = await Promise.all([
    getDashboardStats(),
    getRecentStudents(),
  ]);

  const statCards = [
    { key: 'students', icon: <Users size={18} className="text-text-dark" />, value: stats.studentCount.toLocaleString(), label: t('navigation.students'), colorScheme: 'teal' as const },
    { key: 'teachers', icon: <GraduationCap size={18} className="text-text-dark" />, value: stats.teacherCount.toString(), label: t('navigation.teachers'), colorScheme: 'ice' as const },
    { key: 'revenue', icon: <DollarSign size={18} className="text-white" />, value: formatCurrency(stats.totalRevenue), label: t('navigation.finance'), colorScheme: 'orange' as const },
    { key: 'attendance', icon: <TrendingUp size={18} className="text-text-dark" />, value: `${stats.collectionRate}%`, label: t('dashboard.collectionRate'), colorScheme: 'light' as const },
  ];

  return (
    <div className="max-w-[1200px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-text-primary">{t('dashboard.title')}</h1>
          <p className="text-[11px] text-text-tertiary mt-0.5 font-medium">
            {t('dashboard.academicYear')} 2025-2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="accent" size="sm" icon={<Plus size={14} />}>
            {t('dashboard.quickAction')}
          </Button>
          <button className="relative p-2 glass rounded-lg hover:bg-black/[0.04] transition-all">
            <Bell size={15} className="text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-orange rounded-full" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {statCards.map((stat) => (
          <StatCard key={stat.key} icon={stat.icon} value={stat.value} label={stat.label} colorScheme={stat.colorScheme} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-3">
        {/* Recent Students */}
        <div className="col-span-5">
          <Card>
            <Card.Header>
              <Card.Title>{t('dashboard.recentStudents')}</Card.Title>
              <a href={`/${locale}/students`} className="text-[10px] font-bold text-brand-teal cursor-pointer hover:text-brand-teal-soft transition-colors">
                {t('common.viewAll')}
              </a>
            </Card.Header>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>{t('student.studentId')}</Table.Head>
                  <Table.Head>{t('student.name')}</Table.Head>
                  <Table.Head>{t('student.class')}</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {recentStudents.map((student: any, i: number) => (
                  <Table.Row key={i}>
                    <Table.Cell className="text-text-secondary font-mono text-[11px]">{student.student_id}</Table.Cell>
                    <Table.Cell className="font-semibold text-text-primary">{formatStudentName(student, locale)}</Table.Cell>
                    <Table.Cell className="text-text-secondary">
                      {student.classes ? (locale === 'ar' ? student.classes.name_ar : student.classes.name) : '—'}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card>
        </div>

        {/* System Overview */}
        <div className="col-span-4">
          <Card>
            <Card.Header><Card.Title>{t('dashboard.systemOverview')}</Card.Title></Card.Header>
            <div className="space-y-3">
              {[
                { label: t('navigation.students'), sub: `${stats.studentCount} ${t('common.active')}`, color: 'bg-success' },
                { label: t('navigation.teachers'), sub: `${stats.teacherCount} ${t('common.active')}`, color: 'bg-brand-teal' },
                { label: t('finance.pending'), sub: `${stats.pendingCount} ${t('navigation.invoices')}`, color: 'bg-warning' },
                { label: t('finance.overdue'), sub: `${stats.overdueCount} ${t('navigation.invoices')}`, color: 'bg-danger' },
              ].map((item, i, arr) => (
                <div key={i} className={`flex gap-2.5 ${i < arr.length - 1 ? 'pb-3 border-b border-gray-100' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-text-primary">{item.label}</p>
                    <p className="text-[10px] text-text-tertiary mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="col-span-3">
          <Card>
            <Card.Header><Card.Title>{t('dashboard.quickStats')}</Card.Title></Card.Header>
            <div className="space-y-3">
              {[
                { label: t('navigation.classes'), value: stats.classCount.toString(), color: 'text-accent-orange' },
                { label: t('dashboard.totalRevenue'), value: formatCurrency(stats.totalRevenue), color: 'text-success' },
                { label: t('dashboard.pendingFees'), value: formatCurrency(stats.totalPending), color: 'text-brand-orange' },
                { label: t('dashboard.totalInvoiced'), value: formatCurrency(stats.totalInvoiced), color: 'text-brand-teal' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[11px] text-text-secondary font-medium">{item.label}</span>
                  <span className={`text-[13px] font-black ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
