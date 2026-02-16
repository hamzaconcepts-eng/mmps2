import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Users, GraduationCap, DollarSign, TrendingUp, Bell, Plus, Bus, School, Receipt, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getDashboardStats, getRecentStudents } from '@/lib/supabase/cached-queries';
import { formatCurrency, formatStudentName } from '@/lib/utils/format';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const [stats, recentStudents] = await Promise.all([
    getDashboardStats(),
    getRecentStudents(),
  ]);

  const statCards = [
    { key: 'students', icon: <Users size={18} className="text-text-dark" />, value: stats.studentCount.toLocaleString(), label: t('navigation.students'), colorScheme: 'teal' as const },
    { key: 'teachers', icon: <GraduationCap size={18} className="text-text-dark" />, value: stats.teacherCount.toString(), label: t('navigation.teachers'), colorScheme: 'ice' as const },
    { key: 'revenue', icon: <DollarSign size={18} className="text-white" />, value: formatCurrency(stats.totalRevenue), label: t('dashboard.totalRevenue'), colorScheme: 'orange' as const },
    { key: 'collection', icon: <TrendingUp size={18} className="text-text-dark" />, value: `${stats.collectionRate}%`, label: t('dashboard.collectionRate'), colorScheme: 'light' as const },
  ];

  // Calculate percentages for visual bars
  const malePercent = stats.studentCount > 0 ? Math.round((stats.maleCount / stats.studentCount) * 100) : 0;
  const femalePercent = 100 - malePercent;
  const collectionPercent = parseFloat(stats.collectionRate) || 0;
  const transportPercent = stats.studentCount > 0 ? Math.round((stats.transportCount / stats.studentCount) * 100) : 0;

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

        {/* Fee Collection Progress */}
        <div className="col-span-8">
          <Card>
            <Card.Header>
              <Card.Title>{locale === 'ar' ? 'ملخص الرسوم المالية' : 'Fee Collection Summary'}</Card.Title>
            </Card.Header>
            <div className="space-y-4">
              {/* Collection Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] text-text-secondary font-medium">{t('dashboard.collectionRate')}</span>
                  <span className="text-[13px] font-black text-success">{stats.collectionRate}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-teal to-success rounded-full transition-all" style={{ width: `${collectionPercent}%` }} />
                </div>
              </div>

              {/* Finance breakdown */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-success-soft border border-success/10">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={13} className="text-success" />
                    <span className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">{locale === 'ar' ? 'المحصل' : 'Collected'}</span>
                  </div>
                  <p className="text-[15px] font-black text-success">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{stats.paidCount} {locale === 'ar' ? 'فاتورة مدفوعة' : 'invoices paid'}</p>
                </div>
                <div className="p-3 rounded-lg bg-warning-soft border border-warning/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={13} className="text-warning" />
                    <span className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">{t('finance.pending')}</span>
                  </div>
                  <p className="text-[15px] font-black text-warning">{formatCurrency(stats.totalPending)}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{stats.pendingCount} {locale === 'ar' ? 'فاتورة معلقة' : 'invoices pending'}</p>
                </div>
                <div className="p-3 rounded-lg bg-danger-soft border border-danger/10">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={13} className="text-danger" />
                    <span className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">{t('finance.overdue')}</span>
                  </div>
                  <p className="text-[15px] font-black text-danger">{formatCurrency(stats.totalInvoiced - stats.totalRevenue - stats.totalPending)}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{stats.overdueCount} {locale === 'ar' ? 'فاتورة متأخرة' : 'invoices overdue'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* School At-a-Glance */}
        <div className="col-span-4">
          <Card>
            <Card.Header>
              <Card.Title>{locale === 'ar' ? 'نظرة عامة' : 'At a Glance'}</Card.Title>
            </Card.Header>
            <div className="space-y-3">
              {/* Gender Distribution */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">{locale === 'ar' ? 'توزيع الطلاب' : 'Student Distribution'}</span>
                </div>
                <div className="flex gap-1 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-brand-teal rounded-l-full" style={{ width: `${malePercent}%` }} />
                  <div className="bg-brand-ice rounded-r-full" style={{ width: `${femalePercent}%` }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-text-tertiary">
                    <span className="inline-block w-2 h-2 rounded-full bg-brand-teal mr-1 align-middle" />
                    {locale === 'ar' ? 'ذكور' : 'Male'} {stats.maleCount} ({malePercent}%)
                  </span>
                  <span className="text-[10px] text-text-tertiary">
                    <span className="inline-block w-2 h-2 rounded-full bg-brand-ice mr-1 align-middle" />
                    {locale === 'ar' ? 'إناث' : 'Female'} {stats.femaleCount} ({femalePercent}%)
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2.5">
                {[
                  { icon: <School size={14} className="text-accent-orange" />, label: t('navigation.classes'), value: stats.classCount.toString() },
                  { icon: <Bus size={14} className="text-brand-teal" />, label: locale === 'ar' ? 'طلاب النقل' : 'Transport Students', value: `${stats.transportCount} (${transportPercent}%)` },
                  { icon: <Receipt size={14} className="text-warning" />, label: t('dashboard.totalInvoiced'), value: formatCurrency(stats.totalInvoiced) },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-[11px] text-text-secondary font-medium">{item.label}</span>
                    </div>
                    <span className="text-[12px] font-bold text-text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Students */}
        <div className="col-span-7">
          <Card>
            <Card.Header>
              <Card.Title>{t('dashboard.recentStudents')}</Card.Title>
              <Link href={`/${locale}/students`} className="text-[10px] font-bold text-brand-teal hover:text-brand-teal-soft transition-colors">
                {t('common.viewAll')}
              </Link>
            </Card.Header>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>{t('student.studentId')}</Table.Head>
                  <Table.Head>{t('student.fullName')}</Table.Head>
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

        {/* Invoice Status Breakdown */}
        <div className="col-span-5">
          <Card>
            <Card.Header>
              <Card.Title>{locale === 'ar' ? 'حالة الفواتير' : 'Invoice Status'}</Card.Title>
              <Link href={`/${locale}/invoices`} className="text-[10px] font-bold text-brand-teal hover:text-brand-teal-soft transition-colors">
                {t('common.viewAll')}
              </Link>
            </Card.Header>
            <div className="space-y-3">
              {[
                { label: locale === 'ar' ? 'مدفوعة' : 'Paid', count: stats.paidCount, color: 'bg-success', textColor: 'text-success' },
                { label: t('finance.pending'), count: stats.pendingCount, color: 'bg-warning', textColor: 'text-warning' },
                { label: t('finance.overdue'), count: stats.overdueCount, color: 'bg-danger', textColor: 'text-danger' },
              ].map((item, i) => {
                const total = stats.paidCount + stats.pendingCount + stats.overdueCount;
                const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] text-text-secondary font-medium">{item.label}</span>
                      <span className={`text-[12px] font-bold ${item.textColor}`}>{item.count}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
