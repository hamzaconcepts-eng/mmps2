import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Receipt } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { getInvoiceStats } from '@/lib/supabase/cached-queries';
import { formatCurrency, formatStudentName, formatDate } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import Pagination from '@/components/Pagination';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const PER_PAGE = 20;

export default async function InvoicesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

  const statusFilter = sp?.status || '';
  const page = Math.max(1, Number(sp?.page || 1));
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  // Stats from cache (instant); paginated list is fresh
  const { totalInvoiced, totalCollected, outstanding, overdueCount } = await getInvoiceStats();

  // Paginated query — always fresh for correct pagination
  let query = supabase
    .from('invoices')
    .select('*, students(first_name, first_name_ar, father_name, father_name_ar, family_name, family_name_ar, student_id, classes(name, name_ar))', { count: 'exact' })
    .eq('academic_year', '2025-2026')
    .order('invoice_number', { ascending: false })
    .range(from, to);

  if (statusFilter) query = query.eq('status', statusFilter);

  const { data: invoices, count } = await query;
  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / PER_PAGE);

  const statusVariant = (s: string) =>
    s === 'paid' ? 'success' : s === 'overdue' ? 'danger' : s === 'cancelled' ? 'dark' : 'warning';

  return (
    <div className="max-w-[1200px]">
      <PageHeader title={t('finance.allInvoices')} subtitle={`${t('class.academicYear')} 2025-2026`} />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard icon={<DollarSign size={18} className="text-text-dark" />} value={formatCurrency(totalInvoiced)} label={t('finance.totalInvoiced')} colorScheme="teal" />
        <StatCard icon={<CheckCircle size={18} className="text-text-dark" />} value={formatCurrency(totalCollected)} label={t('finance.totalCollected')} colorScheme="ice" />
        <StatCard icon={<TrendingUp size={18} className="text-white" />} value={formatCurrency(outstanding)} label={t('finance.outstanding')} colorScheme="orange" />
        <StatCard icon={<AlertTriangle size={18} className="text-text-dark" />} value={overdueCount.toString()} label={t('finance.overdue')} colorScheme="light" />
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-3">
        {['', 'pending', 'paid', 'overdue', 'cancelled'].map((s) => (
          <Link
            key={s}
            href={`/${locale}/invoices${s ? `?status=${s}` : ''}`}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all
              ${statusFilter === s
                ? 'bg-accent-orange/85 text-white shadow-[0_2px_12px_rgba(240,144,33,0.25)]'
                : 'glass text-text-secondary hover:text-white hover:bg-white/[0.1]'}`}
          >
            {s ? t(`finance.${s}`) : t('common.all')}
          </Link>
        ))}
      </div>

      <Card>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>{t('finance.invoiceNumber')}</Table.Head>
              <Table.Head>{t('student.name')}</Table.Head>
              <Table.Head>{t('student.class')}</Table.Head>
              <Table.Head>{t('finance.totalAmount')}</Table.Head>
              <Table.Head>{t('finance.paidAmount')}</Table.Head>
              <Table.Head>{t('finance.dueAmount')}</Table.Head>
              <Table.Head>{t('finance.status')}</Table.Head>
              <Table.Head>{t('finance.dueDate')}</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(invoices || []).map((inv: any) => {
              const due = inv.total_amount - inv.paid_amount;
              return (
                <Table.Row key={inv.id}>
                  <Table.Cell>
                    <Link href={`/${locale}/invoices/${inv.id}`} className="font-mono text-[11px] text-brand-teal hover:text-brand-teal-soft transition-colors">
                      {inv.invoice_number}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-white text-[11px]">
                    {inv.students ? formatStudentName(inv.students, locale) : '—'}
                  </Table.Cell>
                  <Table.Cell className="text-text-secondary text-[11px]">
                    {inv.students?.classes ? (locale === 'ar' ? inv.students.classes.name_ar : inv.students.classes.name) : '—'}
                  </Table.Cell>
                  <Table.Cell className="text-white font-semibold text-[11px]">{formatCurrency(inv.total_amount)}</Table.Cell>
                  <Table.Cell className="text-success text-[11px]">{formatCurrency(inv.paid_amount)}</Table.Cell>
                  <Table.Cell className={`text-[11px] ${due > 0 ? 'text-brand-orange font-semibold' : 'text-text-tertiary'}`}>
                    {formatCurrency(due)}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={statusVariant(inv.status) as any}>{t(`finance.${inv.status}`)}</Badge>
                  </Table.Cell>
                  <Table.Cell className="text-text-secondary text-[11px]">{formatDate(inv.due_date, locale)}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>

        <div className="flex items-center justify-between px-2 pt-3 border-t border-white/[0.06]">
          <p className="text-[11px] text-text-tertiary">
            {t('common.showing')} {from + 1}-{Math.min(to + 1, totalCount)} {t('common.of')} {totalCount}
          </p>
          <Pagination currentPage={page} totalPages={totalPages} basePath={`/${locale}/invoices${statusFilter ? `?status=${statusFilter}` : ''}`} locale={locale} />
        </div>
      </Card>
    </div>
  );
}
