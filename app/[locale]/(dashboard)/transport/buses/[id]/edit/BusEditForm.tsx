'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Bus, Users } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { updateBus } from '../../actions';

interface BusEditFormProps {
  bus: any;
  areas: any[];
  locale: string;
  labels: Record<string, string>;
}

export default function BusEditForm({ bus, areas, locale, labels }: BusEditFormProps) {
  const router = useRouter();
  const isAr = locale === 'ar';

  const [form, setForm] = useState({
    bus_number: bus.bus_number || '',
    plate_number: bus.plate_number || '',
    capacity: String(bus.capacity || 40),
    transport_area_id: bus.transport_area_id || '',
    driver_name: bus.driver_name || '',
    driver_name_ar: bus.driver_name_ar || '',
    driver_father_name: bus.driver_father_name || '',
    driver_father_name_ar: bus.driver_father_name_ar || '',
    driver_family_name: bus.driver_family_name || '',
    driver_family_name_ar: bus.driver_family_name_ar || '',
    driver_phone: bus.driver_phone || '',
    is_active: bus.is_active ?? true,
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
    const result = await updateBus(bus.id, form);
    if (result.success) {
      setMessage({ type: 'success', text: labels.updateSuccess });
      setTimeout(() => { router.push(`/${locale}/transport/buses/${bus.id}`); router.refresh(); }, 800);
    } else {
      setMessage({ type: 'error', text: result.error || labels.updateFailed });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {message.text}
        </div>
      )}
      <p className="text-xs text-text-tertiary"><span className="text-danger">*</span> {labels.requiredField}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Bus size={15} className="text-brand-teal" />
              <Card.Title>{labels.busInfo}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label={labels.busNumber} value={form.bus_number} onChange={(e) => handleChange('bus_number', e.target.value)} required disabled={loading} locale={locale} />
            <Input label={labels.plateNumber} value={form.plate_number} onChange={(e) => handleChange('plate_number', e.target.value)} disabled={loading} locale={locale} />
            <Input label={labels.capacity} type="number" value={form.capacity} onChange={(e) => handleChange('capacity', e.target.value)} required disabled={loading} locale={locale} />
            <Select label={labels.area} value={form.transport_area_id} onChange={(e) => handleChange('transport_area_id', e.target.value)} required disabled={loading} locale={locale}>
              <option value="">{labels.selectArea}</option>
              {areas.map((a: any) => (
                <option key={a.id} value={a.id}>{isAr ? a.name_ar : a.name}</option>
              ))}
            </Select>
            <Select label={labels.status} value={form.is_active ? 'active' : 'inactive'} onChange={(e) => handleChange('is_active', e.target.value === 'active')} disabled={loading} locale={locale}>
              <option value="active">{labels.active}</option>
              <option value="inactive">{labels.inactive}</option>
            </Select>
          </div>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <Users size={15} className="text-accent-orange" />
              <Card.Title>{labels.driverInfo}</Card.Title>
            </div>
          </Card.Header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label={labels.driverName} value={form.driver_name} onChange={(e) => handleChange('driver_name', e.target.value)} disabled={loading} locale={locale} lang="en" inputMode="text" pattern="[A-Za-z\s\-']+" />
            <Input label={labels.driverNameAr} value={form.driver_name_ar} onChange={(e) => handleChange('driver_name_ar', e.target.value)} disabled={loading} locale={locale} dir="rtl" lang="ar" inputMode="text" />
            <Input label={labels.driverFatherName} value={form.driver_father_name} onChange={(e) => handleChange('driver_father_name', e.target.value)} disabled={loading} locale={locale} lang="en" inputMode="text" pattern="[A-Za-z\s\-']+" />
            <Input label={labels.driverFatherNameAr} value={form.driver_father_name_ar} onChange={(e) => handleChange('driver_father_name_ar', e.target.value)} disabled={loading} locale={locale} dir="rtl" lang="ar" inputMode="text" />
            <Input label={labels.driverFamilyName} value={form.driver_family_name} onChange={(e) => handleChange('driver_family_name', e.target.value)} disabled={loading} locale={locale} lang="en" inputMode="text" pattern="[A-Za-z\s\-']+" />
            <Input label={labels.driverFamilyNameAr} value={form.driver_family_name_ar} onChange={(e) => handleChange('driver_family_name_ar', e.target.value)} disabled={loading} locale={locale} dir="rtl" lang="ar" inputMode="text" />
            <Input label={labels.driverPhone} value={form.driver_phone} onChange={(e) => handleChange('driver_phone', e.target.value)} disabled={loading} locale={locale} placeholder="91234567" />
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="glass" size="sm" onClick={() => router.push(`/${locale}/transport/buses/${bus.id}`)} disabled={loading}>{labels.cancel}</Button>
        <Button type="submit" variant="accent" size="sm" loading={loading}>{loading ? labels.saving : labels.save}</Button>
      </div>
    </form>
  );
}
