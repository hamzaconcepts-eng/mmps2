import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, User, Users, Bus, Receipt, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatStudentName, formatGuardianName, formatDriverName, formatGradeLevel, formatCurrency, formatDate, formatClassName, formatPhone } from '@/lib/utils/format';
import { getDefaultStudentPhoto } from '@/lib/utils/student-photo';
import PageHeader from '@/components/PageHeader';
import PhotoZoom from '@/components/PhotoZoom';
import LocationButtons from '@/components/LocationButtons';
import PrintButton from '@/components/PrintButton';
import AutoPrint from '@/components/AutoPrint';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function StudentDetailPage({
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
  const isPrint = sp?.print === '1';

  // All 4 queries in parallel — no sequential blocking
  const [studentRes, guardianRes, transportRes, invoiceRes] = await Promise.all([
    supabase
      .from('students')
      .select('*, classes(id, name, name_ar, grade_level, section, capacity)')
      .eq('id', id)
      .single(),
    supabase
      .from('student_guardians')
      .select('*, guardians(*)')
      .eq('student_id', id),
    supabase
      .from('student_transport')
      .select('*, buses(bus_number, plate_number, driver_name, driver_name_ar, driver_father_name, driver_father_name_ar, driver_grandfather_name, driver_grandfather_name_ar, driver_family_name, driver_family_name_ar, driver_phone, driver_photo_url, capacity), transport_areas(name, name_ar, annual_fee)')
      .eq('student_id', id)
      .eq('academic_year', '2025-2026')
      .maybeSingle(),
    supabase
      .from('invoices')
      .select('id, invoice_number, total_amount, paid_amount, status, due_date')
      .eq('student_id', id)
      .eq('academic_year', '2025-2026')
      .order('created_at', { ascending: false }),
  ]);

  const student = studentRes.data;
  if (!student) notFound();

  const guardians = guardianRes.data || [];
  const transport = transportRes.data;
  const invoices = invoiceRes.data || [];

  const isAr = locale === 'ar';
  const printDate = new Date().toLocaleDateString(isAr ? 'ar-OM' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="max-w-[1000px]">
      {isPrint && <AutoPrint />}

      {/* Print-only header: school logo + name + date */}
      <div className="print-header hidden print:flex items-center gap-3 pb-2 mb-3 border-b border-gray-300">
        <Image src="/logo.svg" alt="" width={40} height={40} className="print-logo" />
        <div className="flex-1">
          <p className="print-school-name font-bold text-[14px] text-black leading-tight">
            {t('common.schoolName')}
          </p>
          <p className="print-date text-[9px] text-gray-500">{printDate}</p>
        </div>
      </div>

      {/* Print-only student banner: large photo + name + ID */}
      <div className="print-student-banner hidden print:flex items-center gap-4 py-4 mb-4 border-b border-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={student.photo_url || getDefaultStudentPhoto(student.gender, student.classes?.grade_level ?? 0, student.id)}
          alt=""
          className="print-student-photo rounded-lg object-cover"
          width={100}
          height={100}
        />
        <div>
          <h2 className="print-student-name text-[16px] font-extrabold text-black leading-tight">
            {formatStudentName(student, locale)}
          </h2>
          <p className="text-[9px] text-gray-500 mt-1">
            {t('student.studentId')}: {student.student_id}
            {student.national_id && ` · ${t('student.nationalId')}: ${student.national_id}`}
            {` · ${student.is_active ? t('student.active') : t('student.inactive')}`}
          </p>
        </div>
      </div>

      <div className="print:hidden">
        <PageHeader
          title={formatStudentName(student, locale)}
          subtitle={`${t('student.studentId')}: ${student.student_id}`}
          actions={
            <div className="flex items-center gap-2">
              <PrintButton label={t('common.print')} />
              <Link href={`/${locale}/students`}>
                <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
                  {t('common.back')}
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      <div className="student-detail-grid grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Personal Info */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-brand-teal" />
              <Card.Title>{t('student.personalInfo')}</Card.Title>
            </div>
          </Card.Header>
          <div className="flex gap-4">
            {/* Student Photo — clickable zoom (fallback to default by gender/grade) */}
            <PhotoZoom
              src={student.photo_url || getDefaultStudentPhoto(student.gender, student.classes?.grade_level ?? 0, student.id)}
              alt={formatStudentName(student, locale)}
              width={80}
              height={80}
            />
            <div className="flex-1 space-y-2.5">
              <InfoRow label={t('student.firstName')} value={isAr ? student.first_name_ar : student.first_name} />
              <InfoRow label={t('student.fatherName')} value={isAr ? student.father_name_ar : student.father_name} />
              <InfoRow label={t('student.grandfatherName')} value={isAr ? student.grandfather_name_ar : student.grandfather_name} />
              <InfoRow label={t('student.familyName')} value={isAr ? student.family_name_ar : student.family_name} />
              <InfoRow label={t('student.dateOfBirth')} value={formatDate(student.date_of_birth, locale)} />
              <InfoRow label={t('student.gender')}>
                <Badge variant={student.gender === 'male' ? 'teal' : 'ice'}>
                  {student.gender === 'male' ? t('student.male') : t('student.female')}
                </Badge>
              </InfoRow>
              <InfoRow label={t('student.nationality')} value={student.nationality || '—'} />
              <InfoRow label={t('student.nationalId')} value={student.national_id || '—'} />
              <InfoRow label={t('student.enrollmentDate')} value={formatDate(student.enrollment_date, locale)} />
              <InfoRow label={t('common.status')}>
                <Badge variant={student.is_active ? 'success' : 'dark'}>
                  {student.is_active ? t('student.active') : t('student.inactive')}
                </Badge>
              </InfoRow>
              {student.medical_notes && (
                <InfoRow label={t('student.medicalNotes')} value={student.medical_notes} />
              )}
            </div>
          </div>
        </Card>

        {/* Class + Location Info */}
        <div className="space-y-3">
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Users size={15} className="text-accent-orange" />
                <Card.Title>{t('student.class')}</Card.Title>
              </div>
            </Card.Header>
            {student.classes ? (
              <div className="space-y-2.5">
                <InfoRow label={t('class.className')} value={formatClassName(student.classes, locale)} />
                <InfoRow label={t('class.gradeLevel')} value={formatGradeLevel(student.classes.grade_level, locale)} />
                <InfoRow label={t('class.section')} value={student.classes.section} />
                <InfoRow label={t('class.capacity')} value={student.classes.capacity?.toString() || '—'} />
                <div className="pt-2 print:hidden">
                  <Link href={`/${locale}/classes/${student.classes.id}`}>
                    <Button variant="glass" size="sm">{t('common.viewAll')} {t('class.classDetails')}</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
            )}
          </Card>

          {/* Home Location — always shown */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-danger" />
                <Card.Title>{isAr ? 'موقع المنزل' : 'Home Location'}</Card.Title>
              </div>
            </Card.Header>
            {student.gps_location ? (
              <LocationButtons url={student.gps_location} locale={locale} />
            ) : (
              <div className="text-center py-4">
                <Badge variant="dark">{t('student.noLocation')}</Badge>
              </div>
            )}
          </Card>
        </div>

        {/* Guardian Info */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-success" />
              <Card.Title>{t('student.guardianInfo')}</Card.Title>
            </div>
          </Card.Header>
          {guardians.length > 0 ? (
            <div className="space-y-3">
              {guardians.map((sg: any) => {
                const g = sg.guardians;
                if (!g) return null;
                const cleanPhone = formatPhone(g.phone || '');
                return (
                  <div key={sg.id} className="space-y-2.5">
                    <InfoRow label={t('student.fullName')} value={formatGuardianName(g, locale)} />
                    <InfoRow label={t('student.relationship')}>
                      <Badge variant="brand">{isAr ? g.relationship_ar || g.relationship : g.relationship}</Badge>
                    </InfoRow>
                    {g.phone && (
                      <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                        <Phone size={12} />
                        <a href={`tel:+968${cleanPhone}`} className="hover:text-brand-teal transition-colors">
                          {cleanPhone}
                        </a>
                        <a
                          href={`https://wa.me/968${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-all print:hidden"
                          title={t('student.whatsapp')}
                        >
                          <MessageCircle size={11} />
                        </a>
                      </div>
                    )}
                    {g.email && (
                      <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                        <Mail size={12} /> {g.email}
                      </div>
                    )}
                    {g.address && (
                      <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                        <MapPin size={12} /> {g.address}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
          )}
        </Card>

        {/* Transport Info */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Bus size={15} className="text-warning" />
              <Card.Title>{t('student.transportInfo')}</Card.Title>
            </div>
          </Card.Header>
          {transport ? (() => {
            const cleanDriverPhone = formatPhone(transport.buses?.driver_phone || '');
            return (
              <div className="space-y-2.5">
                <InfoRow label={t('transport.area')} value={isAr ? transport.transport_areas?.name_ar : transport.transport_areas?.name} />
                <InfoRow label={t('transport.busNumber')} value={transport.buses?.bus_number || '—'} />
                <InfoRow label={t('transport.plateNumber')} value={transport.buses?.plate_number || '—'} />
                <InfoRow label={t('transport.driverName')} value={transport.buses ? formatDriverName(transport.buses, locale) : '—'} />
                {cleanDriverPhone && cleanDriverPhone !== '—' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-text-tertiary font-medium whitespace-nowrap">{t('transport.driverPhone')}:</span>
                    <div className="flex items-center gap-2 text-[12px] text-text-primary font-semibold">
                      <a href={`tel:+968${cleanDriverPhone}`} className="hover:text-brand-teal transition-colors">
                        {cleanDriverPhone}
                      </a>
                      <a
                        href={`https://wa.me/968${cleanDriverPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-all print:hidden"
                        title={t('student.whatsapp')}
                      >
                        <MessageCircle size={11} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <InfoRow label={t('transport.driverPhone')} value="—" />
                )}
                <InfoRow label={t('transport.annualFee')} value={formatCurrency(transport.transport_areas?.annual_fee || 0)} />
              </div>
            );
          })() : (
            <div className="text-center py-4">
              <Badge variant="dark">{t('student.noTransport')}</Badge>
            </div>
          )}
        </Card>

        {/* Finance Info */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Receipt size={15} className="text-brand-orange" />
                <Card.Title>{t('student.financeInfo')}</Card.Title>
              </div>
            </Card.Header>
            {invoices.length > 0 ? (
              <div className="space-y-2">
                {invoices.map((inv: any) => {
                  const due = inv.total_amount - inv.paid_amount;
                  const statusVariant =
                    inv.status === 'paid' ? 'success' :
                    inv.status === 'overdue' ? 'danger' :
                    inv.status === 'cancelled' ? 'dark' : 'warning';
                  return (
                    <div key={inv.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <Link href={`/${locale}/invoices/${inv.id}`} className="text-[12px] font-bold text-text-primary hover:text-brand-teal transition-colors">
                          {inv.invoice_number}
                        </Link>
                        <p className="text-[10px] text-text-tertiary">{t('finance.dueDate')}: {formatDate(inv.due_date, locale)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[12px] font-bold text-text-primary">{formatCurrency(inv.total_amount)}</p>
                          {due > 0 && <p className="text-[10px] text-brand-orange">{t('finance.dueAmount')}: {formatCurrency(due)}</p>}
                        </div>
                        <Badge variant={statusVariant as any}>
                          {t(`finance.${inv.status}`)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-text-tertiary font-medium whitespace-nowrap">{label}:</span>
      {children || <span className="text-[12px] text-text-primary font-semibold">{value || '—'}</span>}
    </div>
  );
}
