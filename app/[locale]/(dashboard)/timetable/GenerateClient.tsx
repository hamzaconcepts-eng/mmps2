'use client';

import { useState, useTransition } from 'react';
import {
  Clock, RefreshCw, Zap, Plus, Trash2, CheckCircle, XCircle,
  ChevronDown, Calendar, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { upsertPeriodSettings, generateTimetable } from './actions';

interface PeriodSlot {
  id?: string;
  slot_number: number;
  slot_type: 'period' | 'break' | 'prayer';
  label: string;
  label_ar: string;
  start_time: string;
  end_time: string;
}

interface GenerateResult {
  success: boolean;
  slotsCreated?: number;
  classesScheduled?: number;
  error?: string;
}

interface Props {
  initialSlots: PeriodSlot[];
  academicYear: string;
  locale: string;
  labels: Record<string, string>;
}

const TYPE_META = {
  period:  { label: 'Teaching Period', label_ar: 'حصة دراسية', color: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20' },
  break:   { label: 'Break',           label_ar: 'استراحة',     color: 'bg-gray-100 text-gray-600 border-gray-200' },
  prayer:  { label: 'Prayer Break',    label_ar: 'استراحة الصلاة', color: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export default function GenerateClient({ initialSlots, academicYear, locale, labels }: Props) {
  const isAr = locale === 'ar';
  const [slots, setSlots] = useState<PeriodSlot[]>(initialSlots);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [genResult, setGenResult] = useState<GenerateResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── Slot editing ──────────────────────────────────────────────────
  const update = (idx: number, field: keyof PeriodSlot, value: string) => {
    setSlots((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const addSlot = () => {
    const next = slots.length + 1;
    const periodNum = slots.filter((s) => s.slot_type === 'period').length + 1;

    // Start new slot from the end_time of the last slot
    const lastSlot = slots[slots.length - 1];
    const startTime = lastSlot ? lastSlot.end_time : '07:30';

    // Add 45 minutes for default end_time
    const [h, m] = startTime.split(':').map(Number);
    const totalMin = h * 60 + m + 45;
    const endH = Math.floor(totalMin / 60) % 24;
    const endM = totalMin % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    setSlots((prev) => [
      ...prev,
      {
        slot_number: next,
        slot_type: 'period',
        label: `Period ${periodNum}`,
        label_ar: `الحصة ${periodNum}`,
        start_time: startTime,
        end_time: endTime,
      },
    ]);
  };

  const removeSlot = (idx: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, slot_number: i + 1 })));
  };

  const moveSlot = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= slots.length) return;
    setSlots((prev) => {
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr.map((s, i) => ({ ...s, slot_number: i + 1 }));
    });
  };

  // ── Save period settings ──────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMsg(null);
    const result = await upsertPeriodSettings(slots);
    setIsSaving(false);
    if (result.success) {
      setSaveMsg({ type: 'success', text: labels.savedSuccess });
    } else {
      setSaveMsg({ type: 'error', text: result.error || labels.saveFailed });
    }
  };

  // ── Generate timetable ────────────────────────────────────────────
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenResult(null);
    startTransition(async () => {
      const result = await generateTimetable(academicYear);
      setGenResult(result as GenerateResult);
      setIsGenerating(false);
    });
  };

  const periodCount = slots.filter((s) => s.slot_type === 'period').length;

  return (
    <div className="space-y-4">
      {/* ── Period configurator ────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-brand-teal/5 to-transparent">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-brand-teal" />
            <h3 className="text-[13px] font-bold text-text-primary">{labels.periodConfig}</h3>
            <span className="text-[11px] text-text-tertiary">
              ({periodCount} {labels.periods}, {slots.length - periodCount} {labels.breaks})
            </span>
          </div>
          <div className="flex items-center gap-2">
            {saveMsg && (
              <span className={`flex items-center gap-1 text-[11px] font-medium ${saveMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {saveMsg.type === 'success' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                {saveMsg.text}
              </span>
            )}
            <Button variant="glass" size="sm" onClick={handleSave} loading={isSaving}>
              {isSaving ? labels.saving : labels.saveSettings}
            </Button>
          </div>
        </div>

        {/* Slot rows */}
        <div className="divide-y divide-gray-50">
          {slots.map((slot, idx) => {
            const meta = TYPE_META[slot.slot_type];
            return (
              <div key={idx} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/50 transition-colors">
                {/* Drag handle / order */}
                <div className="flex flex-col items-center gap-0.5">
                  <button
                    onClick={() => moveSlot(idx, -1)}
                    disabled={idx === 0}
                    className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown size={11} className="rotate-180" />
                  </button>
                  <span className="text-[9px] font-mono text-text-tertiary w-4 text-center">{idx + 1}</span>
                  <button
                    onClick={() => moveSlot(idx, 1)}
                    disabled={idx === slots.length - 1}
                    className="p-0.5 text-gray-300 hover:text-gray-500 disabled:opacity-20 transition-colors"
                  >
                    <ChevronDown size={11} />
                  </button>
                </div>

                {/* Type badge */}
                <select
                  value={slot.slot_type}
                  onChange={(e) => update(idx, 'slot_type', e.target.value)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${meta.color}`}
                >
                  <option value="period">{isAr ? 'حصة دراسية' : 'Period'}</option>
                  <option value="break">{isAr ? 'استراحة' : 'Break'}</option>
                  <option value="prayer">{isAr ? 'صلاة' : 'Prayer'}</option>
                </select>

                {/* Label EN */}
                <input
                  value={slot.label}
                  onChange={(e) => update(idx, 'label', e.target.value)}
                  className="flex-1 text-[11px] px-2 py-1 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal/30 min-w-0"
                  placeholder="Label EN"
                />
                {/* Label AR */}
                <input
                  value={slot.label_ar}
                  onChange={(e) => update(idx, 'label_ar', e.target.value)}
                  dir="rtl"
                  className="flex-1 text-[11px] px-2 py-1 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal/30 min-w-0"
                  placeholder="التسمية"
                />

                {/* Times */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <input
                    type="time"
                    value={slot.start_time}
                    onChange={(e) => update(idx, 'start_time', e.target.value)}
                    className="text-[11px] px-2 py-1 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal/30 w-[110px]"
                  />
                  <span className="text-[10px] text-text-tertiary">→</span>
                  <input
                    type="time"
                    value={slot.end_time}
                    onChange={(e) => update(idx, 'end_time', e.target.value)}
                    className="text-[11px] px-2 py-1 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-brand-teal/30 w-[110px]"
                  />
                </div>

                <button
                  onClick={() => removeSlot(idx)}
                  className="p-1 rounded text-text-tertiary hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-gray-50/40">
          <Button variant="glass" size="sm" icon={<Plus size={13} />} onClick={addSlot}>
            {labels.addSlot}
          </Button>
        </div>
      </div>

      {/* ── Generate section ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-teal/20 bg-gradient-to-br from-brand-teal/5 to-teal-50/30 p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[14px] font-bold text-text-primary flex items-center gap-2">
              <Zap size={15} className="text-brand-teal" />
              {labels.generateTitle}
            </h3>
            <p className="text-[11px] text-text-tertiary mt-1 max-w-md">
              {labels.generateDesc}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <Calendar size={12} className="text-text-tertiary" />
              <span className="text-[11px] font-semibold text-text-secondary">{academicYear}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="accent"
              size="md"
              icon={isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              onClick={handleGenerate}
              loading={isGenerating}
              disabled={periodCount === 0}
            >
              {isGenerating ? labels.generating : labels.generate}
            </Button>
            {genResult?.success && (
              <Button
                variant="glass"
                size="md"
                icon={<RefreshCw size={14} />}
                onClick={handleGenerate}
                loading={isGenerating}
              >
                {labels.regenerate}
              </Button>
            )}
          </div>
        </div>

        {/* Result */}
        {genResult && (
          <div className={`flex items-start gap-3 p-3 rounded-xl border text-[12px] ${
            genResult.success
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {genResult.success ? <CheckCircle size={16} className="mt-0.5 flex-shrink-0" /> : <XCircle size={16} className="mt-0.5 flex-shrink-0" />}
            <div>
              {genResult.success ? (
                <div>
                  <p className="font-bold">{labels.generateSuccess}</p>
                  <p className="text-[11px] mt-0.5 opacity-80">
                    {genResult.classesScheduled} {labels.classesScheduled} · {genResult.slotsCreated} {labels.slotsCreated}
                  </p>
                </div>
              ) : (
                <p className="font-medium">{genResult.error}</p>
              )}
            </div>
          </div>
        )}

        {periodCount === 0 && (
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            ⚠️ {labels.noPeriods}
          </p>
        )}
      </div>
    </div>
  );
}
