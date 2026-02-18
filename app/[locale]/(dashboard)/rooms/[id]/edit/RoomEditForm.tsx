'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, DoorOpen } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { updateRoom } from '../../actions';

interface RoomEditFormProps {
  room: any;
  classes: any[];
  locale: string;
  labels: Record<string, string>;
}

const ROOM_TYPES = ['classroom', 'lab', 'sports', 'music_room', 'library', 'other'];

export default function RoomEditForm({ room, classes, locale, labels }: RoomEditFormProps) {
  const router = useRouter();
  const isAr = locale === 'ar';

  // Find which class is currently assigned to this room
  const assignedClass = classes.find((cls: any) => cls.facility_id === room.id);

  const [form, setForm] = useState({
    name: room.name || '',
    name_ar: room.name_ar || '',
    code: room.code || '',
    type: room.type || 'classroom',
    capacity: String(room.capacity ?? ''),
    is_shared: String(room.is_shared ?? false),
    is_active: room.is_active ?? true,
    facility_class_id: assignedClass?.id || '',
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

    const result = await updateRoom(room.id, form);

    if (result.success) {
      setMessage({ type: 'success', text: labels.updateSuccess });
      setTimeout(() => {
        router.push(`/${locale}/rooms/${room.id}`);
        router.refresh();
      }, 800);
    } else {
      setMessage({ type: 'error', text: result.error || labels.updateFailed });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {message.text}
        </div>
      )}

      <p className="text-xs text-text-tertiary">
        <span className="text-danger">*</span> {labels.requiredField}
      </p>

      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <DoorOpen size={15} className="text-brand-teal" />
            <Card.Title>{labels.roomInfo}</Card.Title>
          </div>
        </Card.Header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label={labels.roomNameEn} value={form.name} onChange={(e) => handleChange('name', e.target.value)} required disabled={loading} locale={locale} lang="en" inputMode="text" />
          <Input label={labels.roomNameAr} value={form.name_ar} onChange={(e) => handleChange('name_ar', e.target.value)} required disabled={loading} locale={locale} dir="rtl" lang="ar" inputMode="text" />
          <Input label={labels.code} value={form.code} onChange={(e) => handleChange('code', e.target.value.toUpperCase())} required disabled={loading} locale={locale} lang="en" inputMode="text" />
          <Select label={labels.type} value={form.type} onChange={(e) => handleChange('type', e.target.value)} required disabled={loading} locale={locale}>
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>{labels[`type_${t}`]}</option>
            ))}
          </Select>
          <Input label={labels.capacity} type="number" value={form.capacity} onChange={(e) => handleChange('capacity', e.target.value)} disabled={loading} locale={locale} />
          <Select label={labels.shared} value={form.is_shared} onChange={(e) => handleChange('is_shared', e.target.value)} disabled={loading} locale={locale}>
            <option value="false">{labels.sharedNo}</option>
            <option value="true">{labels.sharedYes}</option>
          </Select>
          <Select label={labels.status} value={form.is_active ? 'active' : 'inactive'} onChange={(e) => handleChange('is_active', e.target.value === 'active')} disabled={loading} locale={locale}>
            <option value="active">{labels.active}</option>
            <option value="inactive">{labels.inactive}</option>
          </Select>
          <div className="sm:col-span-2">
            <Select label={`${labels.assignedClass} (Optional)`} value={form.facility_class_id} onChange={(e) => handleChange('facility_class_id', e.target.value)} disabled={loading} locale={locale}>
              <option value="">{labels.selectClass}</option>
              {classes.map((cls: any) => (
                <option key={cls.id} value={cls.id}>
                  {isAr ? cls.name_ar : cls.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="glass" size="sm" onClick={() => router.push(`/${locale}/rooms/${room.id}`)} disabled={loading}>
          {labels.cancel}
        </Button>
        <Button type="submit" variant="accent" size="sm" loading={loading}>
          {loading ? labels.saving : labels.save}
        </Button>
      </div>
    </form>
  );
}
