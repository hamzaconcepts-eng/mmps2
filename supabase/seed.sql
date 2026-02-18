-- ================================================
-- Mashaail School Management System - Seed Data
-- Academic Year: 2025-2026
-- Location: Seeb, Muscat, Oman
-- ================================================

-- ================================================
-- 1. FACILITIES (20 classrooms + 5 shared)
-- ================================================

-- Grade levels: -1=KG1, 0=KG2, 1-8=Grade1-8
-- Classrooms (dedicated, one per section)
INSERT INTO facilities (name, name_ar, code, type, capacity, is_shared) VALUES
  ('KG-1 A Classroom', 'فصل روضة أولى أ', 'CR-KG1A', 'classroom', 25, false),
  ('KG-1 B Classroom', 'فصل روضة أولى ب', 'CR-KG1B', 'classroom', 25, false),
  ('KG-2 A Classroom', 'فصل روضة ثانية أ', 'CR-KG2A', 'classroom', 25, false),
  ('KG-2 B Classroom', 'فصل روضة ثانية ب', 'CR-KG2B', 'classroom', 25, false),
  ('Grade 1 A Classroom', 'فصل الصف الأول أ', 'CR-G1A', 'classroom', 25, false),
  ('Grade 1 B Classroom', 'فصل الصف الأول ب', 'CR-G1B', 'classroom', 25, false),
  ('Grade 2 A Classroom', 'فصل الصف الثاني أ', 'CR-G2A', 'classroom', 25, false),
  ('Grade 2 B Classroom', 'فصل الصف الثاني ب', 'CR-G2B', 'classroom', 25, false),
  ('Grade 3 A Classroom', 'فصل الصف الثالث أ', 'CR-G3A', 'classroom', 25, false),
  ('Grade 3 B Classroom', 'فصل الصف الثالث ب', 'CR-G3B', 'classroom', 25, false),
  ('Grade 4 A Classroom', 'فصل الصف الرابع أ', 'CR-G4A', 'classroom', 25, false),
  ('Grade 4 B Classroom', 'فصل الصف الرابع ب', 'CR-G4B', 'classroom', 25, false),
  ('Grade 5 A Classroom', 'فصل الصف الخامس أ', 'CR-G5A', 'classroom', 25, false),
  ('Grade 5 B Classroom', 'فصل الصف الخامس ب', 'CR-G5B', 'classroom', 25, false),
  ('Grade 6 A Classroom', 'فصل الصف السادس أ', 'CR-G6A', 'classroom', 25, false),
  ('Grade 6 B Classroom', 'فصل الصف السادس ب', 'CR-G6B', 'classroom', 25, false),
  ('Grade 7 A Classroom', 'فصل الصف السابع أ', 'CR-G7A', 'classroom', 25, false),
  ('Grade 7 B Classroom', 'فصل الصف السابع ب', 'CR-G7B', 'classroom', 25, false),
  ('Grade 8 A Classroom', 'فصل الصف الثامن أ', 'CR-G8A', 'classroom', 25, false),
  ('Grade 8 B Classroom', 'فصل الصف الثامن ب', 'CR-G8B', 'classroom', 25, false);

-- Shared Facilities
INSERT INTO facilities (name, name_ar, code, type, capacity, is_shared) VALUES
  ('Playing Ground', 'الملعب', 'SF-PLAY', 'sports', 100, true),
  ('Swimming Pool', 'المسبح', 'SF-SWIM', 'sports', 30, true),
  ('IT Lab', 'مختبر الحاسوب', 'SF-ITLAB', 'lab', 30, true),
  ('Science Lab', 'المختبر العلمي', 'SF-SCILAB', 'lab', 30, true),
  ('Music Room', 'غرفة الموسيقى', 'SF-MUSIC', 'music_room', 30, true);

-- ================================================
-- 2. TEACHERS (30+ female teachers)
-- ================================================

