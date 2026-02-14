# Username-Based Authentication Guide

This system uses **username and password** authentication instead of email-based auth.

## How It Works

1. **User Login**: Users enter their username (e.g., `admin`, `teacher01`)
2. **Backend Conversion**: Username is converted to email format (`admin@mashaail.school`)
3. **Supabase Auth**: Uses email/password auth internally
4. **User Experience**: Only usernames are shown throughout the app

## Creating New Users

### Step 1: Create Auth User in Supabase

Go to Supabase Dashboard → Authentication → Users → Add User

```
Email: admin@mashaail.school  (username + @mashaail.school)
Password: [secure password]
Auto Confirm User: ✓ (checked)
```

### Step 2: Create Profile Record

After creating the auth user, run this SQL in the SQL Editor:

```sql
-- Replace values with actual user data
INSERT INTO profiles (id, username, role, full_name, full_name_ar)
VALUES (
  '[USER_ID_FROM_AUTH_USERS]',  -- Copy from auth.users table
  'admin',                        -- The username (without @mashaail.school)
  'admin',                        -- Role: owner, admin, teacher, etc.
  'Admin User',                   -- Full name in English
  'مستخدم المشرف'                 -- Full name in Arabic
);
```

## Example Users to Create

### Owner Account
```sql
-- Auth: owner@mashaail.school / SecurePassword123!
INSERT INTO profiles (id, username, role, full_name, full_name_ar)
VALUES ('[UUID]', 'owner', 'owner', 'System Owner', 'مالك النظام');
```

### Admin Account
```sql
-- Auth: admin@mashaail.school / AdminPass123!
INSERT INTO profiles (id, username, role, full_name, full_name_ar)
VALUES ('[UUID]', 'admin', 'admin', 'Administrator', 'المدير');
```

### Teacher Account
```sql
-- Auth: teacher01@mashaail.school / TeacherPass123!
INSERT INTO profiles (id, username, role, full_name, full_name_ar)
VALUES ('[UUID]', 'teacher01', 'teacher', 'Ahmed Al-Said', 'أحمد السعيد');
```

### Student Account
```sql
-- Auth: student123@mashaail.school / StudentPass123!
INSERT INTO profiles (id, username, role, full_name, full_name_ar)
VALUES ('[UUID]', 'student123', 'student', 'Sara Mohammed', 'سارة محمد');
```

## Login Examples

Users log in with:
- **Username**: `admin` (not `admin@mashaail.school`)
- **Password**: Their password

The system automatically converts:
- `admin` → `admin@mashaail.school` (for Supabase)
- Display shows: `admin` (never shows the email)

## Username Rules

- **Length**: 3-20 characters
- **Format**: Letters, numbers, underscore
- **Start**: Must start with a letter
- **Examples**:
  - ✓ `admin`, `teacher01`, `ahmad_ali`, `s12345`
  - ✗ `ab`, `123user`, `user@name`, `very-long-username-here`

## Security Notes

- Users never see or know about the `@mashaail.school` email format
- All authentication happens through Supabase's secure auth system
- Passwords are hashed and stored securely by Supabase
- The internal email format is transparent to users

## Quick Setup Script

Run this after applying the schema to create a test admin user:

```sql
-- 1. First create auth user in Supabase UI:
--    Email: admin@mashaail.school
--    Password: Admin123!
--    Auto Confirm: ✓

-- 2. Then run this (replace [USER_ID] with the UUID from step 1):
INSERT INTO profiles (id, username, role, full_name, full_name_ar)
VALUES ('[USER_ID]', 'admin', 'admin', 'Test Admin', 'مدير تجريبي');

-- 3. Login with:
--    Username: admin
--    Password: Admin123!
```
