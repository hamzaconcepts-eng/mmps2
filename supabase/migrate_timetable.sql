-- =============================================================
-- MMPS Timetable Migration
-- Run this in Supabase SQL Editor ONCE.
-- Creates: period_settings table + updates timetable_slots structure
-- =============================================================

-- ============================================================
-- 1. PERIOD SETTINGS TABLE
-- Stores the time slots (periods + breaks) for the school day.
-- ============================================================

CREATE TABLE IF NOT EXISTS period_settings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_number   INTEGER NOT NULL,          -- ordering: 1, 2, 3 … (includes breaks)
  slot_type     TEXT    NOT NULL DEFAULT 'period', -- 'period' | 'break' | 'prayer'
  label         TEXT    NOT NULL,          -- e.g. "Period 1"
  label_ar      TEXT    NOT NULL,          -- e.g. "الحصة 1"
  start_time    TIME    NOT NULL,
  end_time      TIME    NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slot_number)
);

-- RLS
ALTER TABLE period_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view period_settings"
  ON period_settings FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage period_settings"
  ON period_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER period_settings_updated_at
  BEFORE UPDATE ON period_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 2. DEFAULT PERIOD SETTINGS — Typical Omani school day
--    8 teaching periods + Break 1 + Prayer Break
-- ============================================================

INSERT INTO period_settings (slot_number, slot_type, label, label_ar, start_time, end_time)
VALUES
  (1,  'period', 'Period 1',      'الحصة 1',      '07:30', '08:15'),
  (2,  'period', 'Period 2',      'الحصة 2',      '08:15', '09:00'),
  (3,  'period', 'Period 3',      'الحصة 3',      '09:00', '09:45'),
  (4,  'break',  'Break',         'استراحة',       '09:45', '10:00'),
  (5,  'period', 'Period 4',      'الحصة 4',      '10:00', '10:45'),
  (6,  'period', 'Period 5',      'الحصة 5',      '10:45', '11:30'),
  (7,  'prayer', 'Prayer Break',  'استراحة الصلاة','11:30', '11:50'),
  (8,  'period', 'Period 6',      'الحصة 6',      '11:50', '12:35'),
  (9,  'period', 'Period 7',      'الحصة 7',      '12:35', '13:20'),
  (10, 'period', 'Period 8',      'الحصة 8',      '13:20', '14:05')
ON CONFLICT (slot_number) DO NOTHING;

-- ============================================================
-- 3. UPGRADE timetable_slots TABLE
--    The existing schema stores start_time/end_time directly.
--    We add:  academic_year, period_setting_id (optional link)
--    and a proper unique constraint.
-- ============================================================

-- Add academic_year column (if not present)
ALTER TABLE timetable_slots
  ADD COLUMN IF NOT EXISTS academic_year TEXT NOT NULL DEFAULT '2025-2026';

-- Add optional FK to period_settings (for lookup; period column stays)
ALTER TABLE timetable_slots
  ADD COLUMN IF NOT EXISTS period_setting_id UUID REFERENCES period_settings(id) ON DELETE SET NULL;

-- Add unique constraint so we can't double-book a class slot
-- (If the constraint already exists this is a no-op thanks to IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'timetable_slots_class_day_period_year'
  ) THEN
    ALTER TABLE timetable_slots
      ADD CONSTRAINT timetable_slots_class_day_period_year
      UNIQUE (class_subject_id, day_of_week, period, academic_year);
  END IF;
END $$;

-- Add manage policy for timetable_slots (admins)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'timetable_slots'
    AND policyname = 'Admins can manage timetable slots'
  ) THEN
    EXECUTE '
      CREATE POLICY "Admins can manage timetable slots"
        ON timetable_slots FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN (''owner'', ''admin'')
          )
        )
    ';
  END IF;
END $$;

-- Done!
SELECT 'Migration complete. Period settings inserted:' AS status,
       COUNT(*) AS total_slots
FROM period_settings;