INSERT INTO teachers (employee_id, first_name, first_name_ar, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, last_name, last_name_ar, gender, date_of_birth, phone, email, hire_date, specialization, specialization_ar) VALUES
  ('TCH-001', 'Fatma', 'فاطمة', 'Mohammed', 'محمد', 'Khalfan', 'خلفان', 'Al Balushi', 'البلوشي', 'Al Balushi', 'البلوشي', 'female', '1985-03-15', '91001001', 'fatma.balushi@mashaail.school', '2020-09-01', 'Islamic Education', 'التربية الإسلامية'),
  ('TCH-002', 'Maryam', 'مريم', 'Ali', 'علي', 'Hilal', 'هلال', 'Al Harthi', 'الحارثي', 'Al Harthi', 'الحارثي', 'female', '1988-07-22', '91001002', 'maryam.harthi@mashaail.school', '2019-09-01', 'Arabic Language', 'اللغة العربية'),
  ('TCH-003', 'Aisha', 'عائشة', 'Salim', 'سالم', 'Mohammed', 'محمد', 'Al Rashdi', 'الراشدي', 'Al Rashdi', 'الراشدي', 'female', '1990-01-10', '91001003', 'aisha.rashdi@mashaail.school', '2021-09-01', 'English Language', 'اللغة الإنجليزية'),
  ('TCH-004', 'Noora', 'نورة', 'Said', 'سعيد', 'Ali', 'علي', 'Al Busaidi', 'البوسعيدي', 'Al Busaidi', 'البوسعيدي', 'female', '1987-11-05', '91001004', 'noora.busaidi@mashaail.school', '2018-09-01', 'Mathematics', 'الرياضيات'),
  ('TCH-005', 'Huda', 'هدى', 'Nasser', 'ناصر', 'Hamad', 'حمد', 'Al Kindi', 'الكندي', 'Al Kindi', 'الكندي', 'female', '1986-05-18', '91001005', 'huda.kindi@mashaail.school', '2020-09-01', 'Science', 'العلوم'),
  ('TCH-006', 'Layla', 'ليلى', 'Khalid', 'خالد', 'Salim', 'سالم', 'Al Wahaibi', 'الوهيبي', 'Al Wahaibi', 'الوهيبي', 'female', '1991-09-30', '91001006', 'layla.wahaibi@mashaail.school', '2022-09-01', 'Social Studies', 'الدراسات الاجتماعية'),
  ('TCH-007', 'Samia', 'سامية', 'Ahmed', 'أحمد', 'Nasser', 'ناصر', 'Al Mahrouqi', 'المحروقي', 'Al Mahrouqi', 'المحروقي', 'female', '1989-04-12', '91001007', 'samia.mahrouqi@mashaail.school', '2019-09-01', 'Information Technology', 'تقنية المعلومات'),
  ('TCH-008', 'Khadija', 'خديجة', 'Ibrahim', 'إبراهيم', 'Said', 'سعيد', 'Al Maskari', 'المسكري', 'Al Maskari', 'المسكري', 'female', '1992-08-25', '91001008', 'khadija.maskari@mashaail.school', '2023-09-01', 'Life Skills', 'المهارات الحياتية'),
  ('TCH-009', 'Zainab', 'زينب', 'Hamad', 'حمد', 'Ahmed', 'أحمد', 'Al Habsi', 'الحبسي', 'Al Habsi', 'الحبسي', 'female', '1988-12-03', '91001009', 'zainab.habsi@mashaail.school', '2020-09-01', 'Music Skills', 'المهارات الموسيقية'),
  ('TCH-010', 'Sara', 'سارة', 'Abdullah', 'عبدالله', 'Ibrahim', 'إبراهيم', 'Al Siyabi', 'السيابي', 'Al Siyabi', 'السيابي', 'female', '1993-06-14', '91001010', 'sara.siyabi@mashaail.school', '2022-09-01', 'Visual Arts', 'الفنون البصرية'),
  ('TCH-011', 'Amna', 'آمنة', 'Rashid', 'راشد', 'Sultan', 'سلطان', 'Al Naamani', 'النعماني', 'Al Naamani', 'النعماني', 'female', '1987-02-28', '91001011', 'amna.naamani@mashaail.school', '2018-09-01', 'Career Guidance', 'التوجيه المهني'),
  ('TCH-012', 'Raya', 'رية', 'Sultan', 'سلطان', 'Rashid', 'راشد', 'Al Farsi', 'الفارسي', 'Al Farsi', 'الفارسي', 'female', '1990-10-19', '91001012', 'raya.farsi@mashaail.school', '2021-09-01', 'Swimming', 'السباحة'),
  ('TCH-013', 'Halima', 'حليمة', 'Yusuf', 'يوسف', 'Khalid', 'خالد', 'Al Rawahi', 'الرواحي', 'Al Rawahi', 'الرواحي', 'female', '1986-07-07', '91001013', 'halima.rawahi@mashaail.school', '2017-09-01', 'Physical Education', 'التربية البدنية'),
  ('TCH-014', 'Salma', 'سلمى', 'Omar', 'عمر', 'Abdullah', 'عبدالله', 'Al Hosni', 'الحسني', 'Al Hosni', 'الحسني', 'female', '1991-03-21', '91001014', 'salma.hosni@mashaail.school', '2022-09-01', 'Islamic Education', 'التربية الإسلامية'),
  ('TCH-015', 'Nawal', 'نوال', 'Hassan', 'حسن', 'Omar', 'عمر', 'Al Lawati', 'اللواتي', 'Al Lawati', 'اللواتي', 'female', '1989-11-11', '91001015', 'nawal.lawati@mashaail.school', '2020-09-01', 'Arabic Language', 'اللغة العربية'),
  ('TCH-016', 'Wafa', 'وفاء', 'Majid', 'ماجد', 'Yusuf', 'يوسف', 'Al Ghafri', 'الغافري', 'Al Ghafri', 'الغافري', 'female', '1988-01-30', '91001016', 'wafa.ghafri@mashaail.school', '2019-09-01', 'English Language', 'اللغة الإنجليزية'),
  ('TCH-017', 'Thuraya', 'ثريا', 'Hamed', 'حامد', 'Hassan', 'حسن', 'Al Hinai', 'الهنائي', 'Al Hinai', 'الهنائي', 'female', '1992-05-05', '91001017', 'thuraya.hinai@mashaail.school', '2023-09-01', 'Mathematics', 'الرياضيات'),
  ('TCH-018', 'Basma', 'بسمة', 'Suleiman', 'سليمان', 'Majid', 'ماجد', 'Al Amri', 'العامري', 'Al Amri', 'العامري', 'female', '1985-09-16', '91001018', 'basma.amri@mashaail.school', '2016-09-01', 'Science', 'العلوم'),
  ('TCH-019', 'Maitha', 'ميثاء', 'Mubarak', 'مبارك', 'Hamed', 'حامد', 'Al Zadjali', 'الزدجالي', 'Al Zadjali', 'الزدجالي', 'female', '1990-04-08', '91001019', 'maitha.zadjali@mashaail.school', '2021-09-01', 'Social Studies', 'الدراسات الاجتماعية'),
  ('TCH-020', 'Rahma', 'رحمة', 'Saif', 'سيف', 'Suleiman', 'سليمان', 'Al Shukaili', 'الشكيلي', 'Al Shukaili', 'الشكيلي', 'female', '1993-12-25', '91001020', 'rahma.shukaili@mashaail.school', '2024-09-01', 'Information Technology', 'تقنية المعلومات'),
  ('TCH-021', 'Asma', 'أسماء', 'Khalfan', 'خلفان', 'Saif', 'سيف', 'Al Kharousi', 'الخروصي', 'Al Kharousi', 'الخروصي', 'female', '1987-06-17', '91001021', 'asma.kharousi@mashaail.school', '2018-09-01', 'Life Skills', 'المهارات الحياتية'),
  ('TCH-022', 'Intisar', 'انتصار', 'Hilal', 'هلال', 'Mubarak', 'مبارك', 'Al Shamsi', 'الشامسي', 'Al Shamsi', 'الشامسي', 'female', '1991-08-09', '91001022', 'intisar.shamsi@mashaail.school', '2022-09-01', 'Arabic Language', 'اللغة العربية'),
  ('TCH-023', 'Dalal', 'دلال', 'Badr', 'بدر', 'Badr', 'بدر', 'Al Jabri', 'الجابري', 'Al Jabri', 'الجابري', 'female', '1989-02-14', '91001023', 'dalal.jabri@mashaail.school', '2020-09-01', 'English Language', 'اللغة الإنجليزية'),
  ('TCH-024', 'Hanan', 'حنان', 'Harith', 'حارث', 'Fahad', 'فهد', 'Al Riyami', 'الريامي', 'Al Riyami', 'الريامي', 'female', '1986-10-31', '91001024', 'hanan.riyami@mashaail.school', '2017-09-01', 'Mathematics', 'الرياضيات'),
  ('TCH-025', 'Sabah', 'صباح', 'Fahad', 'فهد', 'Harith', 'حارث', 'Al Tobi', 'الطوبي', 'Al Tobi', 'الطوبي', 'female', '1992-07-20', '91001025', 'sabah.tobi@mashaail.school', '2023-09-01', 'Science', 'العلوم'),
  ('TCH-026', 'Muna', 'منى', 'Amer', 'عامر', 'Amer', 'عامر', 'Al Harrasi', 'الحراصي', 'Al Harrasi', 'الحراصي', 'female', '1988-03-04', '91001026', 'muna.harrasi@mashaail.school', '2019-09-01', 'Visual Arts', 'الفنون البصرية'),
  ('TCH-027', 'Ibtisam', 'ابتسام', 'Talal', 'طلال', 'Talal', 'طلال', 'Al Mamari', 'المعمري', 'Al Mamari', 'المعمري', 'female', '1990-12-12', '91001027', 'ibtisam.mamari@mashaail.school', '2021-09-01', 'Music Skills', 'المهارات الموسيقية'),
  ('TCH-028', 'Shaikha', 'شيخة', 'Mansour', 'منصور', 'Mansour', 'منصور', 'Al Battashi', 'البطاشي', 'Al Battashi', 'البطاشي', 'female', '1994-01-25', '91001028', 'shaikha.battashi@mashaail.school', '2024-09-01', 'Career Guidance', 'التوجيه المهني'),
  ('TCH-029', 'Zuwayna', 'زوينة', 'Mohammed', 'محمد', 'Khalfan', 'خلفان', 'Al Saadi', 'السعدي', 'Al Saadi', 'السعدي', 'female', '1987-08-18', '91001029', 'zuwayna.saadi@mashaail.school', '2018-09-01', 'Islamic Education', 'التربية الإسلامية'),
  ('TCH-030', 'Badria', 'بدرية', 'Ali', 'علي', 'Hilal', 'هلال', 'Al Qasmi', 'القاسمي', 'Al Qasmi', 'القاسمي', 'female', '1991-05-23', '91001030', 'badria.qasmi@mashaail.school', '2022-09-01', 'Life Skills', 'المهارات الحياتية'),
  ('TCH-031', 'Mazoon', 'مزون', 'Salim', 'سالم', 'Mohammed', 'محمد', 'Al Maqbali', 'المقبالي', 'Al Maqbali', 'المقبالي', 'female', '1989-09-09', '91001031', 'mazoon.maqbali@mashaail.school', '2020-09-01', 'Physical Education', 'التربية البدنية'),
  ('TCH-032', 'Sumaya', 'سمية', 'Said', 'سعيد', 'Ali', 'علي', 'Al Khusaibi', 'الخصيبي', 'Al Khusaibi', 'الخصيبي', 'female', '1993-04-02', '91001032', 'sumaya.khusaibi@mashaail.school', '2024-09-01', 'Arabic Language', 'اللغة العربية');

