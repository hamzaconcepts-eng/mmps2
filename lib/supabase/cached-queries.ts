import { unstable_cache } from 'next/cache';
import { createAdminClient } from './admin';

/**
 * Cached Supabase queries for the owner dashboard.
 * Each function wraps a Supabase call with Next.js unstable_cache
 * so results are stored in the Data Cache and reused across requests.
 *
 * Tags allow on-demand revalidation when data changes via server actions:
 *   revalidateTag('students')  — bust student-related caches
 *   revalidateTag('dashboard') — bust all dashboard caches
 */

// ── Dashboard stats (counts + finance) ─────────────────────────

export const getDashboardStats = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const [studentsRes, studentsGenderRes, teachersRes, invoicesRes, classesRes, transportRes, paidInvoicesRes] = await Promise.all([
      supabase.from('students').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('students').select('gender').eq('is_active', true),
      supabase.from('teachers').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('invoices').select('total_amount, paid_amount, status').eq('academic_year', '2025-2026'),
      supabase.from('classes').select('id', { count: 'exact', head: true }).eq('academic_year', '2025-2026').eq('is_active', true),
      supabase.from('student_transport').select('id', { count: 'exact', head: true }).eq('academic_year', '2025-2026').eq('is_active', true),
      supabase.from('invoices').select('id', { count: 'exact', head: true }).eq('academic_year', '2025-2026').eq('status', 'paid'),
    ]);

    const genderData = studentsGenderRes.data || [];
    const maleCount = genderData.filter((s: any) => s.gender === 'male').length;
    const femaleCount = genderData.filter((s: any) => s.gender === 'female').length;

    const invoices = invoicesRes.data || [];
    const totalRevenue = invoices.reduce((s, i: any) => s + (i.paid_amount || 0), 0);
    const totalInvoiced = invoices.reduce((s, i: any) => s + (i.total_amount || 0), 0);
    const totalPending = invoices
      .filter((i: any) => i.status === 'pending' || i.status === 'overdue')
      .reduce((s, i: any) => s + ((i.total_amount || 0) - (i.paid_amount || 0)), 0);
    const collectionRate = totalInvoiced > 0 ? ((totalRevenue / totalInvoiced) * 100).toFixed(1) : '0';
    const pendingCount = invoices.filter((i: any) => i.status === 'pending').length;
    const overdueCount = invoices.filter((i: any) => i.status === 'overdue').length;
    const paidCount = paidInvoicesRes.count || 0;

    return {
      studentCount: studentsRes.count || 0,
      maleCount,
      femaleCount,
      teacherCount: teachersRes.count || 0,
      classCount: classesRes.count || 0,
      transportCount: transportRes.count || 0,
      totalRevenue,
      totalInvoiced,
      totalPending,
      collectionRate,
      pendingCount,
      overdueCount,
      paidCount,
    };
  },
  ['dashboard-stats'],
  { revalidate: 300, tags: ['dashboard', 'students', 'teachers', 'invoices'] }
);

export const getRecentStudents = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('students')
      .select('first_name, first_name_ar, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, gender, student_id, created_at, classes(name, name_ar)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5);
    return data || [];
  },
  ['recent-students'],
  { revalidate: 120, tags: ['dashboard', 'students'] }
);

// ── Teachers list ──────────────────────────────────────────────

export const getAllTeachers = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('teachers')
      .select('*')
      .eq('is_active', true)
      .order('employee_id');
    return data || [];
  },
  ['all-teachers'],
  { revalidate: 300, tags: ['teachers'] }
);

// ── Classes list with supervisors + student counts ─────────────

export const getClassesWithCounts = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const [classesRes, studentsRes] = await Promise.all([
      supabase
        .from('classes')
        .select('*, teachers!classes_class_supervisor_id_fkey(id, first_name, first_name_ar, father_name, father_name_ar, grandfather_name, grandfather_name_ar, family_name, family_name_ar, last_name, last_name_ar, gender)')
        .eq('is_active', true)
        .eq('academic_year', '2025-2026')
        .order('grade_level')
        .order('section'),
      supabase
        .from('students')
        .select('class_id')
        .eq('is_active', true),
    ]);
    const classes = classesRes.data || [];
    const students = studentsRes.data || [];
    const countMap: Record<string, number> = {};
    students.forEach((s: any) => {
      if (s.class_id) countMap[s.class_id] = (countMap[s.class_id] || 0) + 1;
    });
    return { classes, countMap };
  },
  ['classes-with-counts'],
  { revalidate: 300, tags: ['classes', 'students'] }
);

