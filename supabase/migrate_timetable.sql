-- =============================================================
-- MMPS Timetable Migration v2
-- Run this in Supabase SQL Editor ONCE.
-- Safe to re-run (all statements are idempotent).
-- =============================================================

-- ============================================================
-- 1. PERIOD SETTINGS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS period_settings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_number   INTEGER NOT NULL,
  slot_type     TEXT    NOT NULL DEFAULT 'period',
  label         TEXT    NOT NULL,
  label_ar      TEXT    NOT NULL,
  start_time    TIME    NOT NULL,
  end_time      TIME    NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slot_number)
);

-- ============================================================
-- 2. RLS for period_settings
-- ============================================================

ALTER TABLE period_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'period_settings' AND policyname = 'Authenticated users can view period_settings'
  ) THEN
    CREATE POLICY "Authenticated users can view period_settings"
      ON period_settings FOR SELECT USING (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'period_settings' AND policyname = 'Admins can manage period_settings'
  ) THEN
    CREATE POLICY "Admins can manage period_settings"
      ON period_settings FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role IN ('owner', 'admin')
        )
      );
  END IF;
END $$;

-- ============================================================
-- 3. updated_at trigger for period_settings
-- ============================================================

CREATE OR REPLACE TRIGGER period_settings_updated_at
  BEFORE UPDATE ON period_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. DEFAULT PERIOD SETTINGS
--    Typical Omani school day: 8 periods + 2 breaks
--    Edit times as needed after running.
-- ============================================================

INSERT INTO period_settings (slot_number, slot_type, label, label_ar, start_time, end_time)
VALUES
  (1,  'period', 'Period 1',      'الحصة 1',         '07:30', '08:15'),
  (2,  'period', 'Period 2',      'الحصة 2',         '08:15', '09:00'),
  (3,  'period', 'Period 3',      'الحصة 3',         '09:00', '09:45'),
  (4,  'break',  'Break 1',       'الاستراحة الأولى', '09:45', '10:00'),
  (5,  'period', 'Period 4',      'الحصة 4',         '10:00', '10:45'),
  (6,  'period', 'Period 5',      'الحصة 5',         '10:45', '11:30'),
  (7,  'prayer', 'Prayer Break',  'استراحة الصلاة',   '11:30', '11:50'),
  (8,  'period', 'Period 6',      'الحصة 6',         '11:50', '12:35'),
  (9,  'period', 'Period 7',      'الحصة 7',         '12:35', '13:20'),
  (10, 'period', 'Period 8',      'الحصة 8',         '13:20', '14:05')
ON CONFLICT (slot_number) DO NOTHING;

-- ============================================================
-- 5. UPGRADE timetable_slots TABLE
-- ============================================================

-- Add academic_year column
ALTER TABLE timetable_slots
  ADD COLUMN IF NOT EXISTS academic_year TEXT NOT NULL DEFAULT '2025-2026';

-- Add period_setting_id FK
ALTER TABLE timetable_slots
  ADD COLUMN IF NOT EXISTS period_setting_id UUID REFERENCES period_settings(id) ON DELETE SET NULL;

-- Add unique constraint (safe: checks before adding)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'timetable_slots_class_day_period_year'
  ) THEN
    ALTER TABLE timetable_slots
      ADD CONSTRAINT timetable_slots_class_day_period_year
      UNIQUE (class_subject_id, day_of_week, period, academic_year);
  END IF;
END $$;

-- Add admin manage policy for timetable_slots
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'timetable_slots' AND policyname = 'Admins can manage timetable slots'
  ) THEN
    CREATE POLICY "Admins can manage timetable slots"
      ON timetable_slots FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role IN ('owner', 'admin')
        )
      );
  END IF;
END $$;

-- ============================================================
-- Done! Check results:
-- ============================================================
SELECT 'period_settings rows:' AS info, COUNT(*) AS count FROM period_settings
UNION ALL
SELECT 'timetable_slots rows:', COUNT(*) FROM timetable_slots;