-- ================================================
-- 3. CLASSES (KG1-G8, sections A & B = 20 classes)
-- Grade levels: -1=KG1, 0=KG2, 1-8=Grade1-8
-- ================================================

INSERT INTO classes (name, name_ar, grade_level, section, academic_year, class_supervisor_id, facility_id, capacity)
SELECT
  c.name, c.name_ar, c.grade_level, c.section, '2025-2026',
  t.id, f.id, 25
FROM (VALUES
  ('KG-1 A', 'روضة أولى أ', -1, 'A', 'TCH-001', 'CR-KG1A'),
  ('KG-1 B', 'روضة أولى ب', -1, 'B', 'TCH-014', 'CR-KG1B'),
  ('KG-2 A', 'روضة ثانية أ', 0, 'A', 'TCH-002', 'CR-KG2A'),
  ('KG-2 B', 'روضة ثانية ب', 0, 'B', 'TCH-015', 'CR-KG2B'),
  ('Grade 1 A', 'الصف الأول أ', 1, 'A', 'TCH-003', 'CR-G1A'),
  ('Grade 1 B', 'الصف الأول ب', 1, 'B', 'TCH-016', 'CR-G1B'),
  ('Grade 2 A', 'الصف الثاني أ', 2, 'A', 'TCH-004', 'CR-G2A'),
  ('Grade 2 B', 'الصف الثاني ب', 2, 'B', 'TCH-017', 'CR-G2B'),
  ('Grade 3 A', 'الصف الثالث أ', 3, 'A', 'TCH-005', 'CR-G3A'),
  ('Grade 3 B', 'الصف الثالث ب', 3, 'B', 'TCH-018', 'CR-G3B'),
  ('Grade 4 A', 'الصف الرابع أ', 4, 'A', 'TCH-006', 'CR-G4A'),
  ('Grade 4 B', 'الصف الرابع ب', 4, 'B', 'TCH-019', 'CR-G4B'),
  ('Grade 5 A', 'الصف الخامس أ', 5, 'A', 'TCH-007', 'CR-G5A'),
  ('Grade 5 B', 'الصف الخامس ب', 5, 'B', 'TCH-020', 'CR-G5B'),
  ('Grade 6 A', 'الصف السادس أ', 6, 'A', 'TCH-008', 'CR-G6A'),
  ('Grade 6 B', 'الصف السادس ب', 6, 'B', 'TCH-021', 'CR-G6B'),
  ('Grade 7 A', 'الصف السابع أ', 7, 'A', 'TCH-009', 'CR-G7A'),
  ('Grade 7 B', 'الصف السابع ب', 7, 'B', 'TCH-022', 'CR-G7B'),
  ('Grade 8 A', 'الصف الثامن أ', 8, 'A', 'TCH-010', 'CR-G8A'),
  ('Grade 8 B', 'الصف الثامن ب', 8, 'B', 'TCH-023', 'CR-G8B')
) AS c(name, name_ar, grade_level, section, teacher_eid, facility_code)
JOIN teachers t ON t.employee_id = c.teacher_eid
JOIN facilities f ON f.code = c.facility_code;

-- ================================================
-- 4. SUBJECTS (13 subjects)
-- ================================================

INSERT INTO subjects (code, name, name_ar, is_activity) VALUES
  ('ISL', 'Islamic Education', 'التربية الإسلامية', false),
  ('ARA', 'Arabic Language', 'اللغة العربية', false),
  ('ENG', 'English Language', 'اللغة الإنجليزية', false),
  ('MAT', 'Mathematics', 'الرياضيات', false),
  ('SCI', 'Science', 'العلوم', false),
  ('SOC', 'Social Studies', 'الدراسات الاجتماعية', false),
  ('ICT', 'Information Technology', 'تقنية المعلومات', false),
  ('LFS', 'Life Skills', 'المهارات الحياتية', false),
  ('MUS', 'Music Skills', 'المهارات الموسيقية', false),
  ('ART', 'Visual Arts', 'الفنون البصرية', false),
  ('CAR', 'Career Guidance', 'التوجيه المهني', false),
  ('SWM', 'Swimming', 'السباحة', true),
  ('PE', 'Physical Education', 'التربية البدنية', true);

-- ================================================
-- 5. GRADE-SUBJECT ASSIGNMENTS
-- Grade levels: -1=KG1, 0=KG2, 1-8=Grade1-8
--
-- Final Subject Table:
-- | Subject           | KG1 | KG2 | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 |
-- |-------------------|-----|-----|----|----|----|----|----|----|----|-----|
-- | Islamic Education |  x  |  x  | x  | x  | x  | x  | x  | x  | x  |  x |
-- | Arabic Language   |  x  |  x  | x  | x  | x  | x  | x  | x  | x  |  x |
-- | English Language  |  x  |  x  | x  | x  | x  | x  | x  | x  | x  |  x |
-- | Mathematics       |  x  |  x  | x  | x  | x  | x  | x  | x  | x  |  x |
-- | Science           |  x  |  x  | x  | x  | x  | x  | x  | x  | x  |  x |
-- | Social Studies    |     |     |    |    | x  | x  | x  | x  | x  |  x |
-- | IT                |     |     |    |    | x  | x  | x  | x  | x  |  x |
-- | Life Skills       |  x  |  x  | x  | x  | x  | x  | x  |    |    |    |
-- | Music Skills      |     |     |    | x  | x  | x  | x  | x  |    |    |
-- | Visual Arts       |  x  |  x  | x  | x  | x  | x  | x  | x  |    |    |
-- | Career Guidance   |     |     |    |    |    |    | x  | x  | x  |  x |
-- | Swimming          |     |     | x  | x  | x  | x  | x  | x  | x  |  x |
-- | Physical Education|  x  |  x  | x  | x  | x  | x  | x  | x  | x  |  x |
-- ================================================

-- Islamic Education: ALL grades (-1 through 8)
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (-1),(0),(1),(2),(3),(4),(5),(6),(7),(8)) AS gl(level)
WHERE s.code = 'ISL';

-- Arabic Language: ALL grades
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (-1),(0),(1),(2),(3),(4),(5),(6),(7),(8)) AS gl(level)
WHERE s.code = 'ARA';

-- English Language: ALL grades
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (-1),(0),(1),(2),(3),(4),(5),(6),(7),(8)) AS gl(level)
WHERE s.code = 'ENG';

-- Mathematics: ALL grades
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (-1),(0),(1),(2),(3),(4),(5),(6),(7),(8)) AS gl(level)
WHERE s.code = 'MAT';

-- Science: ALL grades
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (-1),(0),(1),(2),(3),(4),(5),(6),(7),(8)) AS gl(level)
WHERE s.code = 'SCI';

-- Social Studies: G3-G8
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (3),(4),(5),(6),(7),(8)) AS gl(level)
WHERE s.code = 'SOC';

-- Information Technology: G3-G8
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (3),(4),(5),(6),(7),(8)) AS gl(level)
WHERE s.code = 'ICT';

-- Life Skills: KG1-G5 (grades -1 through 5)
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (-1),(0),(1),(2),(3),(4),(5)) AS gl(level)
WHERE s.code = 'LFS';

