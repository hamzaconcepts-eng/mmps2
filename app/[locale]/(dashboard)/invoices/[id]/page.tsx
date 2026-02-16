import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Receipt, CreditCard, User, FileText } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency, formatStudentName, formatDate, formatClassName } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();
  const isAr = locale === 'ar';

  // All queries in parallel
  const [invoiceRes, itemsRes, paymentsRes] = await Promise.all([
    supabase
      .from('invoices')
      .select('*, students(id, student_id, first_name, first_name_ar, father_name, father_name_ar, family_name, family_name_ar, classes(id, name, name_ar, grade_level))')
      .eq('id', id)
      .single(),
    supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', id)
      .order('created_at'),
    supabase
      .from('payments')
      .select('*')
      .eq('invoice_id', id)
      .order('payment_date', { ascending: false }),
  ]);

  const invoice = invoiceRes.data;
  if (!invoice) notFound();

  const lineItems = itemsRes.data || [];
  const payments = paymentsRes.data || [];

  const dueAmount = invoice.total_amount - invoice.paid_amount;
  const statusVariant =
    invoice.status === 'paid' ? 'success' :
    invoice.status === 'overdue' ? 'danger' :
    invoice.status === 'cancelled' ? 'dark' : 'warning';

  return (
    <div className="max-w-[1000px]">
      <PageHeader
        title={`${t('finance.invoice')} ${invoice.invoice_number}`}
        subtitle={`${t('class.academicYear')} ${invoice.academic_year}`}
        actions={
          <Link href={`/${locale}/invoices`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        {/* Invoice Summary */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Receipt size={15} className="text-brand-teal" />
              <Card.Title>{t('finance.invoiceDetails')}</Card.Title>
            </div>
          </Card.Header>
          <div className="space-y-2.5">
            <InfoRow label={t('finance.invoiceNumber')} value={invoice.invoice_number} />
            <InfoRow label={t('common.status')}>
              <Badge variant={statusVariant as any}>{t(`finance.${invoice.status}`)}</Badge>
            </InfoRow>
            <InfoRow label={t('finance.totalAmount')} value={formatCurrency(invoice.total_amount)} />
            <InfoRow label={t('finance.paidAmount')}>
              <span className="text-[12px] font-semibold text-success">{formatCurrency(invoice.paid_amount)}</span>
            </InfoRow>
            <InfoRow label={t('finance.dueAmount')}>
              <span className={`text-[12px] font-semibold ${dueAmount > 0 ? 'text-brand-orange' : 'text-text-tertiary'}`}>
                {formatCurrency(dueAmount)}
              </span>
            </InfoRow>
            <InfoRow label={t('finance.dueDate')} value={formatDate(invoice.due_date, locale)} />
            {invoice.term && <InfoRow label={t('exams.term')} value={invoice.term} />}
          </div>
        </Card>

        {/* Student Info */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-accent-orange" />
              <Card.Title>{t('student.name')}</Card.Title>
            </div>
          </Card.Header>
          {invoice.students ? (
            <div className="space-y-2.5">
              <InfoRow label={t('student.fullName')} value={formatStudentName(invoice.students, locale)} />
              <InfoRow label={t('student.studentId')} value={invoice.students.student_id} />
              {invoice.students.classes && (
                <InfoRow label={t('student.class')} value={formatClassName(invoice.students.classes, locale)} />
              )}
              <div className="pt-2 flex gap-2">
                <Link href={`/${locale}/students/${invoice.students.id}`}>
                  <Button variant="glass" size="sm">{t('student.studentDetails')}</Button>
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
          )}
        </Card>
      </div>

      {/* Line Items */}
      <Card className="mb-3">
        <Card.Header>
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-brand-teal" />
            <Card.Title>{t('finance.lineItems')}</Card.Title>
          </div>
        </Card.Header>
        {lineItems.length > 0 ? (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>#</Table.Head>
                <Table.Head>{t('common.details')}</Table.Head>
                <Table.Head>{t('finance.totalAmount')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {lineItems.map((item: any, idx: number) => (
                <Table.Row key={item.id}>
                  <Table.Cell className="text-text-tertiary text-[11px]">{idx + 1}</Table.Cell>
                  <Table.Cell className="text-white font-semibold text-[12px]">
                    {isAr ? item.description_ar || item.description : item.description}
                  </Table.Cell>
                  <Table.Cell className="text-white font-semibold text-[12px]">{formatCurrency(item.amount)}</Table.Cell>
                </Table.Row>
              ))}
              <Table.Row>
                <Table.Cell>{' '}</Table.Cell>
                <Table.Cell className="text-white font-bold text-[12px]">{t('common.total')}</Table.Cell>
                <Table.Cell className="text-white font-bold text-[12px]">{formatCurrency(invoice.total_amount)}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        ) : (
          <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
        )}
      </Card>

      {/* Payments */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <CreditCard size={15} className="text-success" />
            <Card.Title>{t('finance.allPayments')} ({payments.length})</Card.Title>
          </div>
        </Card.Header>
        {payments.length > 0 ? (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>{t('finance.paymentNumber')}</Table.Head>
                <Table.Head>{t('finance.totalAmount')}</Table.Head>
                <Table.Head>{t('finance.paymentDate')}</Table.Head>
                <Table.Head>{t('finance.paymentMethod')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {payments.map((p: any) => (
                <Table.Row key={p.id}>
                  <Table.Cell className="font-mono text-[11px] text-brand-teal">{p.payment_number}</Table.Cell>
                  <Table.Cell className="text-success font-semibold text-[12px]">{formatCurrency(p.amount)}</Table.Cell>
                  <Table.Cell className="text-text-secondary text-[11px]">{formatDate(p.payment_date, locale)}</Table.Cell>
                  <Table.Cell>
                    <Badge variant="brand">
                      {t(`finance.${p.payment_method}`) || p.payment_method}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
        )}
      </Card>
    </div>
  );
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] text-text-tertiary font-medium">{label}</span>
      {children || <span className="text-[12px] text-white font-semibold">{value || '—'}</span>}
    </div>
  );
}
