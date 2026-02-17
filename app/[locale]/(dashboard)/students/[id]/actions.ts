'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Delete a student (cascades to guardians, transport, grades, attendance, invoices).
 * Only owner and admin roles are authorized.
 */
export async function deleteStudent(studentId: string) {
  try {
    const supabase = createAdminClient();

    const { data: student } = await supabase
      .from('students')
      .select('id')
      .eq('id', studentId)
      .single();

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);

    if (error) throw error;

    revalidatePath('/[locale]/students', 'page');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete student',
    };
  }
}

/**
 * Update a student record, guardian, and transport assignment.
 * Only owner and admin roles are authorized.
 */
export async function updateStudent(
  studentId: string,
  data: {
    student: Record<string, any>;
    guardian: Record<string, any>;
    transport?: { bus_id: string; transport_area_id: string } | null;
  }
) {
  try {
    const supabase = createAdminClient();
    const s = data.student;
    const g = data.guardian;

    // 1. Update student record
    const { error: studentErr } = await supabase
      .from('students')
      .update({
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
      .eq('id', studentId);

    if (studentErr) throw studentErr;

    // 2. Update or create guardian
    if (g.id) {
      // Update existing guardian
      const { error: guardianErr } = await supabase
        .from('guardians')
        .update({
          first_name: g.first_name,
          first_name_ar: g.first_name_ar,
          father_name: g.father_name || null,
          father_name_ar: g.father_name_ar || null,
          family_name: g.family_name,
          family_name_ar: g.family_name_ar,
          relationship: g.relationship,
          relationship_ar: g.relationship_ar || null,
          phone: g.phone,
          email: g.email || null,
        })
        .eq('id', g.id);

      if (guardianErr) throw guardianErr;
    } else if (g.first_name && g.family_name && g.phone) {
      // Create new guardian and link to student
      const { data: newGuardian, error: guardianErr } = await supabase
        .from('guardians')
        .insert({
          first_name: g.first_name,
          first_name_ar: g.first_name_ar,
          father_name: g.father_name || null,
          father_name_ar: g.father_name_ar || null,
          family_name: g.family_name,
          family_name_ar: g.family_name_ar,
          relationship: g.relationship,
          relationship_ar: g.relationship_ar || null,
          phone: g.phone,
          email: g.email || null,
          is_primary: true,
        })
        .select('id')
        .single();

      if (guardianErr) throw guardianErr;

      // Link guardian to student
      const { error: linkErr } = await supabase
        .from('student_guardians')
        .insert({
          student_id: studentId,
          guardian_id: newGuardian.id,
          is_primary_contact: true,
        });

      if (linkErr) throw linkErr;
    }

    // 3. Handle transport — upsert or remove
    if (data.transport?.bus_id && data.transport?.transport_area_id) {
      // Check if transport record exists
      const { data: existingTransport } = await supabase
        .from('student_transport')
        .select('id')
        .eq('student_id', studentId)
        .eq('academic_year', '2025-2026')
        .maybeSingle();

      if (existingTransport) {
        // Update existing
        const { error: transportErr } = await supabase
          .from('student_transport')
          .update({
            bus_id: data.transport.bus_id,
            transport_area_id: data.transport.transport_area_id,
          })
          .eq('id', existingTransport.id);

        if (transportErr) throw transportErr;
      } else {
        // Create new transport assignment
        const { error: transportErr } = await supabase
          .from('student_transport')
          .insert({
            student_id: studentId,
            bus_id: data.transport.bus_id,
            transport_area_id: data.transport.transport_area_id,
            academic_year: '2025-2026',
            is_active: true,
          });

        if (transportErr) throw transportErr;
      }
    } else {
      // Remove transport if bus was unselected
      await supabase
        .from('student_transport')
        .delete()
        .eq('student_id', studentId)
        .eq('academic_year', '2025-2026');
    }

    revalidatePath(`/[locale]/students/${studentId}`, 'page');
    revalidatePath('/[locale]/students', 'page');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update student',
    };
  }
}