-- Music Skills: G2-G6
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (2),(3),(4),(5),(6)) AS gl(level)
WHERE s.code = 'MUS';

-- Visual Arts: KG1-G6 (grades -1 through 6)
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (-1),(0),(1),(2),(3),(4),(5),(6)) AS gl(level)
WHERE s.code = 'ART';

-- Career Guidance: G5-G8
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (5),(6),(7),(8)) AS gl(level)
WHERE s.code = 'CAR';

-- Swimming: G1-G8 (NOT KG1/KG2)
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (1),(2),(3),(4),(5),(6),(7),(8)) AS gl(level)
WHERE s.code = 'SWM';

-- Physical Education: ALL grades
INSERT INTO grade_subjects (subject_id, grade_level)
SELECT s.id, gl.level FROM subjects s,
  (VALUES (-1),(0),(1),(2),(3),(4),(5),(6),(7),(8)) AS gl(level)
WHERE s.code = 'PE';

-- ================================================
-- 6. SCORING CATEGORIES (assessment breakdown per subject per grade)
-- Percentages must sum to 100 for each subject+grade combination
--
-- 3 category profiles:
--   A) Academic subjects (ISL, ARA, ENG, MAT, SCI, SOC, ICT):
--      Final Exam 40%, Midterm 20%, Quizzes 15%, Homework 10%, Participation 10%, Project 5%
--   B) Skill/Arts subjects (LFS, MUS, ART, CAR):
--      Practical Work 40%, Project 25%, Participation 20%, Portfolio 15%
--   C) Sports/Activity subjects (SWM, PLY):
--      Performance 50%, Participation 30%, Sportsmanship 20%
-- ================================================

-- A) Academic subjects: ISL, ARA, ENG, MAT, SCI, SOC, ICT
-- Insert for each grade level where the subject is assigned
DO $$
DECLARE
  v_subject RECORD;
  v_gs RECORD;
BEGIN
  FOR v_subject IN
    SELECT id, code FROM subjects WHERE code IN ('ISL','ARA','ENG','MAT','SCI','SOC','ICT')
  LOOP
    FOR v_gs IN
      SELECT grade_level FROM grade_subjects WHERE subject_id = v_subject.id
    LOOP
      INSERT INTO scoring_categories (subject_id, grade_level, name, name_ar, percentage, max_score, sort_order, academic_year) VALUES
        (v_subject.id, v_gs.grade_level, 'Final Exam',       'الاختبار النهائي',     40.00, 100, 1, '2025-2026'),
        (v_subject.id, v_gs.grade_level, 'Midterm Exam',     'اختبار منتصف الفصل',   20.00, 100, 2, '2025-2026'),
        (v_subject.id, v_gs.grade_level, 'Quizzes',          'الاختبارات القصيرة',    15.00, 100, 3, '2025-2026'),
        (v_subject.id, v_gs.grade_level, 'Homework',         'الواجبات المنزلية',     10.00, 100, 4, '2025-2026'),
        (v_subject.id, v_gs.grade_level, 'Participation',    'المشاركة الصفية',       10.00, 100, 5, '2025-2026'),
        (v_subject.id, v_gs.grade_level, 'Project',          'المشروع',               5.00, 100, 6, '2025-2026');
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Created scoring categories for academic subjects';
END $$;

-- B) Skill/Arts subjects: LFS, MUS, ART, CAR
DO $$
DECLARE
  v_subject RECORD;
  v_gs RECORD;
BEGIN
  FOR v_subject IN
    SELECT id, code FROM subjects WHERE code IN ('LFS','MUS','ART','CAR')
  LOOP
    FOR v_gs IN
      SELECT grade_level FROM grade_subjects WHERE subject_id = v_subject.id
    LOOP
      INSERT INTO scoring_categories (subject_id, grade_level, name, name_ar, percentage, max_score, sort_order, academic_year) VALUES
        (v_subject.id, v_gs.grade_level, 'Practical Work',   'العمل التطبيقي',       40.00, 100, 1, '2025-2026'),
        (v_subject.id, v_gs.grade_level, 'Project',          'المشروع',               25.00, 100, 2, '2025-2026'),
        (v_subject.id, v_gs.grade_level, 'Participation',    'المشاركة',              20.00, 100, 3, '2025-2026'),
        (v_subject.id, v_gs.grade_level, 'Portfolio',        'ملف الأعمال',           15.00, 100, 4, '2025-2026');
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Created scoring categories for skill/arts subjects';
END $$;

-- C) Sports/Activity subjects: SWM, PE
DO $$
DECLARE
  v_subject RECORD;
  v_gs RECORD;
BEGIN
  FOR v_subject IN
    SELECT id, code FROM subjects WHERE code IN ('SWM','PE')
  LOOP
    FOR v_gs IN
      SELECT grade_level FROM grade_subjects WHERE subject_id = v_subject.id
    LOOP
      INSERT INTO scoring_categories (subject_id, grade_level, name, name_ar, percentage, max_score, sort_order, academic_year) VALUES
        (v_subject.id, v_gs.grade_level, 'Performance',      'الأداء',                50.00, 100, 1, '2025-2026'),
        (v_subject.id, v_gs.grade_level, 'Participation',    'المشاركة',              30.00, 100, 2, '2025-2026'),
        (v_subject.id, v_gs.grade_level, 'Sportsmanship',    'الروح الرياضية',        20.00, 100, 3, '2025-2026');
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Created scoring categories for sports/activity subjects';
END $$;

-- ================================================
-- 7. CLASS-SUBJECT ASSIGNMENTS
-- Auto-populate from grade_subjects for each class
-- ================================================

INSERT INTO class_subjects (class_id, subject_id, periods_per_week)
SELECT c.id, gs.subject_id, gs.periods_per_week
FROM classes c
JOIN grade_subjects gs ON gs.grade_level = c.grade_level
WHERE c.academic_year = '2025-2026';

-- ================================================
-- 8. TRANSPORT AREAS
-- ================================================

INSERT INTO transport_areas (name, name_ar, annual_fee, academic_year) VALUES
  ('Sur Al Hadid', 'صور الحديد', 140.000, '2025-2026'),
  ('Sharadi', 'شرادي', 175.000, '2025-2026'),
  ('Mabellah North', 'المعبيلة الشمالية', 230.000, '2025-2026'),
  ('Mabellah South', 'المعبيلة الجنوبية', 250.000, '2025-2026'),
  ('Mabellah 6/7/8', 'المعبيلة ٦/٧/٨', 280.000, '2025-2026'),
  ('Al Nasar', 'النصر', 200.000, '2025-2026'),
  ('Wadi Al Awami', 'وادي العوامي', 240.000, '2025-2026'),
  ('Wadi Bahais', 'وادي بحائص', 200.000, '2025-2026'),
  ('Seeb Suq / Qalah', 'سوق السيب / القلعة', 175.000, '2025-2026');

-- ================================================
-- 9. BUSES (one per transport area, larger areas get 2)
-- Each bus has a driver with Omani name + phone
-- ================================================

INSERT INTO buses (bus_number, plate_number, driver_name, driver_name_ar, driver_father_name, driver_father_name_ar, driver_grandfather_name, driver_grandfather_name_ar, driver_family_name, driver_family_name_ar, driver_phone, capacity, transport_area_id)
SELECT
  b.bus_number, b.plate_number, b.driver_name, b.driver_name_ar,
  b.driver_father_name, b.driver_father_name_ar,
  b.driver_grandfather_name, b.driver_grandfather_name_ar,
  b.driver_family_name, b.driver_family_name_ar,
  b.driver_phone, b.capacity,
  ta.id
