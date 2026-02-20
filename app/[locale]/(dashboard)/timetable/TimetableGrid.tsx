'use client';

import React, { useRef } from 'react';
import { Printer } from 'lucide-react';

// ─── Subject colour palette (20 distinct colours) ───────────────────────────
const SUBJECT_COLORS = [
  { bg: 'bg-[#4F46E5]/10', border: 'border-[#4F46E5]/40', text: 'text-[#4F46E5]', dot: 'bg-[#4F46E5]', print: '#EEF2FF' },
  { bg: 'bg-[#0D9488]/10', border: 'border-[#0D9488]/40', text: 'text-[#0D9488]', dot: 'bg-[#0D9488]', print: '#CCFBF1' },
  { bg: 'bg-[#D97706]/10', border: 'border-[#D97706]/40', text: 'text-[#D97706]', dot: 'bg-[#D97706]', print: '#FEF3C7' },
  { bg: 'bg-[#DC2626]/10', border: 'border-[#DC2626]/40', text: 'text-[#DC2626]', dot: 'bg-[#DC2626]', print: '#FEE2E2' },
  { bg: 'bg-[#7C3AED]/10', border: 'border-[#7C3AED]/40', text: 'text-[#7C3AED]', dot: 'bg-[#7C3AED]', print: '#EDE9FE' },
  { bg: 'bg-[#DB2777]/10', border: 'border-[#DB2777]/40', text: 'text-[#DB2777]', dot: 'bg-[#DB2777]', print: '#FCE7F3' },
  { bg: 'bg-[#059669]/10', border: 'border-[#059669]/40', text: 'text-[#059669]', dot: 'bg-[#059669]', print: '#D1FAE5' },
  { bg: 'bg-[#0284C7]/10', border: 'border-[#0284C7]/40', text: 'text-[#0284C7]', dot: 'bg-[#0284C7]', print: '#E0F2FE' },
  { bg: 'bg-[#C2410C]/10', border: 'border-[#C2410C]/40', text: 'text-[#C2410C]', dot: 'bg-[#C2410C]', print: '#FFEDD5' },
  { bg: 'bg-[#0E7490]/10', border: 'border-[#0E7490]/40', text: 'text-[#0E7490]', dot: 'bg-[#0E7490]', print: '#CFFAFE' },
  { bg: 'bg-[#6D28D9]/10', border: 'border-[#6D28D9]/40', text: 'text-[#6D28D9]', dot: 'bg-[#6D28D9]', print: '#F3E8FF' },
  { bg: 'bg-[#B45309]/10', border: 'border-[#B45309]/40', text: 'text-[#B45309]', dot: 'bg-[#B45309]', print: '#FEF9C3' },
  { bg: 'bg-[#0F766E]/10', border: 'border-[#0F766E]/40', text: 'text-[#0F766E]', dot: 'bg-[#0F766E]', print: '#CCFBF1' },
  { bg: 'bg-[#BE185D]/10', border: 'border-[#BE185D]/40', text: 'text-[#BE185D]', dot: 'bg-[#BE185D]', print: '#FCE7F3' },
  { bg: 'bg-[#1D4ED8]/10', border: 'border-[#1D4ED8]/40', text: 'text-[#1D4ED8]', dot: 'bg-[#1D4ED8]', print: '#DBEAFE' },
  { bg: 'bg-[#047857]/10', border: 'border-[#047857]/40', text: 'text-[#047857]', dot: 'bg-[#047857]', print: '#D1FAE5' },
  { bg: 'bg-[#9D174D]/10', border: 'border-[#9D174D]/40', text: 'text-[#9D174D]', dot: 'bg-[#9D174D]', print: '#FFE4E6' },
  { bg: 'bg-[#6B21A8]/10', border: 'border-[#6B21A8]/40', text: 'text-[#6B21A8]', dot: 'bg-[#6B21A8]', print: '#F3E8FF' },
  { bg: 'bg-[#991B1B]/10', border: 'border-[#991B1B]/40', text: 'text-[#991B1B]', dot: 'bg-[#991B1B]', print: '#FEE2E2' },
  { bg: 'bg-[#064E3B]/10', border: 'border-[#064E3B]/40', text: 'text-[#064E3B]', dot: 'bg-[#064E3B]', print: '#ECFDF5' },
];

export interface TimetableSlot {
  id: string;
  day_of_week: number;   // 0=Sun … 4=Thu
  period: number;         // 1-based teaching period index
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
  period_number: number;
  start_time: string;
  end_time: string;
  label: string;
  label_ar: string;
}

export interface BreakInfo {
  after_period: number;
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
  /** Title shown in print header e.g. "Grade 3-A Weekly Timetable" */
  printTitle?: string;
  schoolName?: string;
  academicYear?: string;
  labels: {
    days: string[];
    period: string;
    noTimetable: string;
    free: string;
    break: string;
    prayer: string;
  };
}

