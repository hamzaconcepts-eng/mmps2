'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, User, GraduationCap, Users, Bus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { updateStudent } from '../actions';

interface StudentEditFormProps {
  student: any;
  guardian: any;
  guardianId: string | null;
  transport: any;
  classes: any[];
  buses: any[];
  locale: string;
  labels: Record<string, string>;
}

export default function StudentEditForm({
  student,
  guardian,
  guardianId,
  transport,
  classes,
  buses,
  locale,
  labels,
}: StudentEditFormProps) {
  const router = useRouter();
  const isAr = locale === 'ar';

  // Student fields
  const [form, setForm] = useState({
    first_name: student.first_name || '',
    father_name: student.father_name || '',
    grandfather_name: student.grandfather_name || '',
    family_name: student.family_name || '',
    first_name_ar: student.first_name_ar || '',
    father_name_ar: student.father_name_ar || '',
    grandfather_name_ar: student.grandfather_name_ar || '',
    family_name_ar: student.family_name_ar || '',
    date_of_birth: student.date_of_birth || '',
    gender: student.gender || 'male',
    nationality: student.nationality || '',
    national_id: student.national_id || '',
    class_id: student.class_id || '',
    enrollment_date: student.enrollment_date || '',
    is_active: student.is_active,
    gps_location: student.gps_location || '',
  });

  // Guardian fields
  const [guardianForm, setGuardianForm] = useState({
    first_name: guardian?.first_name || '',
    first_name_ar: guardian?.first_name_ar || '',
    father_name: guardian?.father_name || '',
    father_name_ar: guardian?.father_name_ar || '',
    family_name: guardian?.family_name || '',
    family_name_ar: guardian?.family_name_ar || '',
    relationship: guardian?.relationship || '',
    relationship_ar: guardian?.relationship_ar || '',
    phone: guardian?.phone || '',
    email: guardian?.email || '',
  });

  // Transport (optional)
  const [busId, setBusId] = useState(transport?.bus_id || '');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleStudent = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleGuardian = (field: string, value: string) => {
    setGuardianForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  // When relationship changes, also set the Arabic equivalent
  const handleRelationship = (value: string) => {
    const arMap: Record<string, string> = {
      Father: 'أب',
      Mother: 'أم',
      Guardian: 'ولي أمر',
    };
    setGuardianForm((prev) => ({
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

    const result = await updateStudent(student.id, {
      student: {
        first_name: form.first_name,
        father_name: form.father_name,
        grandfather_name: form.grandfather_name,
        family_name: form.family_name,
        first_name_ar: form.first_name_ar,
        father_name_ar: form.father_name_ar,
        grandfather_name_ar: form.grandfather_name_ar,
        family_name_ar: form.family_name_ar,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        nationality: form.nationality || null,
        national_id: form.national_id || null,
        class_id: form.class_id || null,
        enrollment_date: form.enrollment_date,
        is_active: form.is_active,
        gps_location: form.gps_location || null,
      },
      guardian: {
        id: guardianId,
        first_name: guardianForm.first_name,
        first_name_ar: guardianForm.first_name_ar,
        father_name: guardianForm.father_name || null,
        father_name_ar: guardianForm.father_name_ar || null,
        family_name: guardianForm.family_name,
        family_name_ar: guardianForm.family_name_ar,
        relationship: guardianForm.relationship,
        relationship_ar: guardianForm.relationship_ar || null,
        phone: guardianForm.phone,
        email: guardianForm.email || null,
      },
      transport: selectedBus
        ? { bus_id: selectedBus.id, transport_area_id: selectedBus.transport_area_id }
        : null,
    });

    if (result.success) {
      setMessage({ type: 'success', text: labels.updateSuccess });
      setTimeout(() => {
        router.push(`/${locale}/students/${student.id}`);
        router.refresh();
      }, 800);
    } else {
      setMessage({ type: 'error', text: result.error || labels.updateFailed });
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

        {/* ── Student English Names ── */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-brand-teal" />
              <Card.Title>{labels.englishNames}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label={labels.firstName} value={form.first_name} onChange={(e) => handleStudent('first_name', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.fatherName} value={form.father_name} onChange={(e) => handleStudent('father_name', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.grandfatherName} value={form.grandfather_name} onChange={(e) => handleStudent('grandfather_name', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.familyName} value={form.family_name} onChange={(e) => handleStudent('family_name', e.target.value)} required disabled={loading} locale={locale} />
          </div>
        </Card>

        {/* ── Student Arabic Names ── */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-accent-orange" />
              <Card.Title>{labels.arabicNames}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label={labels.firstNameAr} value={form.first_name_ar} onChange={(e) => handleStudent('first_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
            <Input label={labels.fatherNameAr} value={form.father_name_ar} onChange={(e) => handleStudent('father_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
            <Input label={labels.grandfatherNameAr} value={form.grandfather_name_ar} onChange={(e) => handleStudent('grandfather_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
            <Input label={labels.familyNameAr} value={form.family_name_ar} onChange={(e) => handleStudent('family_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
          </div>
        </Card>

        {/* ── Personal Info ── */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-success" />
              <Card.Title>{labels.personalInfo}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label={labels.dateOfBirth} type="date" value={form.date_of_birth} onChange={(e) => handleStudent('date_of_birth', e.target.value)} required disabled={loading} locale={locale} />
            <Select label={labels.gender} value={form.gender} onChange={(e) => handleStudent('gender', e.target.value)} required disabled={loading} locale={locale}>
              <option value="male">{labels.male}</option>
              <option value="female">{labels.female}</option>
            </Select>
            <Input label={labels.nationality} value={form.nationality} onChange={(e) => handleStudent('nationality', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.nationalId} value={form.national_id} onChange={(e) => handleStudent('national_id', e.target.value)} required disabled={loading} locale={locale} />
          </div>
        </Card>

        {/* ── Academic Info ── */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-warning" />
              <Card.Title>{labels.academicInfo}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select label={labels.class} value={form.class_id} onChange={(e) => handleStudent('class_id', e.target.value)} required disabled={loading} locale={locale}>
              <option value="">—</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {formatClassName(cls)}
                </option>
              ))}
            </Select>
            <Input label={labels.enrollmentDate} type="date" value={form.enrollment_date} onChange={(e) => handleStudent('enrollment_date', e.target.value)} required disabled={loading} locale={locale} />
            <Select label={labels.status} value={form.is_active ? 'active' : 'inactive'} onChange={(e) => handleStudent('is_active', e.target.value === 'active')} disabled={loading} locale={locale}>
              <option value="active">{labels.active}</option>
              <option value="inactive">{labels.inactive}</option>
            </Select>
          </div>
        </Card>

        {/* ── Guardian Info ── */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Users size={15} className="text-brand-teal" />
              <Card.Title>{labels.guardianInfo}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label={labels.guardianFirstName} value={guardianForm.first_name} onChange={(e) => handleGuardian('first_name', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.guardianFirstNameAr} value={guardianForm.first_name_ar} onChange={(e) => handleGuardian('first_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
            <Input label={labels.guardianFatherName} value={guardianForm.father_name} onChange={(e) => handleGuardian('father_name', e.target.value)} disabled={loading} locale={locale} />
            <Input label={labels.guardianFatherNameAr} value={guardianForm.father_name_ar} onChange={(e) => handleGuardian('father_name_ar', e.target.value)} disabled={loading} locale={locale} dir="rtl" />
            <Input label={labels.guardianFamilyName} value={guardianForm.family_name} onChange={(e) => handleGuardian('family_name', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.guardianFamilyNameAr} value={guardianForm.family_name_ar} onChange={(e) => handleGuardian('family_name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" />
            <Select label={labels.relationship} value={guardianForm.relationship} onChange={(e) => handleRelationship(e.target.value)} required disabled={loading} locale={locale}>
              <option value="">{labels.selectRelationship}</option>
              <option value="Father">{labels.father}</option>
              <option value="Mother">{labels.mother}</option>
              <option value="Guardian">{labels.guardianRelative}</option>
            </Select>
            <Input label={labels.guardianPhone} value={guardianForm.phone} onChange={(e) => handleGuardian('phone', e.target.value)} required disabled={loading} locale={locale} placeholder="91234567" />
            <Input label={labels.guardianEmail} value={guardianForm.email} onChange={(e) => handleGuardian('email', e.target.value)} disabled={loading} locale={locale} type="email" />
          </div>
        </Card>

        {/* ── Transport + Location (optional) ── */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Bus size={15} className="text-warning" />
              <Card.Title>{labels.transportSection}</Card.Title>
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
            <Input label={labels.gpsLocation} value={form.gps_location} onChange={(e) => handleStudent('gps_location', e.target.value)} placeholder="https://maps.google.com/..." disabled={loading} locale={locale} />
          </div>
        </Card>

      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="glass" size="sm" onClick={() => router.push(`/${locale}/students/${student.id}`)} disabled={loading}>
          {labels.cancel}
        </Button>
        <Button type="submit" variant="accent" size="sm" loading={loading}>
          {loading ? labels.saving : labels.save}
        </Button>
      </div>
    </form>
  );
}