FROM (VALUES
  ('BUS-01', '3/45821',  'Salim',     'سالم',     'Khalid',    'خالد',     'Nasser',    'ناصر',     'Al Balushi',   'البلوشي',     '92001001', 40, 'Sur Al Hadid'),
  ('BUS-02', '7/18394',  'Fatma',     'فاطمة',    'Ali',       'علي',      'Mohammed',  'محمد',     'Al Harthi',    'الحارثي',     '92001002', 40, 'Sharadi'),
  ('BUS-03', '12/67250', 'Khalid',    'خالد',     'Said',      'سعيد',     'Ibrahim',   'إبراهيم',  'Al Rashdi',    'الراشدي',     '92001003', 45, 'Mabellah North'),
  ('BUS-04', '5/93147',  'Maryam',    'مريم',     'Hamad',     'حمد',      'Salim',     'سالم',     'Al Farsi',     'الفارسي',     '92001004', 40, 'Mabellah North'),
  ('BUS-05', '9/20586',  'Said',      'سعيد',     'Ahmed',     'أحمد',     'Khalfan',   'خلفان',    'Al Kindi',     'الكندي',      '92001005', 45, 'Mabellah South'),
  ('BUS-06', '2/74163',  'Hamad',     'حمد',      'Nasser',    'ناصر',     'Ali',       'علي',      'Al Wahaibi',   'الوهيبي',     '92001006', 40, 'Mabellah South'),
  ('BUS-07', '15/31074', 'Mohammed',  'محمد',     'Sultan',    'سلطان',    'Rashid',    'راشد',     'Al Mahrouqi',  'المحروقي',    '92001007', 45, 'Mabellah 6/7/8'),
  ('BUS-08', '8/52690',  'Noora',     'نورة',     'Abdullah',  'عبدالله',  'Hassan',    'حسن',      'Al Busaidi',   'البوسعيدي',   '92001008', 40, 'Mabellah 6/7/8'),
  ('BUS-09', '4/86312',  'Ali',       'علي',      'Ibrahim',   'إبراهيم',  'Majid',     'ماجد',     'Al Habsi',     'الحبسي',      '92001009', 40, 'Al Nasar'),
  ('BUS-10', '11/40958', 'Rashid',    'راشد',     'Yusuf',     'يوسف',     'Suleiman',  'سليمان',   'Al Siyabi',    'السيابي',     '92001010', 40, 'Wadi Al Awami'),
  ('BUS-11', '6/73429',  'Aisha',     'عائشة',    'Omar',      'عمر',      'Khalfan',   'خلفان',    'Al Naamani',   'النعماني',    '92001011', 40, 'Wadi Bahais'),
  ('BUS-12', '10/15847', 'Yusuf',     'يوسف',     'Hassan',    'حسن',      'Hilal',     'هلال',     'Al Rawahi',    'الرواحي',     '92001012', 40, 'Seeb Suq / Qalah')
) AS b(bus_number, plate_number, driver_name, driver_name_ar, driver_father_name, driver_father_name_ar, driver_grandfather_name, driver_grandfather_name_ar, driver_family_name, driver_family_name_ar, driver_phone, capacity, area_name)
JOIN transport_areas ta ON ta.name = b.area_name AND ta.academic_year = '2025-2026';

-- ================================================
-- 10. FEE STRUCTURES (5 tiers, OMR)
-- ================================================

INSERT INTO fee_structures (name, name_ar, academic_year, grade_levels, total_amount, books_fee, school_fee, services_fee, registration_fee) VALUES
  ('KG-1 Fees', 'رسوم الروضة الأولى', '2025-2026', ARRAY[-1], 600.000, 75.000, 450.000, 0.000, 75.000),
  ('KG-2 Fees', 'رسوم الروضة الثانية', '2025-2026', ARRAY[0], 700.000, 100.000, 500.000, 25.000, 75.000),
  ('Grade 1-4 Fees', 'رسوم الصف الأول - الرابع', '2025-2026', ARRAY[1,2,3,4], 850.000, 125.000, 600.000, 50.000, 75.000),
  ('Grade 5-6 Fees', 'رسوم الصف الخامس - السادس', '2025-2026', ARRAY[5,6], 925.000, 125.000, 650.000, 50.000, 100.000),
  ('Grade 7-8 Fees', 'رسوم الصف السابع - الثامن', '2025-2026', ARRAY[7,8], 1025.000, 125.000, 750.000, 50.000, 100.000);

-- ================================================
-- 11. FEE ITEMS (breakdown line items per tier)
-- ================================================

-- KG-1 fee items
INSERT INTO fee_items (name, name_ar, amount, academic_year, grade_levels, is_mandatory) VALUES
  ('Books Fee - KG1', 'رسوم الكتب - روضة أولى', 75.000, '2025-2026', ARRAY[-1], true),
  ('School Fee - KG1', 'الرسوم الدراسية - روضة أولى', 450.000, '2025-2026', ARRAY[-1], true),
  ('Registration Fee - KG1', 'رسوم التسجيل - روضة أولى', 75.000, '2025-2026', ARRAY[-1], true);

-- KG-2 fee items
INSERT INTO fee_items (name, name_ar, amount, academic_year, grade_levels, is_mandatory) VALUES
  ('Books Fee - KG2', 'رسوم الكتب - روضة ثانية', 100.000, '2025-2026', ARRAY[0], true),
  ('School Fee - KG2', 'الرسوم الدراسية - روضة ثانية', 500.000, '2025-2026', ARRAY[0], true),
  ('Services Fee - KG2', 'رسوم الخدمات - روضة ثانية', 25.000, '2025-2026', ARRAY[0], true),
  ('Registration Fee - KG2', 'رسوم التسجيل - روضة ثانية', 75.000, '2025-2026', ARRAY[0], true);

-- Grade 1-4 fee items
INSERT INTO fee_items (name, name_ar, amount, academic_year, grade_levels, is_mandatory) VALUES
  ('Books Fee - G1-4', 'رسوم الكتب - صف ١-٤', 125.000, '2025-2026', ARRAY[1,2,3,4], true),
  ('School Fee - G1-4', 'الرسوم الدراسية - صف ١-٤', 600.000, '2025-2026', ARRAY[1,2,3,4], true),
  ('Services Fee - G1-4', 'رسوم الخدمات - صف ١-٤', 50.000, '2025-2026', ARRAY[1,2,3,4], true),
  ('Registration Fee - G1-4', 'رسوم التسجيل - صف ١-٤', 75.000, '2025-2026', ARRAY[1,2,3,4], true);

-- Grade 5-6 fee items
INSERT INTO fee_items (name, name_ar, amount, academic_year, grade_levels, is_mandatory) VALUES
  ('Books Fee - G5-6', 'رسوم الكتب - صف ٥-٦', 125.000, '2025-2026', ARRAY[5,6], true),
  ('School Fee - G5-6', 'الرسوم الدراسية - صف ٥-٦', 650.000, '2025-2026', ARRAY[5,6], true),
  ('Services Fee - G5-6', 'رسوم الخدمات - صف ٥-٦', 50.000, '2025-2026', ARRAY[5,6], true),
  ('Registration Fee - G5-6', 'رسوم التسجيل - صف ٥-٦', 100.000, '2025-2026', ARRAY[5,6], true);

-- Grade 7-8 fee items
INSERT INTO fee_items (name, name_ar, amount, academic_year, grade_levels, is_mandatory) VALUES
  ('Books Fee - G7-8', 'رسوم الكتب - صف ٧-٨', 125.000, '2025-2026', ARRAY[7,8], true),
  ('School Fee - G7-8', 'الرسوم الدراسية - صف ٧-٨', 750.000, '2025-2026', ARRAY[7,8], true),
  ('Services Fee - G7-8', 'رسوم الخدمات - صف ٧-٨', 50.000, '2025-2026', ARRAY[7,8], true),
  ('Registration Fee - G7-8', 'رسوم التسجيل - صف ٧-٨', 100.000, '2025-2026', ARRAY[7,8], true);

