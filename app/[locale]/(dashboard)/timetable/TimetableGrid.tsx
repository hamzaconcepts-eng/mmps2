'use client';

import React from 'react';

// ─── Subject colour palette (20 distinct colours) ───────────────────────────
const SUBJECT_COLORS = [
  { bg: 'bg-[#4F46E5]/10', border: 'border-[#4F46E5]/30', text: 'text-[#4F46E5]', dot: 'bg-[#4F46E5]' },
  { bg: 'bg-[#0D9488]/10', border: 'border-[#0D9488]/30', text: 'text-[#0D9488]', dot: 'bg-[#0D9488]' },
  { bg: 'bg-[#D97706]/10', border: 'border-[#D97706]/30', text: 'text-[#D97706]', dot: 'bg-[#D97706]' },
  { bg: 'bg-[#DC2626]/10', border: 'border-[#DC2626]/30', text: 'text-[#DC2626]', dot: 'bg-[#DC2626]' },
  { bg: 'bg-[#7C3AED]/10', border: 'border-[#7C3AED]/30', text: 'text-[#7C3AED]', dot: 'bg-[#7C3AED]' },
  { bg: 'bg-[#DB2777]/10', border: 'border-[#DB2777]/30', text: 'text-[#DB2777]', dot: 'bg-[#DB2777]' },
  { bg: 'bg-[#059669]/10', border: 'border-[#059669]/30', text: 'text-[#059669]', dot: 'bg-[#059669]' },
  { bg: 'bg-[#0284C7]/10', border: 'border-[#0284C7]/30', text: 'text-[#0284C7]', dot: 'bg-[#0284C7]' },
  { bg: 'bg-[#C2410C]/10', border: 'border-[#C2410C]/30', text: 'text-[#C2410C]', dot: 'bg-[#C2410C]' },
  { bg: 'bg-[#0E7490]/10', border: 'border-[#0E7490]/30', text: 'text-[#0E7490]', dot: 'bg-[#0E7490]' },
  { bg: 'bg-[#6D28D9]/10', border: 'border-[#6D28D9]/30', text: 'text-[#6D28D9]', dot: 'bg-[#6D28D9]' },
  { bg: 'bg-[#B45309]/10', border: 'border-[#B45309]/30', text: 'text-[#B45309]', dot: 'bg-[#B45309]' },
  { bg: 'bg-[#0F766E]/10', border: 'border-[#0F766E]/30', text: 'text-[#0F766E]', dot: 'bg-[#0F766E]' },
  { bg: 'bg-[#BE185D]/10', border: 'border-[#BE185D]/30', text: 'text-[#BE185D]', dot: 'bg-[#BE185D]' },
  { bg: 'bg-[#1D4ED8]/10', border: 'border-[#1D4ED8]/30', text: 'text-[#1D4ED8]', dot: 'bg-[#1D4ED8]' },
  { bg: 'bg-[#047857]/10', border: 'border-[#047857]/30', text: 'text-[#047857]', dot: 'bg-[#047857]' },
  { bg: 'bg-[#9D174D]/10', border: 'border-[#9D174D]/30', text: 'text-[#9D174D]', dot: 'bg-[#9D174D]' },
  { bg: 'bg-[#6B21A8]/10', border: 'border-[#6B21A8]/30', text: 'text-[#6B21A8]', dot: 'bg-[#6B21A8]' },
  { bg: 'bg-[#991B1B]/10', border: 'border-[#991B1B]/30', text: 'text-[#991B1B]', dot: 'bg-[#991B1B]' },
  { bg: 'bg-[#064E3B]/10', border: 'border-[#064E3B]/30', text: 'text-[#064E3B]', dot: 'bg-[#064E3B]' },
];

// ─── Print colour palette (solid fills for print) ────────────────────────────
const PRINT_BG = [
  '#EEF2FF','#CCFBF1','#FEF3C7','#FEE2E2','#EDE9FE',
  '#FCE7F3','#D1FAE5','#E0F2FE','#FFEDD5','#CFFAFE',
  '#F3E8FF','#FEF9C3','#CCFBF1','#FCE7F3','#DBEAFE',
  '#D1FAE5','#FFE4E6','#F3E8FF','#FEE2E2','#ECFDF5',
];