/** Deterministic color index derived from a subject's UUID.
 *  The same subject always maps to the same palette slot regardless of
 *  which timetable view renders it (class / teacher / embedded). */
function getSubjectColorIndex(subjectId: string): number {
  let hash = 0;
  for (let i = 0; i < subjectId.length; i++) {
    const char = subjectId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // keep within 32-bit int range
  }
  return Math.abs(hash) % SUBJECT_COLORS.length;
}

function fmt(time: string) {
  const [h, m] = time.split(':');
  const hNum = parseInt(h);
  const ampm = hNum < 12 ? 'AM' : 'PM';
  const h12 = hNum % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

// ─── Free Period Cell ─────────────────────────────────────────────────────────
function FreePeriodCell({ label }: { label: string }) {
  return (
    <td className="border border-gray-100 p-1 min-w-[90px] print:min-w-0 print:p-0.5">
      <div
        className="h-14 print:h-10 rounded border border-dashed border-gray-200 flex items-center justify-center"
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <span className="text-[9px] print:text-[7px] text-gray-300 font-medium">{label}</span>
      </div>
    </td>
  );
}

// ─── Subject Cell ─────────────────────────────────────────────────────────────
function SlotCell({
  slot,
  color,
  mode,
  isAr,
}: {
  slot: TimetableSlot;
  color: (typeof SUBJECT_COLORS)[0];
  mode: 'class' | 'teacher' | 'room';
  isAr: boolean;
}) {
  const name = isAr ? slot.subjectNameAr : slot.subjectName;
  return (
    <td className="border border-gray-100 p-1 min-w-[90px] print:min-w-0 print:p-0.5">
      <div
        className={`h-14 print:h-10 rounded border px-1.5 py-1 flex flex-col justify-center overflow-hidden ${color.bg} ${color.border}`}
        style={{
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
          backgroundColor: color.print, // fallback for print
        } as React.CSSProperties}
      >
        <p className={`text-[10px] font-bold leading-tight truncate ${color.text}`}>
          {name}
        </p>
        <p className="text-[8px] text-gray-400 font-mono leading-tight">
          {slot.subjectCode}
        </p>
        {mode !== 'class' && slot.className && (
          <p className="text-[8px] text-gray-500 leading-tight truncate">{slot.className}</p>
        )}
      </div>
    </td>
  );
}

// ─── Main Grid ────────────────────────────────────────────────────────────────
export default function TimetableGrid({
  slots, periods, breaks, locale, mode, labels, printTitle, schoolName, academicYear,
}: Props) {
  const isAr = locale === 'ar';
  const DAYS = [0, 1, 2, 3, 4];
  const dayIndices = isAr ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4];

  // Build fast lookup: day → period → slot
  const lookup: Record<number, Record<number, TimetableSlot>> = {};
  for (const d of DAYS) lookup[d] = {};
  for (const s of slots) {
    lookup[s.day_of_week][s.period] = s;
  }

  if (periods.length === 0) {
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
    while (periodCursor < periods.length && periods[periodCursor].period_number <= b.after_period) {
      rows.push({ type: 'period', info: periods[periodCursor] });
      periodCursor++;
    }
    rows.push({ type: b.slot_type, info: b });
  }
  while (periodCursor < periods.length) {
    rows.push({ type: 'period', info: periods[periodCursor] });
    periodCursor++;
  }
  if (breaks.length === 0) {
    rows.length = 0;
    for (const p of periods) rows.push({ type: 'period', info: p });
  }

  const timetableRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const el = timetableRef.current;
    if (!el) { window.print(); return; }

    // ── 1. Inline all same-origin CSS (avoids async stylesheet loading) ──
    const cssRules: string[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        for (const rule of Array.from(sheet.cssRules)) {
          cssRules.push(rule.cssText);
        }
      } catch { /* cross-origin — skip */ }
    }

    // Keep Google Fonts link for @font-face file loading
    const fontLinks = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
      .filter(l => l.href.includes('fonts.googleapis.com') || l.href.includes('fonts.gstatic.com'))
      .map(l => `<link rel="stylesheet" href="${l.href}">`)
      .join('\n');

    // ── 2. Open print window ──
    const win = window.open('', '_blank', 'width=1200,height=900');
    if (!win) { window.print(); return; }

    // Write minimal HTML (CSS injected programmatically to avoid template-literal issues)
    win.document.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Timetable</title>' +
      fontLinks +
      '</head><body><div id="tt-scaled">' +
      el.outerHTML +
      '</div></body></html>'
    );
    win.document.close();

    // ── 3. Inject CSS programmatically (sync — no network delay) ──
    const appStyle = win.document.createElement('style');
    appStyle.textContent = cssRules.join('\n');
    win.document.head.appendChild(appStyle);

    const overrides = win.document.createElement('style');
    overrides.textContent = [
      // Let Chrome handle pagination naturally — NO overflow:hidden, NO fixed height
      '@page { size: A4 landscape; margin: 10mm; }',
      '*, *::before, *::after { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }',
      'html, body { margin: 0; padding: 0; background: white; width: 277mm; max-width: 277mm; font-family: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif; }',
      // Visibility
      '[class*="print:block"]  { display: block !important; }',
      '[class*="print:flex"]   { display: flex  !important; }',
      '[class*="print:hidden"] { display: none  !important; }',
      '.hidden:not([class*="print:block"]):not([class*="print:flex"]) { display: none !important; }',
      // Layout resets
      '.overflow-x-auto, .overflow-hidden, .timetable-grid-wrap { overflow: visible !important; }',
      '.h-screen { height: auto !important; }',
      '[class*="h-14"],[class*="h-10"],[class*="h-12"],[class*="h-16"] { height: auto !important; }',
      // Print header
      '.border-gray-800 { border-color: #1f2937 !important; padding-bottom: 5pt !important; margin-bottom: 7pt !important; }',
      '.border-gray-800 img { width: 36px !important; height: 36px !important; }',
      '.border-gray-800 p { white-space: normal !important; margin: 0 !important; }',
      '.border-gray-800 p:first-child { font-size: 13pt !important; font-weight: 800 !important; color: #111 !important; }',
      '.border-gray-800 p:last-child  { font-size: 9pt !important; color: #555 !important; }',
      // Table
      '.timetable-grid-wrap table { width: 100% !important; table-layout: fixed !important; border-collapse: collapse !important; }',
      '.timetable-grid-wrap th { font-size: 10pt !important; font-weight: 700 !important; padding: 5pt 3pt !important; border: 0.75pt solid #aaa !important; text-align: center !important; }',
      '.timetable-grid-wrap td { padding: 2pt !important; border: 0.5pt solid #ccc !important; height: auto !important; vertical-align: middle !important; }',
      '.timetable-grid-wrap td > div { height: auto !important; min-height: 30pt !important; padding: 3pt 5pt !important; overflow: visible !important; border-radius: 3pt !important; display: flex !important; flex-direction: column !important; justify-content: center !important; gap: 1pt !important; }',
      '.timetable-grid-wrap td > div > p { margin: 0 !important; overflow: visible !important; text-overflow: unset !important; white-space: normal !important; word-break: break-word !important; line-height: 1.3 !important; }',
      '.timetable-grid-wrap td > div > p:first-child  { font-size: 9pt !important; font-weight: 700 !important; }',
      '.timetable-grid-wrap td > div > p:nth-child(2)  { font-size: 7.5pt !important; font-family: monospace !important; }',
      '.timetable-grid-wrap td > div > p:nth-child(n+3){ font-size: 8pt !important; }',
      '.timetable-grid-wrap td > div > span { font-size: 7.5pt !important; }',
      '.timetable-grid-wrap td:first-child > div { text-align: center !important; background-color: #f9fafb !important; }',
      '.timetable-grid-wrap td:first-child > div > span { display: block !important; overflow: visible !important; white-space: normal !important; }',
      '.timetable-grid-wrap td:first-child > div > span:first-child      { font-size: 8pt !important; font-weight: 700 !important; }',
      '.timetable-grid-wrap td:first-child > div > span:not(:first-child) { font-size: 7pt !important; }',
      '.timetable-grid-wrap td[colspan] > div { min-height: 13pt !important; padding: 2pt 8pt !important; font-size: 8.5pt !important; font-weight: 600 !important; }',
      '.truncate { overflow: visible !important; text-overflow: unset !important; white-space: normal !important; }',
      '.border-t { border-top: 0.5pt solid #e5e7eb !important; }',
    ].join('\n');
    win.document.head.appendChild(overrides);

    // ── 4. Wait for fonts + layout, measure, zoom to fit A4 landscape, then print ──
    const fontsReady = win.document.fonts ? win.document.fonts.ready : Promise.resolve();
    fontsReady.then(() => {
      win.requestAnimationFrame(() => {
        win.requestAnimationFrame(() => {
          const content = win.document.getElementById('tt-scaled');
          if (!content) return;

          // 190mm printable height at 96dpi ≈ 718px
          const availH = 190 * (96 / 25.4); // exact: 718.11px
          const cH = content.scrollHeight;

          if (cH > availH) {
            const scale = availH / cH;
            // Inject zoom via stylesheet (more reliable for print than inline style)
            const zoomStyle = win.document.createElement('style');
            zoomStyle.textContent = '#tt-scaled { zoom: ' + scale.toFixed(5) + '; }';
            win.document.head.appendChild(zoomStyle);
          }

          // Extra rAF after zoom injection to let layout recompute
          win.requestAnimationFrame(() => {
            setTimeout(() => {
              win.print();
              win.addEventListener('afterprint', () => win.close());
            }, 300);
          });
        });
      });
    });
  };

  return (
    <div ref={timetableRef}>
      {/* Print button — screen only */}
      <div className="flex items-center justify-end mb-2 print:hidden gap-2">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-[11px] font-semibold text-text-secondary hover:border-brand-teal/40 hover:text-brand-teal hover:bg-brand-teal/5 transition-all shadow-sm"
        >
          <Printer size={13} />
          Print
        </button>
      </div>

      {/* Print-only header: school logo + name + timetable title */}
      {printTitle && (
        <div className="hidden print:block mb-4">
          <div className="flex items-center gap-3 pb-3 mb-3 border-b-2 border-gray-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={44} height={44} />
            <div>
              <p className="text-[14px] font-extrabold text-black leading-tight">
                {schoolName || 'Mashaail Muscat Private School'}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">
                {printTitle}{academicYear ? ` · ${academicYear}` : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="overflow-x-auto timetable-grid-wrap">
        <table
          className="w-full border-collapse text-left"
          dir={isAr ? 'rtl' : 'ltr'}
          style={{ tableLayout: 'fixed' }}
        >
          <thead>
            <tr>
              <th className="border border-gray-200 bg-gray-50 p-2 print:p-1 text-[10px] print:text-[7px] font-semibold text-text-secondary w-20 print:w-14 text-center">
                {labels.period}
              </th>
              {dayIndices.map((d) => (
                <th
                  key={d}
                  className="border border-gray-200 bg-gradient-to-b from-brand-teal/15 to-brand-teal/5 p-2 print:p-1 text-[11px] print:text-[8px] font-bold text-brand-teal text-center"
                  style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact', backgroundColor: '#E0F7FA' } as React.CSSProperties}
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
                          isPrayer ? 'bg-amber-50 text-amber-700' : 'bg-gray-100/80 text-gray-500'
                        }`}
                        style={{
                          printColorAdjust: 'exact',
                          WebkitPrintColorAdjust: 'exact',
                          backgroundColor: isPrayer ? '#FFFBEB' : '#F3F4F6',
                        } as React.CSSProperties}
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
                  <td className="border border-gray-100 bg-gray-50/50 p-1.5 print:p-1 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] print:text-[7px] font-bold text-text-secondary">
                        {isAr ? p.label_ar : p.label}
                      </span>
                      <span className="text-[8px] print:text-[6px] font-mono text-text-tertiary mt-0.5 leading-tight">
                        {fmt(p.start_time)}
                      </span>
                      <span className="text-[8px] print:text-[6px] font-mono text-text-tertiary leading-tight">
                        {fmt(p.end_time)}
                      </span>
                    </div>
                  </td>

                  {dayIndices.map((d) => {
                    const slot = lookup[d]?.[p.period_number] ?? null;
                    if (!slot) {
                      return <FreePeriodCell key={d} label={labels.free} />;
                    }
                    return (
                      <SlotCell
                        key={d}
                        slot={slot}
                        color={SUBJECT_COLORS[getSubjectColorIndex(slot.subjectId)]}
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
      </div>

      {/* Subject + teacher reference legend */}
      {slots.length > 0 && (
        <div className="mt-3 print:mt-2 border-t border-gray-100 pt-2">
          <p className="text-[9px] font-semibold text-text-secondary uppercase tracking-wide mb-1.5 print:mb-1">
            {mode === 'teacher' ? (isAr ? 'المواد' : 'Subjects') : (isAr ? 'المواد والمعلمون' : 'Subjects & Teachers')}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 print:gap-x-3 print:gap-y-0.5">
            {Array.from(new Map(slots.map((s) => [s.subjectId, s])).values()).map((sample) => {
              const c = SUBJECT_COLORS[getSubjectColorIndex(sample.subjectId)];
              const extra = mode !== 'teacher' ? sample.teacherName : sample.className;
              return (
                <div key={sample.subjectId} className="flex items-center gap-1.5 text-[9px] print:text-[8px]">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`}
                    style={{ backgroundColor: c.print, printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' } as React.CSSProperties}
                  />
                  <span className={`font-semibold ${c.text}`}>{isAr ? sample.subjectNameAr : sample.subjectName}</span>
                  {extra && (
                    <>
                      <span className="text-gray-300">—</span>
                      <span className="text-gray-500">{extra}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
