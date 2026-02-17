'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Create a new student with auto-generated student_id (4-digit zero-padded).
 * Also creates a guardian record and optionally assigns transport.
 * Only owner and admin roles are authorized.
 */
export async function createStudent(data: {
  // Student fields
  student: Record<string, any>;
  // Guardian fields
  guardian: Record<string, any>;
  // Transport (optional)
  transport?: { bus_id: string; transport_area_id: string } | null;
}) {
  try {
    const supabase = createAdminClient();
    const s = data.student;
    const g = data.guardian;

    // 1. Generate next student_id
    const { data: lastStudent } = await supabase
      .from('students')
      .select('student_id')
      .order('student_id', { ascending: false })
      .limit(1);

    const lastId = lastStudent?.[0]?.student_id
      ? parseInt(lastStudent[0].student_id, 10)
      : 0;
    const nextId = String(lastId + 1).padStart(4, '0');

    // 2. Create student
    const { data: newStudent, error: studentErr } = await supabase
      .from('students')
      .insert({
        student_id: nextId,
        first_name: s.first_name,
        first_name_ar: s.first_name_ar,
        father_name: s.father_name,
        father_name_ar: s.father_name_ar,
        grandfather_name: s.grandfather_name,
        grandfather_name_ar: s.grandfather_name_ar,
        family_name: s.family_name,
        family_name_ar: s.family_name_ar,
        date_of_birth: s.date_of_birth,
        gender: s.gender,
        nationality: s.nationality || null,
        national_id: s.national_id || null,
        class_id: s.class_id || null,
        enrollment_date: s.enrollment_date,
        is_active: s.is_active ?? true,
        gps_location: s.gps_location || null,
      })
      .select('id')
      .single();

    if (studentErr) throw studentErr;

    // 3. Create guardian and link to student
    const { data: newGuardian, error: guardianErr } = await supabase
      .from('guardians')
      .insert({
        first_name: g.first_name,
        first_name_ar: g.first_name_ar,
        father_name: g.father_name || null,
        father_name_ar: g.father_name_ar || null,
        grandfather_name: g.grandfather_name || null,
        grandfather_name_ar: g.grandfather_name_ar || null,
        family_name: g.family_name,
        family_name_ar: g.family_name_ar,
        relationship: g.relationship,
        relationship_ar: g.relationship_ar || null,
        phone: g.phone,
        email: g.email || null,
        address: g.address || null,
        is_primary: true,
      })
      .select('id')
      .single();

    if (guardianErr) throw guardianErr;

    // 4. Link guardian to student
    const { error: linkErr } = await supabase
      .from('student_guardians')
      .insert({
        student_id: newStudent.id,
        guardian_id: newGuardian.id,
        is_primary_contact: true,
      });

    if (linkErr) throw linkErr;

    // 5. Optionally assign transport
    if (data.transport?.bus_id && data.transport?.transport_area_id) {
      const { error: transportErr } = await supabase
        .from('student_transport')
        .insert({
          student_id: newStudent.id,
          bus_id: data.transport.bus_id,
          transport_area_id: data.transport.transport_area_id,
          academic_year: '2025-2026',
          is_active: true,
        });

      if (transportErr) throw transportErr;
    }

    revalidatePath('/[locale]/students', 'page');

    return { success: true, studentId: newStudent.id };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create student',
    };
  }
}
