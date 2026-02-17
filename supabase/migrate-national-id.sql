-- Migration: Add national_id to teachers and buses, populate all with random 7-9 digit numbers
-- Run this via Supabase SQL Editor

-- 1. Add national_id column to teachers table
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS national_id TEXT;

-- 2. Add driver_national_id column to buses table
ALTER TABLE buses ADD COLUMN IF NOT EXISTS driver_national_id TEXT;

-- 3. Populate students.national_id with random 7-9 digit numbers
UPDATE students
SET national_id = LPAD(
  (floor(random() * (999999999 - 1000000 + 1)) + 1000000)::TEXT,
  7 + floor(random() * 3)::INT,
  '0'
)
WHERE national_id IS NULL OR national_id = '';

-- 4. Populate teachers.national_id with random 7-9 digit numbers
UPDATE teachers
SET national_id = LPAD(
  (floor(random() * (999999999 - 1000000 + 1)) + 1000000)::TEXT,
  7 + floor(random() * 3)::INT,
  '0'
)
WHERE national_id IS NULL OR national_id = '';

-- 5. Populate buses.driver_national_id with random 7-9 digit numbers
UPDATE buses
SET driver_national_id = LPAD(
  (floor(random() * (999999999 - 1000000 + 1)) + 1000000)::TEXT,
  7 + floor(random() * 3)::INT,
  '0'
)
WHERE driver_national_id IS NULL OR driver_national_id = '';
