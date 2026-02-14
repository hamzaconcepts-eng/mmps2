# Supabase Database Setup

This directory contains the complete database schema for the Mashaail School Management System.

## Schema Overview

The database schema includes:

### **Core Tables**
- `profiles` - User profiles (extends Supabase auth.users)
- `students` - Student records
- `guardians` - Parent/guardian information
- `student_guardians` - Student-guardian relationships
- `teachers` - Teacher profiles
- `classes` - Class configuration
- `subjects` - Subject definitions
- `class_subjects` - Class-subject-teacher assignments

### **Academic Tables**
- `terms` - Academic terms/semesters
- `exams` - Exam definitions
- `grades` - Student grades
- `grade_revisions` - Grade change audit trail
- `attendance_sessions` - Attendance sessions
- `attendance_records` - Student attendance records
- `timetable_slots` - Class timetable

### **Finance Tables**
- `fee_items` - Fee structure
- `invoices` - Student invoices
- `invoice_items` - Invoice line items
- `payments` - Payment records

### **Communication Tables**
- `messages` - Internal messaging
- `announcements` - School announcements

### **Audit Tables**
- `audit_logs` - System audit trail

## How to Apply the Schema

### Method 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://ulrmjmmqbewhadtmvzlt.supabase.co
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `schema.sql`
5. Paste into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`

### Method 2: Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ulrmjmmqbewhadtmvzlt

# Apply migrations
supabase db push
```

## Key Features

### **Row Level Security (RLS)**
- All tables have RLS enabled
- Role-based access policies
- Students can only view their own data
- Teachers can view their assigned students/classes
- Admins and Owners have full access

### **Automatic Timestamps**
- `created_at` and `updated_at` fields
- Automatically managed via triggers

### **Grade Integrity**
- Grade status workflow: `draft` → `submitted` → `locked`
- Automatic revision tracking
- Teachers cannot delete submitted grades
- Full audit trail maintained

### **Indexes**
- Optimized for common queries
- Composite indexes for complex lookups
- Performance-focused design

## User Roles

1. **Owner** - Full system access
2. **Admin** - Full operational control (no security settings)
3. **Teacher** - Subject-based access, grade management
4. **Class Supervisor** - Class-wide academic overview
5. **Student** - View own grades, attendance, reports
6. **Parent** - View children's data, fees
7. **Accountant** - Finance management only

## Next Steps

After applying the schema:

1. **Create test users** via Supabase Authentication
2. **Insert sample data** for testing
3. **Verify RLS policies** are working correctly
4. **Generate TypeScript types** using Supabase CLI

## Generating TypeScript Types

```bash
# Generate types from your database
npx supabase gen types typescript --project-id ulrmjmmqbewhadtmvzlt > types/database.types.ts
```

## Important Notes

- **Backup First**: Always backup your database before applying schema changes
- **Test Environment**: Consider applying to a test project first
- **Service Role Key**: Some operations require the service role key (not included in repo)
- **Security**: Never commit `.env.local` or service role keys to Git

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review RLS policies if access issues occur
- Check audit logs for debugging
