'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, User, GraduationCap, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { updateStudent } from '../actions';

interface StudentEditFormProps {
  student: any;
  classes: any[];
  locale: string;
  labels: {
    englishNames: string;
    arabicNames: string;
    personalInfo: string;
    academicInfo: string;
    locationMedical: string;
    firstName: string;
    fatherName: string;
    grandfatherName: string;
    familyName: string;
    firstNameAr: string;
    fatherNameAr: string;
    grandfatherNameAr: string;
    familyNameAr: string;
    dateOfBirth: string;
    gender: string;
    male: string;
    female: string;
    nationality: string;
    nationalId: string;
    class: string;
    enrollmentDate: string;
    active: string;
    inactive: string;
    status: string;
    gpsLocation: string;
    medicalNotes: string;
    save: string;
    saving: string;
    cancel: string;
    updateSuccess: string;
    updateFailed: string;
  };
}

export default function StudentEditForm({
  student,
  classes,
  locale,
  labels,
}: StudentEditFormProps) {
  const router = useRouter();
  const isAr = locale === 'ar';

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
    medical_notes: student.medical_notes || '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Build update payload — only send fields that have values
    const data: Record<string, any> = {
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
      medical_notes: form.medical_notes || null,
    };

    const result = await updateStudent(student.id, data);

    if (result.success) {
      setMessage({ type: 'success', text: labels.updateSuccess });
      // Redirect back to student detail after a short delay
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* English Names */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-brand-teal" />
              <Card.Title>{labels.englishNames}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={labels.firstName}
              value={form.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              required
              disabled={loading}
              locale={locale}
            />
            <Input
              label={labels.fatherName}
              value={form.father_name}
              onChange={(e) => handleChange('father_name', e.target.value)}
              required
              disabled={loading}
              locale={locale}
            />
            <Input
              label={labels.grandfatherName}
              value={form.grandfather_name}
              onChange={(e) => handleChange('grandfather_name', e.target.value)}
              required
              disabled={loading}
              locale={locale}
            />
            <Input
              label={labels.familyName}
              value={form.family_name}
              onChange={(e) => handleChange('family_name', e.target.value)}
              required
              disabled={loading}
              locale={locale}
            />
          </div>
        </Card>

        {/* Arabic Names */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-accent-orange" />
              <Card.Title>{labels.arabicNames}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={labels.firstNameAr}
              value={form.first_name_ar}
              onChange={(e) => handleChange('first_name_ar', e.target.value)}
              required
              disabled={loading}
              locale={locale}
              dir="rtl"
            />
            <Input
              label={labels.fatherNameAr}
              value={form.father_name_ar}
              onChange={(e) => handleChange('father_name_ar', e.target.value)}
              required
              disabled={loading}
              locale={locale}
              dir="rtl"
            />
            <Input
              label={labels.grandfatherNameAr}
              value={form.grandfather_name_ar}
              onChange={(e) => handleChange('grandfather_name_ar', e.target.value)}
              required
              disabled={loading}
              locale={locale}
              dir="rtl"
            />
            <Input
              label={labels.familyNameAr}
              value={form.family_name_ar}
              onChange={(e) => handleChange('family_name_ar', e.target.value)}
              required
              disabled={loading}
              locale={locale}
              dir="rtl"
            />
          </div>
        </Card>

        {/* Personal Info */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <User size={15} className="text-success" />
              <Card.Title>{labels.personalInfo}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={labels.dateOfBirth}
              type="date"
              value={form.date_of_birth}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
              required
              disabled={loading}
              locale={locale}
            />
            <Select
              label={labels.gender}
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              required
              disabled={loading}
              locale={locale}
            >
              <option value="male">{labels.male}</option>
              <option value="female">{labels.female}</option>
            </Select>
            <Input
              label={labels.nationality}
              value={form.nationality}
              onChange={(e) => handleChange('nationality', e.target.value)}
              disabled={loading}
              locale={locale}
            />
            <Input
              label={labels.nationalId}
              value={form.national_id}
              onChange={(e) => handleChange('national_id', e.target.value)}
              disabled={loading}
              locale={locale}
            />
          </div>
        </Card>

        {/* Academic Info */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <GraduationCap size={15} className="text-warning" />
              <Card.Title>{labels.academicInfo}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label={labels.class}
              value={form.class_id}
              onChange={(e) => handleChange('class_id', e.target.value)}
              disabled={loading}
              locale={locale}
            >
              <option value="">—</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {formatClassName(cls)}
                </option>
              ))}
            </Select>
            <Input
              label={labels.enrollmentDate}
              type="date"
              value={form.enrollment_date}
              onChange={(e) => handleChange('enrollment_date', e.target.value)}
              required
              disabled={loading}
              locale={locale}
            />
            <Select
              label={labels.status}
              value={form.is_active ? 'active' : 'inactive'}
              onChange={(e) => handleChange('is_active', e.target.value === 'active')}
              disabled={loading}
              locale={locale}
            >
              <option value="active">{labels.active}</option>
              <option value="inactive">{labels.inactive}</option>
            </Select>
          </div>
        </Card>

        {/* Location & Medical — full width */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-danger" />
                <Card.Title>{labels.locationMedical}</Card.Title>
              </div>
            </Card.Header>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label={labels.gpsLocation}
                value={form.gps_location}
                onChange={(e) => handleChange('gps_location', e.target.value)}
                placeholder="https://maps.google.com/..."
                disabled={loading}
                locale={locale}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-text-secondary">
                  {labels.medicalNotes}
                </label>
                <textarea
                  value={form.medical_notes}
                  onChange={(e) => handleChange('medical_notes', e.target.value)}
                  disabled={loading}
                  rows={3}
                  className="w-full glass-input rounded-md py-2.5 px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none transition-all resize-none"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="glass"
          size="sm"
          onClick={() => router.push(`/${locale}/students/${student.id}`)}
          disabled={loading}
        >
          {labels.cancel}
        </Button>
        <Button
          type="submit"
          variant="accent"
          size="sm"
          loading={loading}
        >
          {loading ? labels.saving : labels.save}
        </Button>
      </div>
    </form>
  );
}
