'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, User, GraduationCap, MapPin, Users, Bus, Fingerprint } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createStudent } from '../actions';

interface StudentCreateFormProps {
  classes: any[];
  buses: any[];
  locale: string;
  labels: Record<string, string>;
}

export default function StudentCreateForm({
  classes,
  buses,
  locale,
  labels,
}: StudentCreateFormProps) {
  const router = useRouter();
  const isAr = locale === 'ar';
  const today = new Date().toISOString().split('T')[0];

  // Student fields
  const [student, setStudent] = useState({
    first_name: '',
    father_name: '',
    grandfather_name: '',
    family_name: '',
    first_name_ar: '',
    father_name_ar: '',
    grandfather_name_ar: '',
    family_name_ar: '',
    date_of_birth: '',
    gender: 'male',
    nationality: '',
    national_id: '',
    class_id: '',
    enrollment_date: today,
    is_active: true,
    gps_location: '',
  });

  // Guardian fields
  const [guardian, setGuardian] = useState({
    first_name: '',
    first_name_ar: '',
    father_name: '',
    father_name_ar: '',
    family_name: '',
    family_name_ar: '',
    relationship: '',
    relationship_ar: '',
    phone: '',
    email: '',
  });

  // Transport (optional)
  const [busId, setBusId] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleStudent = (field: string, value: string | boolean) => {
    setStudent((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleGuardian = (field: string, value: string) => {
    setGuardian((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  // When relationship changes, also set the Arabic equivalent
  const handleRelationship = (value: string) => {
    const arMap: Record<string, string> = {
      Father: 'أب',
      Mother: 'أم',
      Guardian: 'ولي أمر',
    };
    setGuardian((prev) => ({
      ...prev,
      relationship: value,
      relationship_ar: arMap[value] || value,
    }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Find the bus's transport_area_id
    const selectedBus = busId ? buses.find((b: any) => b.id === busId) : null;

    const result = await createStudent({
      student: {
        ...student,
        nationality: student.nationality || null,
        national_id: student.national_id || null,
        class_id: student.class_id || null,
        gps_location: student.gps_location || null,
      },
      guardian: {
        ...guardian,
        email: guardian.email || null,
      },
      transport: selectedBus
        ? { bus_id: selectedBus.id, transport_area_id: selectedBus.transport_area_id }
        : null,
    });

    if (result.success) {
      setMessage({ type: 'success', text: labels.createSuccess });
      setTimeout(() => {
        router.push(`/${locale}/students/${result.studentId}`);
        router.refresh();
      }, 800);
    } else {
      setMessage({ type: 'error', text: result.error || labels.createFailed });
      setLoading(false);
    }
  };

  const formatClassName = (cls: any) => {
    if (isAr) return `${cls.name_ar} - ${cls.section}`;
    return `${cls.name} - ${cls.section}`;
  };

  const formatBusLabel = (bus: any) => {
    const area = isAr ? bus.transport_areas?.name_ar : bus.transport_areas?.name;
    return `${bus.bus_number} — ${area || ''}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Status message */}
      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Required field note */}
      <p className="text-xs text-text-tertiary">
        <span className="text-danger">*</span> {labels.requiredField}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── Row 1: English Names (left) + Arabic Names (right) ── */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-brand-teal" />
              <div>
                <Card.Title>{labels.englishNames}</Card.Title>
                <p className="text-[10px] text-text-tertiary mt-0.5">{isAr ? 'بالإنجليزية' : 'As in passport'}</p>
              </div>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label={labels.firstName} value={student.first_name} onChange={(e) => handleStudent('first_name', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.fatherName} value={student.father_name} onChange={(e) => handleStudent('father_name', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.grandfatherName} value={student.grandfather_name} onChange={(e) => handleStudent('grandfather_name', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.familyName} value={student.family_name} onChange={(e) => handleStudent('family_name', e.target.value)} required disabled={loading} locale={locale} />
          </div>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-accent-orange" />
              <div>
                <div className="flex items-center gap-1.5">
                  <Card.Title>{labels.arabicNames}</Card.Title>
                  <span className="text-[10px] font-bold text-accent-orange bg-accent-orange/10 px-1.5 py-0.5 rounded">ع</span>
                </div>
                <p className="text-[10px] text-text-tertiary mt-0.5">{isAr ? 'كما في البطاقة المدنية' : 'As in civil ID'}</p>
              </div>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label={labels.firstNameAr} value={student.first_name_ar} onChange={(e) => handleStudent('first_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
            <Input label={labels.fatherNameAr} value={student.father_name_ar} onChange={(e) => handleStudent('father_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
            <Input label={labels.grandfatherNameAr} value={student.grandfather_name_ar} onChange={(e) => handleStudent('grandfather_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
            <Input label={labels.familyNameAr} value={student.family_name_ar} onChange={(e) => handleStudent('family_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
          </div>
        </Card>

        {/* ── Row 2: Personal Info — full width, 4-col grid ── */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Fingerprint size={15} className="text-success" />
                <div>
                  <Card.Title>{labels.personalInfo}</Card.Title>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{isAr ? 'المعلومات الشخصية الأساسية' : 'Identity & demographic details'}</p>
                </div>
              </div>
            </Card.Header>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Input label={labels.dateOfBirth} type="date" value={student.date_of_birth} onChange={(e) => handleStudent('date_of_birth', e.target.value)} required disabled={loading} locale={locale} />
              <Select label={labels.gender} value={student.gender} onChange={(e) => handleStudent('gender', e.target.value)} required disabled={loading} locale={locale}>
                <option value="male">{labels.male}</option>
                <option value="female">{labels.female}</option>
              </Select>
              <Input label={labels.nationality} value={student.nationality} onChange={(e) => handleStudent('nationality', e.target.value)} required disabled={loading} locale={locale} />
              <Input label={labels.nationalId} value={student.national_id} onChange={(e) => handleStudent('national_id', e.target.value)} required disabled={loading} locale={locale} />
            </div>
          </Card>
        </div>

        {/* ── Row 3: Guardian Info — full width, 3-col grid ── */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Users size={15} className="text-brand-teal" />
                <div>
                  <Card.Title>{labels.guardianInfo}</Card.Title>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{isAr ? 'ولي الأمر المسؤول عن الطالب' : 'Parent or legal guardian details'}</p>
                </div>
              </div>
            </Card.Header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Input label={labels.guardianFirstName} value={guardian.first_name} onChange={(e) => handleGuardian('first_name', e.target.value)} required disabled={loading} locale={locale} />
              <Input label={labels.guardianFatherName} value={guardian.father_name} onChange={(e) => handleGuardian('father_name', e.target.value)} disabled={loading} locale={locale} />
              <Input label={labels.guardianFamilyName} value={guardian.family_name} onChange={(e) => handleGuardian('family_name', e.target.value)} required disabled={loading} locale={locale} />
              <Input label={labels.guardianFirstNameAr} value={guardian.first_name_ar} onChange={(e) => handleGuardian('first_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
              <Input label={labels.guardianFatherNameAr} value={guardian.father_name_ar} onChange={(e) => handleGuardian('father_name_ar', e.target.value)} disabled={loading} locale={locale} dir="rtl" />
              <Input label={labels.guardianFamilyNameAr} value={guardian.family_name_ar} onChange={(e) => handleGuardian('family_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
              <Select label={labels.relationship} value={guardian.relationship} onChange={(e) => handleRelationship(e.target.value)} required disabled={loading} locale={locale}>
                <option value="">{labels.selectRelationship}</option>
                <option value="Father">{labels.father}</option>
                <option value="Mother">{labels.mother}</option>
                <option value="Guardian">{labels.guardianRelative}</option>
              </Select>
              <Input label={labels.guardianPhone} value={guardian.phone} onChange={(e) => handleGuardian('phone', e.target.value)} required disabled={loading} locale={locale} placeholder="91234567" />
              <Input label={labels.guardianEmail} value={guardian.email} onChange={(e) => handleGuardian('email', e.target.value)} disabled={loading} locale={locale} type="email" />
            </div>
          </Card>
        </div>

        {/* ── Row 4: Academic Info (left) + Transport & Location (right) ── */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-warning" />
              <div>
                <Card.Title>{labels.academicInfo}</Card.Title>
                <p className="text-[10px] text-text-tertiary mt-0.5">{isAr ? 'الفصل وتاريخ القبول' : 'Class & enrollment date'}</p>
              </div>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select label={labels.class} value={student.class_id} onChange={(e) => handleStudent('class_id', e.target.value)} required disabled={loading} locale={locale}>
              <option value="">—</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {formatClassName(cls)}
                </option>
              ))}
            </Select>
            <Input label={labels.enrollmentDate} type="date" value={student.enrollment_date} onChange={(e) => handleStudent('enrollment_date', e.target.value)} required disabled={loading} locale={locale} />
          </div>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Bus size={15} className="text-warning" />
              <div>
                <div className="flex items-center gap-2">
                  <Card.Title>{labels.transportSection}</Card.Title>
                  <span className="text-[9px] font-semibold text-text-tertiary bg-surface-secondary px-1.5 py-0.5 rounded-full border border-border">
                    {isAr ? 'اختياري' : 'Optional'}
                  </span>
                </div>
                <p className="text-[10px] text-text-tertiary mt-0.5">{isAr ? 'الحافلة والموقع الجغرافي' : 'Bus assignment & GPS location'}</p>
              </div>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select label={labels.selectBus} value={busId} onChange={(e) => setBusId(e.target.value)} disabled={loading} locale={locale}>
              <option value="">{labels.noTransportAssigned}</option>
              {buses.map((bus: any) => (
                <option key={bus.id} value={bus.id}>
                  {formatBusLabel(bus)}
                </option>
              ))}
            </Select>
            <Input label={labels.gpsLocation} value={student.gps_location} onChange={(e) => handleStudent('gps_location', e.target.value)} placeholder="https://maps.google.com/..." disabled={loading} locale={locale} icon={<MapPin size={13} />} />
          </div>
        </Card>

      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="glass" size="sm" onClick={() => router.push(`/${locale}/students`)} disabled={loading}>
          {labels.cancel}
        </Button>
        <Button type="submit" variant="accent" size="sm" loading={loading}>
          {loading ? labels.saving : labels.save}
        </Button>
      </div>
    </form>
  );
}
