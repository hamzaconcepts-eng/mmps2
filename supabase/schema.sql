-- Mashaail School Management System - Database Schema
-- Complete schema with RLS policies, indexes, and triggers
-- Tables ordered by dependencies (referenced tables created first)
-- Currency: OMR (Omani Rial) uses 3 decimal places

-- ================================================
-- CLEANUP (drop existing tables and types)
-- ================================================

DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS grade_revisions CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS scoring_categories CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS attendance_sessions CASCADE;
DROP TABLE IF EXISTS timetable_slots CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS fee_items CASCADE;
DROP TABLE IF EXISTS fee_structures CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS class_subjects CASCADE;
DROP TABLE IF EXISTS grade_subjects CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS student_guardians CASCADE;
DROP TABLE IF EXISTS guardians CASCADE;
DROP TABLE IF EXISTS student_transport CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS buses CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS transport_areas CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS terms CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS attendance_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS grade_status CASCADE;
DROP TYPE IF EXISTS gender CASCADE;
DROP TYPE IF EXISTS facility_type CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS log_grade_revision CASCADE;

-- ================================================
-- ENUMS
-- ================================================

CREATE TYPE user_role AS ENUM (
  'owner',
  'admin',
  'teacher',
  'class_supervisor',
  'student',
  'parent',
  'accountant'
);

CREATE TYPE attendance_status AS ENUM (
  'present',
  'absent',
  'late',
  'excused'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'overdue',
  'cancelled'
);

CREATE TYPE grade_status AS ENUM (
  'draft',
  'submitted',
  'locked'
);

CREATE TYPE gender AS ENUM (
  'male',
  'female'
);

CREATE TYPE facility_type AS ENUM (
  'classroom',
  'lab',
  'sports',
  'music_room',
  'library',
  'other'
);

-- ================================================
-- CORE TABLES (in dependency order)
-- ================================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  full_name_ar TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teachers (must be created before classes)
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  employee_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  first_name_ar TEXT NOT NULL,
  father_name TEXT,
  father_name_ar TEXT,
  grandfather_name TEXT,
  grandfather_name_ar TEXT,
  family_name TEXT,
  family_name_ar TEXT,
  last_name TEXT NOT NULL,
  last_name_ar TEXT NOT NULL,
  gender gender NOT NULL,
  date_of_birth DATE,
  phone TEXT,
  email TEXT UNIQUE NOT NULL,
  hire_date DATE NOT NULL,
  specialization TEXT,
  specialization_ar TEXT,
  qualifications TEXT,
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Facilities & Rooms
CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  type facility_type NOT NULL DEFAULT 'classroom',
  capacity INTEGER,
  is_shared BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes (must be created before students)
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  grade_level INTEGER NOT NULL,
  section TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  class_supervisor_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
  capacity INTEGER DEFAULT 25,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(grade_level, section, academic_year)
);

-- Transport Areas
CREATE TABLE transport_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  annual_fee DECIMAL(10,3) NOT NULL,
  academic_year TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buses (assigned to transport areas)
CREATE TABLE buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number TEXT UNIQUE NOT NULL,
  plate_number TEXT,
  driver_name TEXT NOT NULL,
  driver_name_ar TEXT NOT NULL,
  driver_father_name TEXT,
  driver_father_name_ar TEXT,
  driver_grandfather_name TEXT,
  driver_grandfather_name_ar TEXT,
  driver_family_name TEXT,
  driver_family_name_ar TEXT,
  driver_photo_url TEXT,
  driver_phone TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 40,
  transport_area_id UUID NOT NULL REFERENCES transport_areas(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students (now classes exists)
-- Omani names: first_name / father_name / grandfather_name / family_name (4-part)
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  student_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  first_name_ar TEXT NOT NULL,
  father_name TEXT NOT NULL,
  father_name_ar TEXT NOT NULL,
  grandfather_name TEXT NOT NULL,
  grandfather_name_ar TEXT NOT NULL,
  family_name TEXT NOT NULL,
  family_name_ar TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender gender NOT NULL,
  nationality TEXT DEFAULT 'Omani',
  national_id TEXT,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  enrollment_date DATE NOT NULL,
  photo_url TEXT,
  gps_location TEXT,
  medical_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Transport (links student to transport area + bus)
CREATE TABLE student_transport (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  transport_area_id UUID NOT NULL REFERENCES transport_areas(id) ON DELETE CASCADE,
  bus_id UUID NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, academic_year)
);

-- Guardians (Parents)
-- Full 4-part Omani names in both EN and AR
CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  first_name_ar TEXT NOT NULL,
  father_name TEXT,
  father_name_ar TEXT,
  grandfather_name TEXT,
  grandfather_name_ar TEXT,
  family_name TEXT NOT NULL,
  family_name_ar TEXT NOT NULL,
  relationship TEXT NOT NULL,
  relationship_ar TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  work_phone TEXT,
  address TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student-Guardian relationship
