import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, School } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatSubjectName, formatGradeLevel } from '@/lib/utils/format';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import EntityActions from '@/components/EntityActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { deleteSubject } from './actions';

export default async function SubjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const { locale, id } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();
  const isAr = locale === 'ar';
  const isPrint = sp?.print === '1';

  const [subjectRes, gradeLevelsRes] = await Promise.all([
    supabase.from('subjects').select('*').eq('id', id).single(),
    supabase.from('grade_subjects').select('*').eq('subject_id', id).eq('is_active', true).order('grade_level'),
  ]);

  const subject = subjectRes.data;
  if (!subject) notFound();

  const gradeLevels = gradeLevelsRes.data || [];

  const printDate = new Date().toLocaleDateString(isAr ? 'ar-OM' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-[1000px]">
      {isPrint && <AutoPrint />}

      {/* Print-only header */}
      <div className="print-header hidden print:flex items-center gap-3 pb-2 mb-3 border-b border-gray-300">
        <Image src="/logo.svg" alt="" width={40} height={40} className="print-logo" />
        <div className="flex-1">
          <p className="print-school-name font-bold text-[14px] text-black leading-tight">
            {t('common.schoolName')}
          </p>
          <p className="print-date text-[9px] text-gray-500">{printDate}</p>
        </div>
      </div>

      {/* Print-only banner */}
      <div className="print-student-banner hidden print:flex items-center gap-4 py-4 mb-4 border-b border-gray-200">
        <div>
          <h2 className="print-student-name text-[16px] font-extrabold text-black leading-tight">
            {formatSubjectName(subject, locale)}
          </h2>
          <p className="text-[9px] text-gray-500 mt-1">
            {t('subject.subjectCode')}: {subject.code} · {subject.is_activity ? t('subject.activity') : t('subject.academic')}
          </p>
        </div>
      </div>

      <div className="print:hidden">
        <PageHeader
          title={formatSubjectName(subject, locale)}
          subtitle={`${t('subject.subjectCode')}: ${subject.code}`}
          actions={
            <div className="flex items-center gap-2">
              <EntityActions
                entityId={id}
                editHref={`/${locale}/subjects/${id}/edit`}
                deleteAction={deleteSubject}
                redirectHref={`/${locale}/subjects`}
                labels={{
                  edit: t('subject.editSubject'),
                  delete: t('subject.deleteSubject'),
                  confirmTitle: t('common.confirmDelete'),
                  confirmMessage: t('common.confirmDeleteMessage'),
                  cancel: t('common.cancel'),
                  deleting: t('subject.deleting'),
                }}
              />
              <PrintButton label={t('common.print')} />
              <Link href={`/${locale}/subjects`}>
                <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
                  {t('common.back')}
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Subject Info */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-brand-teal" />
              <Card.Title>{t('subject.subjectDetails')}</Card.Title>
            </div>
          </Card.Header>
          <div className="space-y-2.5">
            <InfoRow label={t('subject.subjectCode')} value={subject.code} />
            <InfoRow label={t('subject.subjectName')} value={formatSubjectName(subject, locale)} />
            <InfoRow label={t('subject.subjectType')}>
              <Badge variant={subject.is_activity ? 'orange' : 'teal'}>
                {subject.is_activity ? t('subject.activity') : t('subject.academic')}
              </Badge>
            </InfoRow>
            {subject.description && (
              <InfoRow label={t('subject.description')} value={subject.description} />
            )}
            <InfoRow label={t('common.status')}>
              <Badge variant={subject.is_active ? 'success' : 'dark'}>
                {subject.is_active ? t('student.active') : t('student.inactive')}
              </Badge>
            </InfoRow>
          </div>
        </Card>

        {/* Grade Levels */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <School size={15} className="text-accent-orange" />
              <Card.Title>{t('subject.gradeLevels')}</Card.Title>
            </div>
          </Card.Header>
          {gradeLevels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {gradeLevels.map((gl: any) => (
                <div key={gl.id} className="glass rounded-lg px-3 py-2 text-center">
                  <p className="text-[12px] font-bold text-text-primary">{formatGradeLevel(gl.grade_level, locale)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-text-tertiary font-medium">{label}:</span>
      {children || <span className="text-[12px] text-text-primary font-semibold">{value || '—'}</span>}
    </div>
  );
}