export interface TimetableSlot {
  id: string;
  day_of_week: number;  // 0=Sun … 4=Thu
  period: number;       // 1-based teaching period index
  start_time: string;
  end_time: string;
  subjectId: string;
  subjectName: string;
  subjectNameAr: string;
  subjectCode: string;
  teacherName?: string;
  className?: string;
}

export interface PeriodInfo {
  period_number: number;  // 1-based within teaching periods
  start_time: string;
  end_time: string;
  label: string;
  label_ar: string;
}

export interface BreakInfo {
  after_period: number;  // insert break row after this teaching period (0 = before first period)
  label: string;
  label_ar: string;
  start_time: string;
  end_time: string;
  slot_type: 'break' | 'prayer';
}

interface Props {
  slots: TimetableSlot[];
  periods: PeriodInfo[];
  breaks: BreakInfo[];
  locale: string;
  mode: 'class' | 'teacher' | 'room';
  labels: {
    days: string[];
    period: string;
    noTimetable: string;
    free: string;
    break: string;
    prayer: string;
  };
}

// Build subject → color index map
function buildColorMap(slots: TimetableSlot[]) {
  const map: Record<string, number> = {};
  let idx = 0;
  for (const s of slots) {
    if (!(s.subjectId in map)) {
      map[s.subjectId] = idx % SUBJECT_COLORS.length;
      idx++;
    }
  }
  return map;
}

function fmt(time: string) {
  // "07:30:00" → "7:30"
  const [h, m] = time.split(':');
  return `${parseInt(h)}:${m}`;
}

// ─── Single cell ─────────────────────────────────────────────────────────────
function SlotCell({
  slot,
  color,
  printBg,
  mode,
  isAr,
}: {
  slot: TimetableSlot | null;
  color: (typeof SUBJECT_COLORS)[0] | null;
  printBg: string;
  mode: 'class' | 'teacher' | 'room';
  isAr: boolean;
}) {
  if (!slot) {
    return (
      <td className="border border-gray-100 p-1 min-w-[90px] print:min-w-0 print:p-0.5">
        <div className="h-14 print:h-10 rounded flex items-center justify-center text-[9px] text-gray-300 font-medium print:text-[7px]">
          —
        </div>
      </td>
    );
  }

  const name = isAr ? slot.subjectNameAr : slot.subjectName;

  return (
    <td className="border border-gray-100 p-1 min-w-[90px] print:min-w-0 print:p-0.5">
      <div
        className={`h-14 print:h-10 rounded border ${color?.bg} ${color?.border} px-1.5 py-1 flex flex-col justify-center overflow-hidden print:border-0`}
        style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
      >
        {/* Print colour block */}
        <div
          className="hidden print:block absolute inset-0 rounded opacity-30"
          style={{ backgroundColor: printBg }}
        />
        <p className={`text-[10px] print:text-[7px] font-bold leading-tight truncate ${color?.text}`}>
          {name}
        </p>
        <p className="text-[8px] print:text-[6px] text-gray-400 font-mono leading-tight">
          {slot.subjectCode}
        </p>
        {mode !== 'class' && slot.className && (
          <p className="text-[8px] print:text-[6px] text-gray-500 leading-tight truncate">{slot.className}</p>
        )}
        {mode !== 'teacher' && slot.teacherName && (
          <p className="text-[8px] print:text-[6px] text-gray-500 leading-tight truncate">{slot.teacherName}</p>
        )}
      </div>
    </td>
  );
}