CREATE TABLE student_guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_id UUID NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  is_primary_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, guardian_id)
);

-- Subjects
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  is_activity BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grade-level subject assignments (which subjects apply to which grade levels)
CREATE TABLE grade_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  grade_level INTEGER NOT NULL,
  periods_per_week INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject_id, grade_level)
);

-- Class Subjects (specific class + subject + teacher assignment)
CREATE TABLE class_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  periods_per_week INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, subject_id)
);

-- ================================================
-- SCORING CATEGORIES (assessment breakdown per subject per grade)
-- Defines what % each assessment type contributes to the final grade
-- All percentages for a subject+grade must sum to 100
-- ================================================

CREATE TABLE scoring_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  grade_level INTEGER NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  max_score DECIMAL(5,2) NOT NULL DEFAULT 100,
  sort_order INTEGER DEFAULT 0,
  academic_year TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ACADEMIC TABLES
-- ================================================

-- Academic Terms
CREATE TABLE terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exams
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  class_subject_id UUID NOT NULL REFERENCES class_subjects(id) ON DELETE CASCADE,
  scoring_category_id UUID REFERENCES scoring_categories(id) ON DELETE SET NULL,
  term_id UUID REFERENCES terms(id) ON DELETE SET NULL,
  exam_date DATE,
  max_score DECIMAL(5,2) NOT NULL,
  weight DECIMAL(5,2) DEFAULT 1.0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grades
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL,
  status grade_status DEFAULT 'draft',
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  remarks TEXT,
  submitted_at TIMESTAMPTZ,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, exam_id)
);

-- Grade Revisions
CREATE TABLE grade_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  previous_score DECIMAL(5,2) NOT NULL,
  new_score DECIMAL(5,2) NOT NULL,
  previous_status grade_status NOT NULL,
  new_status grade_status NOT NULL,
  revised_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance Sessions
CREATE TABLE attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  period INTEGER,
  teacher_id UUID REFERENCES teachers(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, date, period)
);

-- Attendance Records
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status attendance_status NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- Timetable
CREATE TABLE timetable_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_subject_id UUID NOT NULL REFERENCES class_subjects(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL,
  period INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  facility_id UUID REFERENCES facilities(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- FINANCE TABLES
-- ================================================

-- Fee Structures (by grade level tier)
CREATE TABLE fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  grade_levels INTEGER[] NOT NULL,
  total_amount DECIMAL(10,3) NOT NULL,
  books_fee DECIMAL(10,3) NOT NULL DEFAULT 0,
  school_fee DECIMAL(10,3) NOT NULL DEFAULT 0,
  services_fee DECIMAL(10,3) NOT NULL DEFAULT 0,
  registration_fee DECIMAL(10,3) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee Items (individual line items for invoices)
CREATE TABLE fee_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,3) NOT NULL,
  academic_year TEXT NOT NULL,
  grade_levels INTEGER[],
  is_mandatory BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  total_amount DECIMAL(10,3) NOT NULL,
  paid_amount DECIMAL(10,3) DEFAULT 0,
  status payment_status DEFAULT 'pending',
  due_date DATE NOT NULL,
  issued_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Items
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  fee_item_id UUID REFERENCES fee_items(id),
  description TEXT NOT NULL,
  description_ar TEXT,
  amount DECIMAL(10,3) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number TEXT UNIQUE NOT NULL,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10,3) NOT NULL,
  payment_date DATE DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL,
  reference_number TEXT,
  notes TEXT,
  received_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- COMMUNICATION TABLES
-- ================================================

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  parent_message_id UUID REFERENCES messages(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  content TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES profiles(id),
  target_roles user_role[],
  target_classes UUID[],
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- AUDIT & LOGS
-- ================================================

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- INDEXES
-- ================================================

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_active ON students(is_active);
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_family_name ON students(family_name);
CREATE INDEX idx_students_family_name_ar ON students(family_name_ar);
CREATE INDEX idx_teachers_active ON teachers(is_active);
CREATE INDEX idx_teachers_employee_id ON teachers(employee_id);
CREATE INDEX idx_classes_year ON classes(academic_year);
CREATE INDEX idx_classes_grade ON classes(grade_level);
CREATE INDEX idx_classes_supervisor ON classes(class_supervisor_id);
CREATE INDEX idx_facilities_type ON facilities(type);
CREATE INDEX idx_grade_subjects_grade ON grade_subjects(grade_level);
CREATE INDEX idx_grade_subjects_subject ON grade_subjects(subject_id);
CREATE INDEX idx_scoring_cat_subject ON scoring_categories(subject_id);
CREATE INDEX idx_scoring_cat_grade ON scoring_categories(grade_level);
CREATE INDEX idx_scoring_cat_year ON scoring_categories(academic_year);
CREATE INDEX idx_exams_scoring_cat ON exams(scoring_category_id);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_exam ON grades(exam_id);
CREATE INDEX idx_grades_status ON grades(status);
CREATE INDEX idx_attendance_session ON attendance_records(session_id);
CREATE INDEX idx_attendance_student ON attendance_records(student_id);
CREATE INDEX idx_attendance_status ON attendance_records(status);
CREATE INDEX idx_invoices_student ON invoices(student_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_unread ON messages(recipient_id, is_read);
CREATE INDEX idx_transport_areas_year ON transport_areas(academic_year);
CREATE INDEX idx_buses_area ON buses(transport_area_id);
CREATE INDEX idx_student_transport_student ON student_transport(student_id);
CREATE INDEX idx_student_transport_area ON student_transport(transport_area_id);
CREATE INDEX idx_student_transport_bus ON student_transport(bus_id);

-- ================================================
-- TRIGGERS
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scoring_categories_updated_at BEFORE UPDATE ON scoring_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON attendance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON facilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transport_areas_updated_at BEFORE UPDATE ON transport_areas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fee_structures_updated_at BEFORE UPDATE ON fee_structures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- RLS POLICIES
-- ================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Owners and admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- Students policies
CREATE POLICY "Students can view their own record" ON students
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Staff can view all students" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'teacher', 'class_supervisor')
    )
  );

