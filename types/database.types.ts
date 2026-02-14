// Database Types for Mashaail School Management System
// Auto-generated from Supabase schema

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
      // Tables will be defined as we create the schema
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
    }
  }
}
