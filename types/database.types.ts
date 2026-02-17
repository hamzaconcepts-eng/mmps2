// Database Types for Mashaail School Management System
// Generated from Supabase schema
// Currency: OMR uses 3 decimal places

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          role: Database['public']['Enums']['user_role']
          full_name: string
          full_name_ar: string
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          role: Database['public']['Enums']['user_role']
          full_name: string
          full_name_ar: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          role?: Database['public']['Enums']['user_role']
          full_name?: string
          full_name_ar?: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          profile_id: string | null
          employee_id: string
          first_name: string
          first_name_ar: string
          last_name: string
          last_name_ar: string
          gender: Database['public']['Enums']['gender']
          date_of_birth: string | null
          phone: string | null
          email: string
          hire_date: string
          specialization: string | null
          specialization_ar: string | null
          qualifications: string | null
          national_id: string | null
          photo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          employee_id: string
          first_name: string
          first_name_ar: string
          last_name: string
          last_name_ar: string
          gender: Database['public']['Enums']['gender']
          date_of_birth?: string | null
          phone?: string | null
          email: string
          hire_date: string
          specialization?: string | null
          specialization_ar?: string | null
          qualifications?: string | null
          national_id?: string | null
          photo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          employee_id?: string
          first_name?: string
          first_name_ar?: string
          last_name?: string
          last_name_ar?: string
          gender?: Database['public']['Enums']['gender']
          date_of_birth?: string | null
          phone?: string | null
          email?: string
          hire_date?: string
          specialization?: string | null
          specialization_ar?: string | null
          qualifications?: string | null
          national_id?: string | null
          photo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      facilities: {
        Row: {
          id: string
          name: string
          name_ar: string
          code: string
          type: Database['public']['Enums']['facility_type']
          capacity: number | null
          is_shared: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar: string
          code: string
          type?: Database['public']['Enums']['facility_type']
          capacity?: number | null
          is_shared?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string
          code?: string
          type?: Database['public']['Enums']['facility_type']
          capacity?: number | null
          is_shared?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          name_ar: string
          grade_level: number
          section: string
          academic_year: string
          class_supervisor_id: string | null
          facility_id: string | null
          capacity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar: string
          grade_level: number
          section: string
          academic_year: string
          class_supervisor_id?: string | null
          facility_id?: string | null
          capacity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string
          grade_level?: number
          section?: string
          academic_year?: string
          class_supervisor_id?: string | null
          facility_id?: string | null
          capacity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transport_areas: {
        Row: {
          id: string
          name: string
          name_ar: string
          annual_fee: number
          academic_year: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar: string
          annual_fee: number
          academic_year: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string
          annual_fee?: number
          academic_year?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      buses: {
        Row: {
          id: string
          bus_number: string
          plate_number: string | null
          driver_name: string
          driver_name_ar: string
          driver_national_id: string | null
          driver_phone: string
          capacity: number
          transport_area_id: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bus_number: string
          plate_number?: string | null
          driver_name: string
          driver_name_ar: string
          driver_national_id?: string | null
          driver_phone: string
          capacity?: number
          transport_area_id: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bus_number?: string
          plate_number?: string | null
          driver_name?: string
          driver_name_ar?: string
          driver_national_id?: string | null
          driver_phone?: string
          capacity?: number
          transport_area_id?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          profile_id: string | null
          student_id: string
          first_name: string
          first_name_ar: string
          father_name: string
          father_name_ar: string
          grandfather_name: string
          grandfather_name_ar: string
          family_name: string
          family_name_ar: string
          date_of_birth: string
          gender: Database['public']['Enums']['gender']
          nationality: string | null
          national_id: string | null
          class_id: string | null
          enrollment_date: string
          photo_url: string | null
          gps_location: string | null
          medical_notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          student_id: string
          first_name: string
          first_name_ar: string
          father_name: string
          father_name_ar: string
          grandfather_name: string
          grandfather_name_ar: string
          family_name: string
          family_name_ar: string
          date_of_birth: string
          gender: Database['public']['Enums']['gender']
          nationality?: string | null
          national_id?: string | null
          class_id?: string | null
          enrollment_date: string
          photo_url?: string | null
          gps_location?: string | null
          medical_notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          student_id?: string
          first_name?: string
          first_name_ar?: string
          father_name?: string
          father_name_ar?: string
          grandfather_name?: string
          grandfather_name_ar?: string
          family_name?: string
          family_name_ar?: string
          date_of_birth?: string
          gender?: Database['public']['Enums']['gender']
          nationality?: string | null
          national_id?: string | null
          class_id?: string | null
          enrollment_date?: string
          photo_url?: string | null
          gps_location?: string | null
          medical_notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      student_transport: {
        Row: {
          id: string
          student_id: string
          transport_area_id: string
          bus_id: string
          academic_year: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          transport_area_id: string
          bus_id: string
          academic_year: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          transport_area_id?: string
          bus_id?: string
          academic_year?: string
          is_active?: boolean
          created_at?: string
        }
      }
      guardians: {
        Row: {
          id: string
          profile_id: string | null
          first_name: string
          first_name_ar: string
          father_name: string | null
          father_name_ar: string | null
          grandfather_name: string | null
          grandfather_name_ar: string | null
          family_name: string
          family_name_ar: string
          relationship: string
          relationship_ar: string | null
          email: string | null
          phone: string
          work_phone: string | null
          address: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          first_name: string
          first_name_ar: string
          father_name?: string | null
          father_name_ar?: string | null
          grandfather_name?: string | null
          grandfather_name_ar?: string | null
          family_name: string
          family_name_ar: string
          relationship: string
          relationship_ar?: string | null
          email?: string | null
          phone: string
          work_phone?: string | null
          address?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          first_name?: string
          first_name_ar?: string
          father_name?: string | null
          father_name_ar?: string | null
          grandfather_name?: string | null
          grandfather_name_ar?: string | null
          family_name?: string
          family_name_ar?: string
          relationship?: string
          relationship_ar?: string | null
          email?: string | null
          phone?: string
          work_phone?: string | null
          address?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      student_guardians: {
        Row: {
          id: string
          student_id: string
          guardian_id: string
          is_primary_contact: boolean
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          guardian_id: string
          is_primary_contact?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          guardian_id?: string
          is_primary_contact?: boolean
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          code: string
          name: string
          name_ar: string
          description: string | null
          is_activity: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          name_ar: string
          description?: string | null
          is_activity?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          name_ar?: string
          description?: string | null
          is_activity?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      grade_subjects: {
        Row: {
          id: string
          subject_id: string
          grade_level: number
          periods_per_week: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          grade_level: number
          periods_per_week?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          grade_level?: number
          periods_per_week?: number
          is_active?: boolean
          created_at?: string
        }
      }
      class_subjects: {
        Row: {
          id: string
          class_id: string
          subject_id: string
          teacher_id: string | null
          periods_per_week: number
          created_at: string
        }
        Insert: {
          id?: string
          class_id: string
          subject_id: string
          teacher_id?: string | null
          periods_per_week?: number
          created_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          subject_id?: string
          teacher_id?: string | null
          periods_per_week?: number
          created_at?: string
        }
      }
      scoring_categories: {
        Row: {
          id: string
          subject_id: string
          grade_level: number
          name: string
          name_ar: string
          percentage: number
          max_score: number
          sort_order: number
          academic_year: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          grade_level: number
          name: string
          name_ar: string
          percentage: number
          max_score?: number
          sort_order?: number
          academic_year: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          grade_level?: number
          name?: string
          name_ar?: string
          percentage?: number
          max_score?: number
          sort_order?: number
          academic_year?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      terms: {
        Row: {
          id: string
          name: string
          name_ar: string
          academic_year: string
          start_date: string
          end_date: string
          is_current: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar: string
          academic_year: string
          start_date: string
          end_date: string
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string
          academic_year?: string
          start_date?: string
          end_date?: string
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          name: string
          name_ar: string
          class_subject_id: string
          scoring_category_id: string | null
          term_id: string | null
          exam_date: string | null
          max_score: number
          weight: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar: string
          class_subject_id: string
          scoring_category_id?: string | null
          term_id?: string | null
          exam_date?: string | null
          max_score: number
          weight?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string
          class_subject_id?: string
          scoring_category_id?: string | null
          term_id?: string | null
          exam_date?: string | null
          max_score?: number
          weight?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      grades: {
        Row: {
          id: string
          student_id: string
          exam_id: string
          score: number
          status: Database['public']['Enums']['grade_status']
          teacher_id: string
          remarks: string | null
          submitted_at: string | null
          locked_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          exam_id: string
          score: number
          status?: Database['public']['Enums']['grade_status']
          teacher_id: string
          remarks?: string | null
          submitted_at?: string | null
          locked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          exam_id?: string
          score?: number
          status?: Database['public']['Enums']['grade_status']
          teacher_id?: string
          remarks?: string | null
          submitted_at?: string | null
          locked_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      grade_revisions: {
        Row: {
          id: string
          grade_id: string
          previous_score: number
          new_score: number
          previous_status: Database['public']['Enums']['grade_status']
          new_status: Database['public']['Enums']['grade_status']
          revised_by: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          grade_id: string
          previous_score: number
          new_score: number
          previous_status: Database['public']['Enums']['grade_status']
          new_status: Database['public']['Enums']['grade_status']
          revised_by: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          grade_id?: string
          previous_score?: number
          new_score?: number
          previous_status?: Database['public']['Enums']['grade_status']
          new_status?: Database['public']['Enums']['grade_status']
          revised_by?: string
          reason?: string | null
          created_at?: string
        }
      }
      attendance_sessions: {
        Row: {
          id: string
          class_id: string
          date: string
          period: number | null
          teacher_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          class_id: string
          date: string
          period?: number | null
          teacher_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          date?: string
          period?: number | null
          teacher_id?: string | null
          created_at?: string
        }
      }
      attendance_records: {
        Row: {
          id: string
          session_id: string
          student_id: string
          status: Database['public']['Enums']['attendance_status']
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          student_id: string
          status: Database['public']['Enums']['attendance_status']
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          student_id?: string
          status?: Database['public']['Enums']['attendance_status']
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      timetable_slots: {
        Row: {
          id: string
          class_subject_id: string
          day_of_week: number
          period: number
          start_time: string
          end_time: string
          facility_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_subject_id: string
          day_of_week: number
          period: number
          start_time: string
          end_time: string
          facility_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_subject_id?: string
          day_of_week?: number
          period?: number
          start_time?: string
          end_time?: string
          facility_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      fee_structures: {
        Row: {
          id: string
          name: string
          name_ar: string
          academic_year: string
          grade_levels: number[]
          total_amount: number
          books_fee: number
          school_fee: number
          services_fee: number
          registration_fee: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar: string
          academic_year: string
          grade_levels: number[]
          total_amount: number
          books_fee?: number
          school_fee?: number
          services_fee?: number
          registration_fee?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string
          academic_year?: string
          grade_levels?: number[]
          total_amount?: number
          books_fee?: number
          school_fee?: number
          services_fee?: number
          registration_fee?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      fee_items: {
        Row: {
          id: string
          name: string
          name_ar: string
          description: string | null
          amount: number
          academic_year: string
          grade_levels: number[] | null
          is_mandatory: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar: string
          description?: string | null
          amount: number
          academic_year: string
          grade_levels?: number[] | null
          is_mandatory?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string
          description?: string | null
          amount?: number
          academic_year?: string
          grade_levels?: number[] | null
          is_mandatory?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          student_id: string
          academic_year: string
          total_amount: number
          paid_amount: number
          status: Database['public']['Enums']['payment_status']
          due_date: string
          issued_date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          student_id: string
          academic_year: string
          total_amount: number
          paid_amount?: number
          status?: Database['public']['Enums']['payment_status']
          due_date: string
          issued_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          student_id?: string
          academic_year?: string
          total_amount?: number
          paid_amount?: number
          status?: Database['public']['Enums']['payment_status']
          due_date?: string
          issued_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          fee_item_id: string | null
          description: string
          description_ar: string | null
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          fee_item_id?: string | null
          description: string
          description_ar?: string | null
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          fee_item_id?: string | null
          description?: string
          description_ar?: string | null
          amount?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          payment_number: string
          invoice_id: string
          amount: number
          payment_date: string
          payment_method: string
          reference_number: string | null
          notes: string | null
          received_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          payment_number: string
          invoice_id: string
          amount: number
          payment_date?: string
          payment_method: string
          reference_number?: string | null
          notes?: string | null
          received_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          payment_number?: string
          invoice_id?: string
          amount?: number
          payment_date?: string
          payment_method?: string
          reference_number?: string | null
          notes?: string | null
          received_by?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          subject: string
          body: string
          is_read: boolean
          read_at: string | null
          parent_message_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          subject: string
          body: string
          is_read?: boolean
          read_at?: string | null
          parent_message_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          subject?: string
          body?: string
          is_read?: boolean
          read_at?: string | null
          parent_message_id?: string | null
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          title_ar: string
          content: string
          content_ar: string
          author_id: string
          target_roles: Database['public']['Enums']['user_role'][] | null
          target_classes: string[] | null
          is_published: boolean
          published_at: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          title_ar: string
          content: string
          content_ar: string
          author_id: string
          target_roles?: Database['public']['Enums']['user_role'][] | null
          target_classes?: string[] | null
          is_published?: boolean
          published_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          title_ar?: string
          content?: string
          content_ar?: string
          author_id?: string
          target_roles?: Database['public']['Enums']['user_role'][] | null
          target_classes?: string[] | null
          is_published?: boolean
          published_at?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'owner' | 'admin' | 'teacher' | 'class_supervisor' | 'student' | 'parent' | 'accountant'
      attendance_status: 'present' | 'absent' | 'late' | 'excused'
      payment_status: 'pending' | 'paid' | 'overdue' | 'cancelled'
      grade_status: 'draft' | 'submitted' | 'locked'
      gender: 'male' | 'female'
      facility_type: 'classroom' | 'lab' | 'sports' | 'music_room' | 'library' | 'other'
    }
  }
}