-- Grades policies
CREATE POLICY "Students can view their own grades" ON grades
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM students WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage grades" ON grades
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'teacher')
    )
  );

-- Messages policies
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Read-only policies for reference tables
CREATE POLICY "Authenticated users can view subjects" ON subjects
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view classes" ON classes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view facilities" ON facilities
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view transport areas" ON transport_areas
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view buses" ON buses
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view fee structures" ON fee_structures
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view scoring categories" ON scoring_categories
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view all teachers" ON teachers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'teacher', 'class_supervisor')
    )
  );

CREATE POLICY "Staff can view guardians" ON guardians
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'teacher', 'class_supervisor')
    )
  );

CREATE POLICY "Staff can view attendance" ON attendance_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'teacher', 'class_supervisor')
    )
  );

CREATE POLICY "Staff can view invoices" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'accountant')
    )
  );

CREATE POLICY "Staff can view payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'accountant')
    )
  );

CREATE POLICY "Published announcements visible to all" ON announcements
  FOR SELECT USING (is_published = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Staff can view student transport" ON student_transport
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'accountant')
    )
  );

-- Student-Guardian link policies
CREATE POLICY "Staff can view student guardians" ON student_guardians
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'teacher', 'class_supervisor')
    )
  );

-- Grade-level subject assignment policies
CREATE POLICY "Authenticated users can view grade subjects" ON grade_subjects
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Class subject assignment policies
CREATE POLICY "Authenticated users can view class subjects" ON class_subjects
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Terms policies
CREATE POLICY "Authenticated users can view terms" ON terms
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Exams policies
CREATE POLICY "Staff can view exams" ON exams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'teacher', 'class_supervisor')
    )
  );

CREATE POLICY "Teachers can manage exams" ON exams
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'teacher')
    )
  );

-- Grade revisions policies
CREATE POLICY "Staff can view grade revisions" ON grade_revisions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'teacher')
    )
  );

-- Attendance sessions policies
CREATE POLICY "Staff can view attendance sessions" ON attendance_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'teacher', 'class_supervisor')
    )
  );

CREATE POLICY "Teachers can manage attendance sessions" ON attendance_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'teacher', 'class_supervisor')
    )
  );

-- Timetable policies
CREATE POLICY "Authenticated users can view timetable" ON timetable_slots
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Fee items policies
CREATE POLICY "Authenticated users can view fee items" ON fee_items
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Invoice items policies
CREATE POLICY "Staff can view invoice items" ON invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin', 'accountant')
    )
  );

-- Audit logs policies
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('owner', 'admin')
    )
  );

-- ================================================
-- GRADE REVISION TRACKING
-- ================================================

CREATE OR REPLACE FUNCTION log_grade_revision()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.score != NEW.score OR OLD.status != NEW.status THEN
    INSERT INTO public.grade_revisions (
      grade_id,
      previous_score,
      new_score,
      previous_status,
      new_status,
      revised_by
    ) VALUES (
      NEW.id,
      OLD.score,
      NEW.score,
      OLD.status,
      NEW.status,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE TRIGGER track_grade_revisions
  BEFORE UPDATE ON grades
  FOR EACH ROW
  EXECUTE FUNCTION log_grade_revision();

-- ================================================
-- INITIAL DATA
-- ================================================

INSERT INTO terms (name, name_ar, academic_year, start_date, end_date, is_current)
VALUES
  ('First Term 2025-2026', 'الفصل الأول 2025-2026', '2025-2026', '2025-09-01', '2025-12-31', false),
  ('Second Term 2025-2026', 'الفصل الثاني 2025-2026', '2025-2026', '2026-01-01', '2026-06-30', true);