// ─── Main grid ───────────────────────────────────────────────────────────────
export default function TimetableGrid({ slots, periods, breaks, locale, mode, labels }: Props) {
  const isAr = locale === 'ar';
  const DAYS = [0, 1, 2, 3, 4];

  // Build fast lookup: day → period → slot
  const lookup: Record<number, Record<number, TimetableSlot>> = {};
  for (const d of DAYS) lookup[d] = {};
  for (const s of slots) {
    lookup[s.day_of_week][s.period] = s;
  }

  const colorMap = buildColorMap(slots);

  if (slots.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-text-tertiary text-sm">
        {labels.noTimetable}
      </div>
    );
  }

  // Build ordered rows (periods + breaks interleaved)
  type Row =
    | { type: 'period'; info: PeriodInfo }
    | { type: 'break' | 'prayer'; info: BreakInfo };

  const rows: Row[] = [];
  let periodCursor = 0;
  for (const b of breaks) {
    // Add periods up to this break
    while (periodCursor < periods.length && periods[periodCursor].period_number <= b.after_period) {
      rows.push({ type: 'period', info: periods[periodCursor] });
      periodCursor++;
    }
    rows.push({ type: b.slot_type, info: b });
  }
  // Remaining periods
  while (periodCursor < periods.length) {
    rows.push({ type: 'period', info: periods[periodCursor] });
    periodCursor++;
  }

  // If no breaks defined just add all periods
  if (breaks.length === 0) {
    rows.length = 0;
    for (const p of periods) rows.push({ type: 'period', info: p });
  }

  const days = isAr ? [...labels.days].reverse() : labels.days;
  const dayIndices = isAr ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4];

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse text-left print:text-[8px]"
        dir={isAr ? 'rtl' : 'ltr'}
        style={{ tableLayout: 'fixed' }}
      >
        {/* Header: days */}
        <thead>
          <tr>
            <th className="border border-gray-200 bg-gray-50 p-2 print:p-1 text-[10px] print:text-[7px] font-semibold text-text-secondary w-20 print:w-14">
              {labels.period}
            </th>
            {dayIndices.map((d) => (
              <th
                key={d}
                className="border border-gray-200 bg-gradient-to-br from-brand-teal/10 to-brand-teal/5 p-2 print:p-1 text-[11px] print:text-[8px] font-bold text-brand-teal text-center"
              >
                {labels.days[d]}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIdx) => {
            if (row.type === 'break' || row.type === 'prayer') {
              const b = row.info as BreakInfo;
              const isPrayer = row.type === 'prayer';
              return (
                <tr key={`break-${rowIdx}`}>
                  <td colSpan={6} className="border border-gray-100 p-0">
                    <div
                      className={`flex items-center justify-center gap-2 py-1.5 print:py-1 text-[10px] print:text-[7px] font-semibold ${
                        isPrayer
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100/80 text-gray-500'
                      }`}
                    >
                      <span>{isPrayer ? '🕌' : '☕'}</span>
                      <span>{isAr ? b.label_ar : b.label}</span>
                      <span className="font-mono text-[9px] print:text-[6px] opacity-70">
                        {fmt(b.start_time)} – {fmt(b.end_time)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            }

            const p = row.info as PeriodInfo;
            return (
              <tr key={`period-${p.period_number}`} className="hover:bg-gray-50/30 transition-colors">
                {/* Time label */}
                <td className="border border-gray-100 bg-gray-50/50 p-1.5 print:p-1 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] print:text-[7px] font-bold text-text-secondary">
                      {isAr ? p.label_ar : p.label}
                    </span>
                    <span className="text-[8px] print:text-[6px] font-mono text-text-tertiary mt-0.5">
                      {fmt(p.start_time)}
                    </span>
                    <span className="text-[8px] print:text-[6px] font-mono text-text-tertiary">
                      {fmt(p.end_time)}
                    </span>
                  </div>
                </td>

                {dayIndices.map((d) => {
                  const slot = lookup[d]?.[p.period_number] ?? null;
                  const colorIdx = slot ? colorMap[slot.subjectId] : 0;
                  return (
                    <SlotCell
                      key={d}
                      slot={slot}
                      color={slot ? SUBJECT_COLORS[colorIdx] : null}
                      printBg={slot ? PRINT_BG[colorIdx] : '#fff'}
                      mode={mode}
                      isAr={isAr}
                    />
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      {slots.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 print:mt-1">
          {Object.entries(colorMap).map(([subjectId, colorIdx]) => {
            const sample = slots.find((s) => s.subjectId === subjectId);
            if (!sample) return null;
            const c = SUBJECT_COLORS[colorIdx];
            return (
              <div
                key={subjectId}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] print:text-[7px] font-semibold ${c.bg} ${c.border} ${c.text}`}
              >
                <div className={`w-2 h-2 rounded-full ${c.dot} flex-shrink-0`} />
                {isAr ? sample.subjectNameAr : sample.subjectName}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
