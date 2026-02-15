import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Users, GraduationCap, DollarSign, TrendingUp, Bell, Plus } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency, formatStudentName } from '@/lib/utils/format';

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  // Parallel queries for real data
  const [
    studentsRes,
    teachersRes,
    invoicesRes,
    recentStudentsRes,
    classesRes,
  ] = await Promise.all([
    supabase.from('students').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('invoices').select('total_amount, paid_amount, status').eq('academic_year', '2025-2026'),
    supabase.from('students').select('first_name, first_name_ar, father_name, father_name_ar, family_name, family_name_ar, student_id, created_at, classes(name, name_ar)').eq('is_active', true).order('created_at', { ascending: false }).limit(5),
    supabase.from('classes').select('id', { count: 'exact', head: true }).eq('academic_year', '2025-2026').eq('is_active', true),
  ]);

  // Calculate revenue and pending fees
  const totalRevenue = invoicesRes.data?.reduce((sum, inv) => sum + (inv.paid_amount || 0), 0) || 0;
  const totalPending = invoicesRes.data
    ?.filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + ((inv.total_amount || 0) - (inv.paid_amount || 0)), 0) || 0;
  const totalInvoiced = invoicesRes.data?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
  const collectionRate = totalInvoiced > 0 ? ((totalRevenue / totalInvoiced) * 100).toFixed(1) : '0';

  const studentCount = studentsRes.count || 0;
  const teacherCount = teachersRes.count || 0;
  const classCount = classesRes.count || 0;

  const stats = [
    { key: 'students', icon: <Users size={18} className="text-text-dark" />, value: studentCount.toLocaleString(), label: t('navigation.students'), colorScheme: 'teal' as const },
    { key: 'teachers', icon: <GraduationCap size={18} className="text-text-dark" />, value: teacherCount.toString(), label: t('navigation.teachers'), colorScheme: 'ice' as const },
    { key: 'revenue', icon: <DollarSign size={18} className="text-white" />, value: formatCurrency(totalRevenue), label: t('navigation.finance'), colorScheme: 'orange' as const },
    { key: 'attendance', icon: <TrendingUp size={18} className="text-text-dark" />, value: `${collectionRate}%`, label: t('dashboard.collectionRate'), colorScheme: 'light' as const },
  ];

  const recentStudents = recentStudentsRes.data || [];

  const pendingCount = invoicesRes.data?.filter(inv => inv.status === 'pending').length || 0;
  const overdueCount = invoicesRes.data?.filter(inv => inv.status === 'overdue').length || 0;

  return (
    <div className="max-w-[1200px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-white">{t('dashboard.title')}</h1>
          <p className="text-[11px] text-text-tertiary mt-0.5 font-medium">
            {t('dashboard.academicYear')} 2025-2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="accent" size="sm" icon={<Plus size={14} />}>
            {t('dashboard.quickAction')}
          </Button>
          <button className="relative p-2 glass rounded-lg hover:bg-white/[0.14] transition-all">
            <Bell size={15} className="text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-orange rounded-full" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            colorScheme={stat.colorScheme}
          />
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
                    <Table.Cell className="font-semibold text-white">
                      {formatStudentName(student, locale)}
                    </Table.Cell>
                    <Table.Cell className="text-text-secondary">
                      {student.classes ? (locale === 'ar' ? student.classes.name_ar : student.classes.name) : '—'}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card>
        </div>

        {/* Activity Summary */}
        <div className="col-span-4">
          <Card>
            <Card.Header>
              <Card.Title>{t('dashboard.systemOverview')}</Card.Title>
            </Card.Header>
            <div className="space-y-3">
              <div className="flex gap-2.5 pb-3 border-b border-white/[0.06]">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-success" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-white">{t('navigation.students')}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{studentCount} {t('common.active')}</p>
                </div>
              </div>
              <div className="flex gap-2.5 pb-3 border-b border-white/[0.06]">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-brand-teal" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-white">{t('navigation.teachers')}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{teacherCount} {t('common.active')}</p>
                </div>
              </div>
              <div className="flex gap-2.5 pb-3 border-b border-white/[0.06]">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-warning" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-white">{t('finance.pending')}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{pendingCount} {t('navigation.invoices')}</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-danger" />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-white">{t('finance.overdue')}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{overdueCount} {t('navigation.invoices')}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="col-span-3">
          <Card>
            <Card.Header>
              <Card.Title>{t('dashboard.quickStats')}</Card.Title>
            </Card.Header>
            <div className="space-y-3">
              {[
                { label: t('navigation.classes'), value: classCount.toString(), color: 'text-accent-orange' },
                { label: t('dashboard.totalRevenue'), value: formatCurrency(totalRevenue), color: 'text-success' },
                { label: t('dashboard.pendingFees'), value: formatCurrency(totalPending), color: 'text-brand-orange' },
                { label: t('dashboard.totalInvoiced'), value: formatCurrency(totalInvoiced), color: 'text-brand-teal' },
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