-- ================================================
-- 12. STUDENTS (~420 students, 20-22 per section)
-- 4-part Omani names: first / father / grandfather / family
-- GPS locations around Seeb, Muscat area
-- ================================================

-- Helper: We generate students using a cross-join of names
-- Each student gets a unique combination

DO $$
DECLARE
  v_class_id UUID;
  v_student_counter INTEGER := 0;
  v_grade_level INTEGER;
  v_section TEXT;
  v_num_students INTEGER;
  v_i INTEGER;
  v_gender TEXT;
  v_first_en TEXT;
  v_first_ar TEXT;
  v_father_en TEXT;
  v_father_ar TEXT;
  v_gfather_en TEXT;
  v_gfather_ar TEXT;
  v_family_en TEXT;
  v_family_ar TEXT;
  v_dob DATE;
  v_sid TEXT;
  v_lat NUMERIC;
  v_lng NUMERIC;
  v_gps TEXT;

  -- Omani male first names (EN/AR pairs)
  male_first_en TEXT[] := ARRAY[
    'Ahmed','Mohammed','Ali','Omar','Khalid','Yusuf','Ibrahim','Hassan',
    'Hamad','Said','Rashid','Abdullah','Nasser','Salim','Hamza','Tariq',
    'Faisal','Sultan','Badr','Majid','Saud','Waleed','Muhannad','Amer',
    'Haitham','Saif','Mubarak','Fahad','Idris','Talal','Zakariya','Younis',
    'Mansour','Harith','Adham','Aws','Anas','Bilal','Rayan','Zaid'
  ];
  male_first_ar TEXT[] := ARRAY[
    'أحمد','محمد','علي','عمر','خالد','يوسف','إبراهيم','حسن',
    'حمد','سعيد','راشد','عبدالله','ناصر','سالم','حمزة','طارق',
    'فيصل','سلطان','بدر','ماجد','سعود','وليد','مهند','عامر',
    'هيثم','سيف','مبارك','فهد','إدريس','طلال','زكريا','يونس',
    'منصور','حارث','أدهم','أوس','أنس','بلال','ريان','زيد'
  ];

  -- Omani female first names
  female_first_en TEXT[] := ARRAY[
    'Fatma','Maryam','Aisha','Noora','Huda','Layla','Sara','Zainab',
    'Amna','Raya','Halima','Salma','Nawal','Basma','Maitha','Rahma',
    'Asma','Dalal','Hanan','Sumaya','Shaikha','Mazoon','Badria','Wafa',
    'Thuraya','Ibtisam','Zuwayna','Sabah','Khadija','Samia','Intisar','Muna'
  ];
  female_first_ar TEXT[] := ARRAY[
    'فاطمة','مريم','عائشة','نورة','هدى','ليلى','سارة','زينب',
    'آمنة','رية','حليمة','سلمى','نوال','بسمة','ميثاء','رحمة',
    'أسماء','دلال','حنان','سمية','شيخة','مزون','بدرية','وفاء',
    'ثريا','ابتسام','زوينة','صباح','خديجة','سامية','انتصار','منى'
  ];

  -- Father/grandfather names (common Omani male names)
  father_en TEXT[] := ARRAY[
    'Mohammed','Ali','Salim','Said','Nasser','Khalid','Ahmed','Ibrahim',
    'Hamad','Abdullah','Rashid','Sultan','Yusuf','Omar','Hassan','Majid',
    'Hamed','Suleiman','Mubarak','Saif','Khalfan','Hilal','Badr','Harith',
    'Fahad','Amer','Talal','Mansour'
  ];
  father_ar TEXT[] := ARRAY[
    'محمد','علي','سالم','سعيد','ناصر','خالد','أحمد','إبراهيم',
    'حمد','عبدالله','راشد','سلطان','يوسف','عمر','حسن','ماجد',
    'حامد','سليمان','مبارك','سيف','خلفان','هلال','بدر','حارث',
    'فهد','عامر','طلال','منصور'
  ];

  -- Omani family names
  family_en TEXT[] := ARRAY[
    'Al Balushi','Al Harthi','Al Rashdi','Al Busaidi','Al Kindi',
    'Al Wahaibi','Al Mahrouqi','Al Maskari','Al Habsi','Al Siyabi',
    'Al Naamani','Al Farsi','Al Rawahi','Al Hosni','Al Lawati',
    'Al Ghafri','Al Hinai','Al Amri','Al Zadjali','Al Shukaili',
    'Al Kharousi','Al Shamsi','Al Jabri','Al Riyami','Al Tobi',
    'Al Harrasi','Al Mamari','Al Battashi','Al Saadi','Al Qasmi',
    'Al Maqbali','Al Khusaibi','Al Shabibi','Al Aufi','Al Abri',
    'Al Hajri','Al Mughairi','Al Dhahli','Al Kaabi','Al Ismaili'
  ];
  family_ar TEXT[] := ARRAY[
    'البلوشي','الحارثي','الراشدي','البوسعيدي','الكندي',
    'الوهيبي','المحروقي','المسكري','الحبسي','السيابي',
    'النعماني','الفارسي','الرواحي','الحسني','اللواتي',
    'الغافري','الهنائي','العامري','الزدجالي','الشكيلي',
    'الخروصي','الشامسي','الجابري','الريامي','الطوبي',
    'الحراصي','المعمري','البطاشي','السعدي','القاسمي',
    'المقبالي','الخصيبي','الشبيبي','العوفي','العبري',
    'الحجري','المغيري','الداهلي','الكعبي','الإسماعيلي'
  ];

