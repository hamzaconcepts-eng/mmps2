-- ================================================
-- MIGRATION: Add full 4-part names to teachers & bus drivers
-- Run this in Supabase SQL Editor
-- ================================================

-- ================================================
-- STEP 1: Add missing columns to teachers (if they don't exist)
-- ================================================

ALTER TABLE teachers ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS father_name_ar TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS grandfather_name TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS grandfather_name_ar TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS family_name TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS family_name_ar TEXT;

-- ================================================
-- STEP 2: Add missing columns to buses (if they don't exist)
-- ================================================

ALTER TABLE buses ADD COLUMN IF NOT EXISTS driver_father_name TEXT;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS driver_father_name_ar TEXT;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS driver_grandfather_name TEXT;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS driver_grandfather_name_ar TEXT;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS driver_family_name TEXT;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS driver_family_name_ar TEXT;
ALTER TABLE buses ADD COLUMN IF NOT EXISTS driver_photo_url TEXT;

-- ================================================
-- STEP 3: Populate teacher name data (all 32 teachers)
-- ================================================

UPDATE teachers SET
  father_name = 'Mohammed', father_name_ar = 'محمد',
  grandfather_name = 'Khalfan', grandfather_name_ar = 'خلفان',
  family_name = 'Al Balushi', family_name_ar = 'البلوشي'
WHERE employee_id = 'TCH-001';

UPDATE teachers SET
  father_name = 'Ali', father_name_ar = 'علي',
  grandfather_name = 'Hilal', grandfather_name_ar = 'هلال',
  family_name = 'Al Harthi', family_name_ar = 'الحارثي'
WHERE employee_id = 'TCH-002';

UPDATE teachers SET
  father_name = 'Salim', father_name_ar = 'سالم',
  grandfather_name = 'Mohammed', grandfather_name_ar = 'محمد',
  family_name = 'Al Rashdi', family_name_ar = 'الراشدي'
WHERE employee_id = 'TCH-003';

UPDATE teachers SET
  father_name = 'Said', father_name_ar = 'سعيد',
  grandfather_name = 'Ali', grandfather_name_ar = 'علي',
  family_name = 'Al Busaidi', family_name_ar = 'البوسعيدي'
WHERE employee_id = 'TCH-004';

UPDATE teachers SET
  father_name = 'Nasser', father_name_ar = 'ناصر',
  grandfather_name = 'Hamad', grandfather_name_ar = 'حمد',
  family_name = 'Al Kindi', family_name_ar = 'الكندي'
WHERE employee_id = 'TCH-005';

UPDATE teachers SET
  father_name = 'Khalid', father_name_ar = 'خالد',
  grandfather_name = 'Salim', grandfather_name_ar = 'سالم',
  family_name = 'Al Wahaibi', family_name_ar = 'الوهيبي'
WHERE employee_id = 'TCH-006';

UPDATE teachers SET
  father_name = 'Ahmed', father_name_ar = 'أحمد',
  grandfather_name = 'Nasser', grandfather_name_ar = 'ناصر',
  family_name = 'Al Mahrouqi', family_name_ar = 'المحروقي'
WHERE employee_id = 'TCH-007';

UPDATE teachers SET
  father_name = 'Ibrahim', father_name_ar = 'إبراهيم',
  grandfather_name = 'Said', grandfather_name_ar = 'سعيد',
  family_name = 'Al Maskari', family_name_ar = 'المسكري'
WHERE employee_id = 'TCH-008';

UPDATE teachers SET
  father_name = 'Hamad', father_name_ar = 'حمد',
  grandfather_name = 'Ahmed', grandfather_name_ar = 'أحمد',
  family_name = 'Al Habsi', family_name_ar = 'الحبسي'
WHERE employee_id = 'TCH-009';

UPDATE teachers SET
  father_name = 'Abdullah', father_name_ar = 'عبدالله',
  grandfather_name = 'Ibrahim', grandfather_name_ar = 'إبراهيم',
  family_name = 'Al Siyabi', family_name_ar = 'السيابي'
WHERE employee_id = 'TCH-010';

UPDATE teachers SET
  father_name = 'Rashid', father_name_ar = 'راشد',
  grandfather_name = 'Sultan', grandfather_name_ar = 'سلطان',
  family_name = 'Al Naamani', family_name_ar = 'النعماني'
WHERE employee_id = 'TCH-011';

UPDATE teachers SET
  father_name = 'Sultan', father_name_ar = 'سلطان',
  grandfather_name = 'Rashid', grandfather_name_ar = 'راشد',
  family_name = 'Al Farsi', family_name_ar = 'الفارسي'
WHERE employee_id = 'TCH-012';

UPDATE teachers SET
  father_name = 'Yusuf', father_name_ar = 'يوسف',
  grandfather_name = 'Khalid', grandfather_name_ar = 'خالد',
  family_name = 'Al Rawahi', family_name_ar = 'الرواحي'
WHERE employee_id = 'TCH-013';

UPDATE teachers SET
  father_name = 'Omar', father_name_ar = 'عمر',
  grandfather_name = 'Abdullah', grandfather_name_ar = 'عبدالله',
  family_name = 'Al Hosni', family_name_ar = 'الحسني'
WHERE employee_id = 'TCH-014';

UPDATE teachers SET
  father_name = 'Hassan', father_name_ar = 'حسن',
  grandfather_name = 'Omar', grandfather_name_ar = 'عمر',
  family_name = 'Al Lawati', family_name_ar = 'اللواتي'
WHERE employee_id = 'TCH-015';

UPDATE teachers SET
  father_name = 'Majid', father_name_ar = 'ماجد',
  grandfather_name = 'Yusuf', grandfather_name_ar = 'يوسف',
  family_name = 'Al Ghafri', family_name_ar = 'الغافري'
WHERE employee_id = 'TCH-016';

UPDATE teachers SET
  father_name = 'Hamed', father_name_ar = 'حامد',
  grandfather_name = 'Hassan', grandfather_name_ar = 'حسن',
  family_name = 'Al Hinai', family_name_ar = 'الهنائي'
WHERE employee_id = 'TCH-017';

UPDATE teachers SET
  father_name = 'Suleiman', father_name_ar = 'سليمان',
  grandfather_name = 'Majid', grandfather_name_ar = 'ماجد',
  family_name = 'Al Amri', family_name_ar = 'العامري'
WHERE employee_id = 'TCH-018';

UPDATE teachers SET
  father_name = 'Mubarak', father_name_ar = 'مبارك',
  grandfather_name = 'Hamed', grandfather_name_ar = 'حامد',
  family_name = 'Al Zadjali', family_name_ar = 'الزدجالي'
WHERE employee_id = 'TCH-019';

UPDATE teachers SET
  father_name = 'Saif', father_name_ar = 'سيف',
  grandfather_name = 'Suleiman', grandfather_name_ar = 'سليمان',
  family_name = 'Al Shukaili', family_name_ar = 'الشكيلي'
WHERE employee_id = 'TCH-020';

UPDATE teachers SET
  father_name = 'Khalfan', father_name_ar = 'خلفان',
  grandfather_name = 'Saif', grandfather_name_ar = 'سيف',
  family_name = 'Al Kharousi', family_name_ar = 'الخروصي'
WHERE employee_id = 'TCH-021';

UPDATE teachers SET
  father_name = 'Hilal', father_name_ar = 'هلال',
  grandfather_name = 'Mubarak', grandfather_name_ar = 'مبارك',
  family_name = 'Al Shamsi', family_name_ar = 'الشامسي'
WHERE employee_id = 'TCH-022';

UPDATE teachers SET
  father_name = 'Badr', father_name_ar = 'بدر',
  grandfather_name = 'Badr', grandfather_name_ar = 'بدر',
  family_name = 'Al Jabri', family_name_ar = 'الجابري'
WHERE employee_id = 'TCH-023';

UPDATE teachers SET
  father_name = 'Harith', father_name_ar = 'حارث',
  grandfather_name = 'Fahad', grandfather_name_ar = 'فهد',
  family_name = 'Al Riyami', family_name_ar = 'الريامي'
WHERE employee_id = 'TCH-024';

UPDATE teachers SET
  father_name = 'Fahad', father_name_ar = 'فهد',
  grandfather_name = 'Harith', grandfather_name_ar = 'حارث',
  family_name = 'Al Tobi', family_name_ar = 'الطوبي'
WHERE employee_id = 'TCH-025';

UPDATE teachers SET
  father_name = 'Amer', father_name_ar = 'عامر',
  grandfather_name = 'Amer', grandfather_name_ar = 'عامر',
  family_name = 'Al Harrasi', family_name_ar = 'الحراصي'
WHERE employee_id = 'TCH-026';

UPDATE teachers SET
  father_name = 'Talal', father_name_ar = 'طلال',
  grandfather_name = 'Talal', grandfather_name_ar = 'طلال',
  family_name = 'Al Mamari', family_name_ar = 'المعمري'
WHERE employee_id = 'TCH-027';

UPDATE teachers SET
  father_name = 'Mansour', father_name_ar = 'منصور',
  grandfather_name = 'Mansour', grandfather_name_ar = 'منصور',
  family_name = 'Al Battashi', family_name_ar = 'البطاشي'
WHERE employee_id = 'TCH-028';

UPDATE teachers SET
  father_name = 'Mohammed', father_name_ar = 'محمد',
  grandfather_name = 'Khalfan', grandfather_name_ar = 'خلفان',
  family_name = 'Al Saadi', family_name_ar = 'السعدي'
WHERE employee_id = 'TCH-029';

UPDATE teachers SET
  father_name = 'Ali', father_name_ar = 'علي',
  grandfather_name = 'Hilal', grandfather_name_ar = 'هلال',
  family_name = 'Al Qasmi', family_name_ar = 'القاسمي'
WHERE employee_id = 'TCH-030';

UPDATE teachers SET
  father_name = 'Salim', father_name_ar = 'سالم',
  grandfather_name = 'Mohammed', grandfather_name_ar = 'محمد',
  family_name = 'Al Maqbali', family_name_ar = 'المقبالي'
WHERE employee_id = 'TCH-031';

UPDATE teachers SET
  father_name = 'Said', father_name_ar = 'سعيد',
  grandfather_name = 'Ali', grandfather_name_ar = 'علي',
  family_name = 'Al Khusaibi', family_name_ar = 'الخصيبي'
WHERE employee_id = 'TCH-032';

-- ================================================
-- STEP 4: Populate bus driver name data (all 12 buses)
-- ================================================

UPDATE buses SET
  driver_father_name = 'Khalid', driver_father_name_ar = 'خالد',
  driver_grandfather_name = 'Nasser', driver_grandfather_name_ar = 'ناصر',
  driver_family_name = 'Al Balushi', driver_family_name_ar = 'البلوشي',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver01'
WHERE bus_number = 'BUS-01';

UPDATE buses SET
  driver_father_name = 'Ali', driver_father_name_ar = 'علي',
  driver_grandfather_name = 'Mohammed', driver_grandfather_name_ar = 'محمد',
  driver_family_name = 'Al Harthi', driver_family_name_ar = 'الحارثي',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver02'
WHERE bus_number = 'BUS-02';

UPDATE buses SET
  driver_father_name = 'Said', driver_father_name_ar = 'سعيد',
  driver_grandfather_name = 'Ibrahim', driver_grandfather_name_ar = 'إبراهيم',
  driver_family_name = 'Al Rashdi', driver_family_name_ar = 'الراشدي',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver03'
WHERE bus_number = 'BUS-03';

UPDATE buses SET
  driver_father_name = 'Hamad', driver_father_name_ar = 'حمد',
  driver_grandfather_name = 'Salim', driver_grandfather_name_ar = 'سالم',
  driver_family_name = 'Al Farsi', driver_family_name_ar = 'الفارسي',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver04'
WHERE bus_number = 'BUS-04';

UPDATE buses SET
  driver_father_name = 'Ahmed', driver_father_name_ar = 'أحمد',
  driver_grandfather_name = 'Khalfan', driver_grandfather_name_ar = 'خلفان',
  driver_family_name = 'Al Kindi', driver_family_name_ar = 'الكندي',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver05'
WHERE bus_number = 'BUS-05';

UPDATE buses SET
  driver_father_name = 'Nasser', driver_father_name_ar = 'ناصر',
  driver_grandfather_name = 'Ali', driver_grandfather_name_ar = 'علي',
  driver_family_name = 'Al Wahaibi', driver_family_name_ar = 'الوهيبي',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver06'
WHERE bus_number = 'BUS-06';

UPDATE buses SET
  driver_father_name = 'Sultan', driver_father_name_ar = 'سلطان',
  driver_grandfather_name = 'Rashid', driver_grandfather_name_ar = 'راشد',
  driver_family_name = 'Al Mahrouqi', driver_family_name_ar = 'المحروقي',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver07'
WHERE bus_number = 'BUS-07';

UPDATE buses SET
  driver_father_name = 'Abdullah', driver_father_name_ar = 'عبدالله',
  driver_grandfather_name = 'Hassan', driver_grandfather_name_ar = 'حسن',
  driver_family_name = 'Al Busaidi', driver_family_name_ar = 'البوسعيدي',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver08'
WHERE bus_number = 'BUS-08';

UPDATE buses SET
  driver_father_name = 'Ibrahim', driver_father_name_ar = 'إبراهيم',
  driver_grandfather_name = 'Majid', driver_grandfather_name_ar = 'ماجد',
  driver_family_name = 'Al Habsi', driver_family_name_ar = 'الحبسي',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver09'
WHERE bus_number = 'BUS-09';

UPDATE buses SET
  driver_father_name = 'Yusuf', driver_father_name_ar = 'يوسف',
  driver_grandfather_name = 'Suleiman', driver_grandfather_name_ar = 'سليمان',
  driver_family_name = 'Al Siyabi', driver_family_name_ar = 'السيابي',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver10'
WHERE bus_number = 'BUS-10';

UPDATE buses SET
  driver_father_name = 'Omar', driver_father_name_ar = 'عمر',
  driver_grandfather_name = 'Khalfan', driver_grandfather_name_ar = 'خلفان',
  driver_family_name = 'Al Naamani', driver_family_name_ar = 'النعماني',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver11'
WHERE bus_number = 'BUS-11';

UPDATE buses SET
  driver_father_name = 'Hassan', driver_father_name_ar = 'حسن',
  driver_grandfather_name = 'Hilal', driver_grandfather_name_ar = 'هلال',
  driver_family_name = 'Al Rawahi', driver_family_name_ar = 'الرواحي',
  driver_photo_url = 'https://i.pravatar.cc/200?u=driver12'
WHERE bus_number = 'BUS-12';

-- ================================================
-- VERIFICATION: Check the data was populated
-- ================================================

SELECT employee_id, first_name, father_name, grandfather_name, family_name
FROM teachers
ORDER BY employee_id
LIMIT 5;

SELECT bus_number, driver_name, driver_father_name, driver_grandfather_name, driver_family_name
FROM buses
ORDER BY bus_number
LIMIT 5;
