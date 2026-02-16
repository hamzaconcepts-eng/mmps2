import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, Users, Bus, Receipt, Phone, Mail, MapPin } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatStudentName, formatGuardianName, formatGradeLevel, formatCurrency, formatDate, formatClassName, formatPhone } from '@/lib/utils/format';
import { getDefaultStudentPhoto } from '@/lib/utils/student-photo';
import PageHeader from '@/components/PageHeader';
import PhotoZoom from '@/components/PhotoZoom';
import LocationButtons from '@/components/LocationButtons';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const supabase = createAdminClient();

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

  return (
    <div className="max-w-[1000px]">
      <PageHeader
        title={formatStudentName(student, locale)}
        subtitle={`${t('student.studentId')}: ${student.student_id}`}
        actions={
          <Link href={`/${locale}/students`}>
            <Button variant="glass" size="sm" icon={<ArrowLeft size={14} />}>
              {t('common.back')}
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
              <InfoRow label={t('student.enrollmentDate')} value={formatDate(student.enrollment_date, locale)} />
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
                <div className="pt-2">
                  <Link href={`/${locale}/classes/${student.classes.id}`}>
                    <Button variant="glass" size="sm">{t('common.viewAll')} {t('class.classDetails')}</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-text-tertiary">{t('common.noData')}</p>
            )}
          </Card>

          {/* Home Location */}
          {student.gps_location && (
            <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-danger" />
                  <Card.Title>{isAr ? 'موقع المنزل' : 'Home Location'}</Card.Title>
                </div>
              </Card.Header>
              <LocationButtons url={student.gps_location} locale={locale} />
            </Card>
          )}
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
                return (
                  <div key={sg.id} className="space-y-2.5">
                    <InfoRow label={t('student.fullName')} value={formatGuardianName(g, locale)} />
                    <InfoRow label={t('student.relationship')}>
                      <Badge variant="brand">{isAr ? g.relationship_ar || g.relationship : g.relationship}</Badge>
                    </InfoRow>
                    <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                      <Phone size={12} /> {formatPhone(g.phone)}
                    </div>
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
          {transport ? (
            <div className="space-y-2.5">
              <InfoRow label={t('transport.area')} value={isAr ? transport.transport_areas?.name_ar : transport.transport_areas?.name} />
              <InfoRow label={t('transport.busNumber')} value={transport.buses?.bus_number || '—'} />
              <InfoRow label={t('transport.plateNumber')} value={transport.buses?.plate_number || '—'} />
              <InfoRow label={t('transport.driverName')} value={isAr ? transport.buses?.driver_name_ar : transport.buses?.driver_name} />
              <InfoRow label={t('transport.driverPhone')} value={formatPhone(transport.buses?.driver_phone || '')} />
              <InfoRow label={t('transport.annualFee')} value={formatCurrency(transport.transport_areas?.annual_fee || 0)} />
            </div>
          ) : (
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