BEGIN
  -- Loop through each class
  FOR v_class_id, v_grade_level, v_section IN
    SELECT id, grade_level, section FROM classes WHERE academic_year = '2025-2026' ORDER BY grade_level, section
  LOOP
    -- 20-22 students per section
    v_num_students := 20 + (v_student_counter % 3); -- varies 20, 21, 22

    FOR v_i IN 1..v_num_students LOOP
      v_student_counter := v_student_counter + 1;

      -- Alternate genders
      IF v_student_counter % 2 = 0 THEN
        v_gender := 'male';
        v_first_en := male_first_en[1 + ((v_student_counter * 7 + v_i * 3) % array_length(male_first_en, 1))];
        v_first_ar := male_first_ar[1 + ((v_student_counter * 7 + v_i * 3) % array_length(male_first_ar, 1))];
      ELSE
        v_gender := 'female';
        v_first_en := female_first_en[1 + ((v_student_counter * 5 + v_i * 7) % array_length(female_first_en, 1))];
        v_first_ar := female_first_ar[1 + ((v_student_counter * 5 + v_i * 7) % array_length(female_first_ar, 1))];
      END IF;

      -- Father name
      v_father_en := father_en[1 + ((v_student_counter * 3 + v_i * 11) % array_length(father_en, 1))];
      v_father_ar := father_ar[1 + ((v_student_counter * 3 + v_i * 11) % array_length(father_ar, 1))];

      -- Grandfather name
      v_gfather_en := father_en[1 + ((v_student_counter * 13 + v_i * 5) % array_length(father_en, 1))];
      v_gfather_ar := father_ar[1 + ((v_student_counter * 13 + v_i * 5) % array_length(father_ar, 1))];

      -- Family name
      v_family_en := family_en[1 + ((v_student_counter * 11 + v_i * 3) % array_length(family_en, 1))];
      v_family_ar := family_ar[1 + ((v_student_counter * 11 + v_i * 3) % array_length(family_en, 1))];

      -- Student ID: 4-digit zero-padded
      v_sid := LPAD(v_student_counter::TEXT, 4, '0');

      -- Date of birth based on grade level
      -- KG1(-1): born ~2020, KG2(0): born ~2019, G1: 2018, etc.
      v_dob := ('2020-01-01'::DATE - (v_grade_level + 1) * INTERVAL '1 year')
               + (v_student_counter % 365) * INTERVAL '1 day';

      -- GPS location: random around Seeb/Muscat area
      -- Seeb center: ~23.6700, 58.1800
      v_lat := 23.6200 + (random() * 0.1200);
      v_lng := 58.1200 + (random() * 0.1500);
      v_gps := 'https://maps.google.com/?q=' || ROUND(v_lat::NUMERIC, 6)::TEXT || ',' || ROUND(v_lng::NUMERIC, 6)::TEXT;

      INSERT INTO students (
        student_id, first_name, first_name_ar,
        father_name, father_name_ar,
        grandfather_name, grandfather_name_ar,
        family_name, family_name_ar,
        date_of_birth, gender, nationality,
        class_id, enrollment_date, gps_location
      ) VALUES (
        v_sid, v_first_en, v_first_ar,
        v_father_en, v_father_ar,
        v_gfather_en, v_gfather_ar,
        v_family_en, v_family_ar,
        v_dob, v_gender::gender, 'Omani',
        v_class_id, '2025-09-01', v_gps
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Created % students', v_student_counter;
END $$;

-- ================================================
-- 13. GUARDIANS (one per student: father, mother, or guardian)
-- Full 4-part Omani names (EN + AR) with phone & relationship
-- ================================================

DO $$
DECLARE
  v_student RECORD;
  v_guardian_id UUID;
  v_phone TEXT;
  v_counter INTEGER := 0;
  v_role INTEGER;
  v_g_first_en TEXT;
  v_g_first_ar TEXT;
  v_g_father_en TEXT;
  v_g_father_ar TEXT;
  v_g_gfather_en TEXT;
  v_g_gfather_ar TEXT;
  v_rel_en TEXT;
  v_rel_ar TEXT;

  -- Omani female first names (for mother/female guardian)
  female_names_en TEXT[] := ARRAY[
    'Fatma','Maryam','Aisha','Noora','Huda','Layla','Sara','Zainab',
    'Amna','Raya','Halima','Salma','Nawal','Basma','Maitha','Rahma',
    'Asma','Dalal','Hanan','Sumaya','Shaikha','Mazoon','Badria','Wafa',
    'Thuraya','Ibtisam','Zuwayna','Sabah','Khadija','Samia'
  ];
  female_names_ar TEXT[] := ARRAY[
    'فاطمة','مريم','عائشة','نورة','هدى','ليلى','سارة','زينب',
    'آمنة','رية','حليمة','سلمى','نوال','بسمة','ميثاء','رحمة',
    'أسماء','دلال','حنان','سمية','شيخة','مزون','بدرية','وفاء',
    'ثريا','ابتسام','زوينة','صباح','خديجة','سامية'
  ];

  -- Male names for father/grandfather fields
  male_names_en TEXT[] := ARRAY[
    'Mohammed','Ali','Salim','Said','Nasser','Khalid','Ahmed','Ibrahim',
    'Hamad','Abdullah','Rashid','Sultan','Yusuf','Omar','Hassan','Majid',
    'Hamed','Suleiman','Mubarak','Saif','Khalfan','Hilal','Badr','Harith',
    'Fahad','Amer','Talal','Mansour'
  ];
  male_names_ar TEXT[] := ARRAY[
    'محمد','علي','سالم','سعيد','ناصر','خالد','أحمد','إبراهيم',
    'حمد','عبدالله','راشد','سلطان','يوسف','عمر','حسن','ماجد',
    'حامد','سليمان','مبارك','سيف','خلفان','هلال','بدر','حارث',
    'فهد','عامر','طلال','منصور'
  ];
BEGIN
  FOR v_student IN
    SELECT id, father_name, father_name_ar, grandfather_name, grandfather_name_ar,
           family_name, family_name_ar
    FROM students
  LOOP
    v_counter := v_counter + 1;

    -- Randomly pick: 0=Father (~50%), 1=Mother (~35%), 2=Guardian (~15%)
    v_role := CASE
      WHEN random() < 0.50 THEN 0
      WHEN random() < 0.70 THEN 1
      ELSE 2
    END;

    v_phone := '9' || LPAD((1000000 + (random() * 8999999)::INTEGER)::TEXT, 7, '0');

    IF v_role = 0 THEN
      -- Father: use student's father_name as first_name, grandfather as father_name
      v_g_first_en := v_student.father_name;
      v_g_first_ar := v_student.father_name_ar;
      v_g_father_en := v_student.grandfather_name;
      v_g_father_ar := v_student.grandfather_name_ar;
      v_g_gfather_en := male_names_en[1 + (v_counter % array_length(male_names_en, 1))];
      v_g_gfather_ar := male_names_ar[1 + (v_counter % array_length(male_names_ar, 1))];
      v_rel_en := 'Father';
      v_rel_ar := 'أب';
    ELSIF v_role = 1 THEN
      -- Mother: female first name, her own father/grandfather
      v_g_first_en := female_names_en[1 + (v_counter % array_length(female_names_en, 1))];
      v_g_first_ar := female_names_ar[1 + (v_counter % array_length(female_names_ar, 1))];
      v_g_father_en := male_names_en[1 + ((v_counter * 7) % array_length(male_names_en, 1))];
      v_g_father_ar := male_names_ar[1 + ((v_counter * 7) % array_length(male_names_ar, 1))];
      v_g_gfather_en := male_names_en[1 + ((v_counter * 13) % array_length(male_names_en, 1))];
      v_g_gfather_ar := male_names_ar[1 + ((v_counter * 13) % array_length(male_names_ar, 1))];
      v_rel_en := 'Mother';
      v_rel_ar := 'أم';
    ELSE
      -- Guardian (uncle, relative, etc.): male name, different lineage
      v_g_first_en := male_names_en[1 + ((v_counter * 3) % array_length(male_names_en, 1))];
      v_g_first_ar := male_names_ar[1 + ((v_counter * 3) % array_length(male_names_ar, 1))];
      v_g_father_en := male_names_en[1 + ((v_counter * 11) % array_length(male_names_en, 1))];
      v_g_father_ar := male_names_ar[1 + ((v_counter * 11) % array_length(male_names_ar, 1))];
      v_g_gfather_en := male_names_en[1 + ((v_counter * 17) % array_length(male_names_en, 1))];
      v_g_gfather_ar := male_names_ar[1 + ((v_counter * 17) % array_length(male_names_ar, 1))];
      v_rel_en := 'Guardian';
      v_rel_ar := 'ولي أمر';
    END IF;

    INSERT INTO guardians (
      first_name, first_name_ar,
      father_name, father_name_ar,
      grandfather_name, grandfather_name_ar,
      family_name, family_name_ar,
      relationship, relationship_ar, phone, is_primary
    ) VALUES (
      v_g_first_en, v_g_first_ar,
      v_g_father_en, v_g_father_ar,
      v_g_gfather_en, v_g_gfather_ar,
      v_student.family_name, v_student.family_name_ar,
      v_rel_en, v_rel_ar, v_phone, true
    )
    RETURNING id INTO v_guardian_id;

    INSERT INTO student_guardians (student_id, guardian_id, is_primary_contact)
    VALUES (v_student.id, v_guardian_id, true);
  END LOOP;

  RAISE NOTICE 'Created % guardians (one per student)', v_counter;
END $$;

-- ================================================
-- 14. STUDENT TRANSPORT (~40% of students, each assigned to a bus)
-- ================================================

DO $$
DECLARE
  v_student RECORD;
  v_bus RECORD;
  v_bus_ids UUID[];
  v_bus_area_ids UUID[];
  v_counter INTEGER := 0;
  v_idx INTEGER;
BEGIN
  -- Get all bus IDs and their area IDs
  SELECT array_agg(id ORDER BY bus_number), array_agg(transport_area_id ORDER BY bus_number)
  INTO v_bus_ids, v_bus_area_ids
  FROM buses WHERE is_active = true;

  FOR v_student IN SELECT id FROM students ORDER BY random() LIMIT (SELECT COUNT(*) * 0.4 FROM students)::INTEGER LOOP
    v_counter := v_counter + 1;
    -- Distribute students across buses evenly
    v_idx := 1 + (v_counter % array_length(v_bus_ids, 1));

    INSERT INTO student_transport (student_id, transport_area_id, bus_id, academic_year)
    VALUES (v_student.id, v_bus_area_ids[v_idx], v_bus_ids[v_idx], '2025-2026');
  END LOOP;

  RAISE NOTICE 'Assigned % students to transport buses', v_counter;
END $$;

-- ================================================
-- 15. INVOICES (one per student with full fee breakdown)
-- Each invoice has line items: Books, School, Services, Registration
-- + Transport fee if student is registered for transport
-- ================================================

DO $$
DECLARE
  v_student RECORD;
  v_fee RECORD;
  v_invoice_id UUID;
  v_inv_counter INTEGER := 0;
  v_total DECIMAL(10,3);
  v_transport_fee DECIMAL(10,3);
  v_has_transport BOOLEAN;
BEGIN
  FOR v_student IN
    SELECT s.id AS student_id, s.student_id AS sid, c.grade_level
    FROM students s
    JOIN classes c ON c.id = s.class_id
    WHERE c.academic_year = '2025-2026'
  LOOP
    -- Find the fee structure for this grade level
    SELECT * INTO v_fee
    FROM fee_structures
    WHERE academic_year = '2025-2026'
      AND v_student.grade_level = ANY(grade_levels)
    LIMIT 1;

    IF v_fee IS NULL THEN
      CONTINUE;
    END IF;

    -- Check if student has transport
    SELECT ta.annual_fee INTO v_transport_fee
    FROM student_transport st
    JOIN transport_areas ta ON ta.id = st.transport_area_id
    WHERE st.student_id = v_student.student_id
      AND st.academic_year = '2025-2026';

    v_has_transport := v_transport_fee IS NOT NULL;
    v_total := v_fee.total_amount + COALESCE(v_transport_fee, 0);

    v_inv_counter := v_inv_counter + 1;

    -- Create invoice
    INSERT INTO invoices (
      invoice_number, student_id, academic_year,
      total_amount, paid_amount, status, due_date, issued_date
    ) VALUES (
      'INV-2526-' || LPAD(v_inv_counter::TEXT, 4, '0'),
      v_student.student_id,
      '2025-2026',
      v_total,
      0,
      'pending',
      '2025-10-01',
      '2025-09-01'
    )
    RETURNING id INTO v_invoice_id;

    -- Invoice line items: Books Fee
    IF v_fee.books_fee > 0 THEN
      INSERT INTO invoice_items (invoice_id, description, description_ar, amount)
      VALUES (v_invoice_id, 'Books Fee', 'رسوم الكتب', v_fee.books_fee);
    END IF;

    -- School Fee
    IF v_fee.school_fee > 0 THEN
      INSERT INTO invoice_items (invoice_id, description, description_ar, amount)
      VALUES (v_invoice_id, 'School Fee', 'الرسوم الدراسية', v_fee.school_fee);
    END IF;

    -- Services Fee
    IF v_fee.services_fee > 0 THEN
      INSERT INTO invoice_items (invoice_id, description, description_ar, amount)
      VALUES (v_invoice_id, 'Services Fee', 'رسوم الخدمات', v_fee.services_fee);
    END IF;

    -- Registration Fee
    IF v_fee.registration_fee > 0 THEN
      INSERT INTO invoice_items (invoice_id, description, description_ar, amount)
      VALUES (v_invoice_id, 'Registration Fee', 'رسوم التسجيل', v_fee.registration_fee);
    END IF;

    -- Transport Fee (if applicable)
    IF v_has_transport THEN
      INSERT INTO invoice_items (invoice_id, description, description_ar, amount)
      VALUES (v_invoice_id, 'Transport Fee', 'رسوم النقل', v_transport_fee);
    END IF;
  END LOOP;

  RAISE NOTICE 'Created % invoices with fee breakdowns', v_inv_counter;
END $$;

-- ================================================
-- 16. RANDOM PAYMENTS (partial payments for ~30% of invoices)
-- ================================================

DO $$
DECLARE
  v_invoice RECORD;
  v_payment_counter INTEGER := 0;
  v_pay_amount DECIMAL(10,3);
  v_pay_pct DECIMAL;
  v_methods TEXT[] := ARRAY['Cash', 'Bank Transfer', 'Credit Card', 'Cheque'];
  v_method TEXT;
  v_pay_date DATE;
BEGIN
  FOR v_invoice IN
    SELECT id, invoice_number, total_amount, student_id
    FROM invoices
    WHERE academic_year = '2025-2026' AND status = 'pending'
    ORDER BY random()
    LIMIT (SELECT COUNT(*) * 0.30 FROM invoices WHERE academic_year = '2025-2026')::INTEGER
  LOOP
    v_payment_counter := v_payment_counter + 1;

    -- Random payment percentage: 20-100%
    v_pay_pct := 0.20 + (random() * 0.80);
    v_pay_amount := ROUND((v_invoice.total_amount * v_pay_pct)::NUMERIC, 3);

    -- Random payment method
    v_method := v_methods[1 + (v_payment_counter % array_length(v_methods, 1))];

    -- Random payment date between Sep 2025 and Feb 2026
    v_pay_date := '2025-09-15'::DATE + (random() * 150)::INTEGER * INTERVAL '1 day';

    -- Create payment
    INSERT INTO payments (payment_number, invoice_id, amount, payment_date, payment_method, reference_number)
    VALUES (
      'PAY-2526-' || LPAD(v_payment_counter::TEXT, 4, '0'),
      v_invoice.id,
      v_pay_amount,
      v_pay_date,
      v_method,
      'REF-' || LPAD((1000 + v_payment_counter)::TEXT, 6, '0')
    );

    -- Update invoice
    UPDATE invoices
    SET paid_amount = v_pay_amount,
        status = CASE
          WHEN v_pay_amount >= total_amount THEN 'paid'::payment_status
          ELSE 'pending'::payment_status
        END
    WHERE id = v_invoice.id;
  END LOOP;

  -- Mark ~5% of unpaid invoices as overdue
  UPDATE invoices
  SET status = 'overdue'
  WHERE academic_year = '2025-2026'
    AND status = 'pending'
    AND paid_amount = 0
    AND id IN (
      SELECT id FROM invoices
      WHERE academic_year = '2025-2026' AND status = 'pending' AND paid_amount = 0
      ORDER BY random()
      LIMIT (SELECT COUNT(*) * 0.05 FROM invoices WHERE academic_year = '2025-2026' AND status = 'pending' AND paid_amount = 0)::INTEGER
    );

  RAISE NOTICE 'Created % payments for invoices', v_payment_counter;
END $$;