// ── Subjects with grade levels + scoring categories ────────────

export const getSubjectsWithDetails = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const [subjectsRes, gradeSubjectsRes, scoringRes] = await Promise.all([
      supabase.from('subjects').select('*').eq('is_active', true).order('code'),
      supabase.from('grade_subjects').select('subject_id, grade_level').eq('is_active', true),
      supabase.from('scoring_categories').select('subject_id, name, name_ar, percentage, grade_level').eq('is_active', true).eq('academic_year', '2025-2026').order('sort_order'),
    ]);
    const subjects = subjectsRes.data || [];
    const gradeSubjects = gradeSubjectsRes.data || [];
    const scoringCategories = scoringRes.data || [];

    const gradeLevelMap: Record<string, number[]> = {};
    gradeSubjects.forEach((gs: any) => {
      if (!gradeLevelMap[gs.subject_id]) gradeLevelMap[gs.subject_id] = [];
      gradeLevelMap[gs.subject_id].push(gs.grade_level);
    });
    const scoringMap: Record<string, any[]> = {};
    scoringCategories.forEach((sc: any) => {
      if (!scoringMap[sc.subject_id]) scoringMap[sc.subject_id] = [];
      if (!scoringMap[sc.subject_id].find((c: any) => c.name === sc.name)) {
        scoringMap[sc.subject_id].push(sc);
      }
    });
    return { subjects, gradeLevelMap, scoringMap };
  },
  ['subjects-with-details'],
  { revalidate: 600, tags: ['subjects'] }
);

// ── Transport (areas + buses + student counts) ─────────────────

export const getTransportData = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const [areasRes, busesRes, transportRes] = await Promise.all([
      supabase.from('transport_areas').select('*').eq('academic_year', '2025-2026').eq('is_active', true).order('name'),
      supabase.from('buses').select('*').eq('is_active', true).order('bus_number'),
      supabase.from('student_transport').select('bus_id').eq('academic_year', '2025-2026').eq('is_active', true),
    ]);
    const areas = areasRes.data || [];
    const buses = busesRes.data || [];
    const transports = transportRes.data || [];
    const busStudentCount: Record<string, number> = {};
    transports.forEach((t: any) => {
      busStudentCount[t.bus_id] = (busStudentCount[t.bus_id] || 0) + 1;
    });
    const busesByArea: Record<string, any[]> = {};
    buses.forEach((bus: any) => {
      if (!busesByArea[bus.transport_area_id]) busesByArea[bus.transport_area_id] = [];
      busesByArea[bus.transport_area_id].push(bus);
    });
    return { areas, buses, transports, busStudentCount, busesByArea };
  },
  ['transport-data'],
  { revalidate: 600, tags: ['transport'] }
);

// ── Invoice stats (for the stats bar) ──────────────────────────

export const getInvoiceStats = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('invoices')
      .select('total_amount, paid_amount, status')
      .eq('academic_year', '2025-2026');
    const invoices = data || [];
    const totalInvoiced = invoices.reduce((s, i: any) => s + (i.total_amount || 0), 0);
    const totalCollected = invoices.reduce((s, i: any) => s + (i.paid_amount || 0), 0);
    const outstanding = totalInvoiced - totalCollected;
    const overdueCount = invoices.filter((i: any) => i.status === 'overdue').length;
    return { totalInvoiced, totalCollected, outstanding, overdueCount };
  },
  ['invoice-stats'],
  { revalidate: 300, tags: ['invoices'] }
);

// ── Classes list for filter dropdowns ──────────────────────────

export const getClassesList = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('classes')
      .select('id, name, name_ar, grade_level, section')
      .eq('is_active', true)
      .order('grade_level')
      .order('section');
    return data || [];
  },
  ['classes-list'],
  { revalidate: 600, tags: ['classes'] }
);
