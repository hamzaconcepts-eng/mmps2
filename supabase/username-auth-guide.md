# Username-Based Authentication - No Emails Required

This system uses **username and password only** - no email interaction at any point.

## ✨ Key Features

- ✅ **Create users**: Only username, password, and name required
- ✅ **Login**: Username + password (no email field)
- ✅ **Zero email exposure**: Users never see or enter emails
- ✅ **Admin interface**: Create users through the web UI
- ✅ **Backend magic**: Email conversion happens transparently

## 🎯 How It Works

```
Admin Interface → Username: "admin" + Password
                     ↓
Server Action → Converts to "admin@mashaail.school" internally
                     ↓
Supabase Auth → Creates user with converted email
                     ↓
Profile Created → Stores username: "admin"
                     ↓
User Login → Enters username: "admin" (never sees email)
```

## 🚀 Creating Users (Admin Interface)

### Option 1: Web UI (Recommended)

1. Login as admin/owner
2. Go to `/admin/users`
3. Fill in the form:
   - **Username**: `teacher01` (3-20 chars, alphanumeric + underscore)
   - **Password**: Secure password (min 8 chars)
   - **Full Name (EN)**: Ahmed Al-Said
   - **Full Name (AR)**: أحمد السعيد
   - **Role**: teacher
   - **Phone**: +968 9123 4567 (optional)
4. Click "Create User"
5. ✅ Done! User can now login with `teacher01` + password

### Option 2: Environment Setup (.env.local)

Add this to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**To get your service role key:**
1. Go to Supabase Dashboard
2. Project Settings → API
3. Copy the `service_role` key (under "Project API keys")
4. ⚠️ **Never commit this key to Git!**

## 📝 Example Users

Create these through the admin interface at `/admin/users`:

### System Owner
- **Username**: `owner`
- **Password**: `Owner123!`
- **Full Name**: System Owner / مالك النظام
- **Role**: owner

### Admin
- **Username**: `admin`
- **Password**: `Admin123!`
- **Full Name**: Administrator / المدير
- **Role**: admin

### Teacher
- **Username**: `teacher01`
- **Password**: `Teacher123!`
- **Full Name**: Ahmed Al-Said / أحمد السعيد
- **Role**: teacher

### Student
- **Username**: `student123`
- **Password**: `Student123!`
- **Full Name**: Sara Mohammed / سارة محمد
- **Role**: student

## 🔑 Login Process

Users login with:
- **Username field**: `admin` (visible to user)
- **Password field**: Their password
- **Backend**: Automatically converts `admin` → `admin@mashaail.school`
- **User sees**: Only username, never the email

## ⚙️ Technical Details

### Username Rules
- **Length**: 3-20 characters
- **Start**: Must begin with a letter
- **Characters**: Letters, numbers, underscore only
- **Examples**: `admin`, `teacher01`, `ahmad_ali`, `s12345`
- **Invalid**: `ab`, `123user`, `user@name`, `very-long-username`

### Server Actions
- `createUser()`: Creates auth user + profile in one transaction
- `deleteUser()`: Removes both auth user and profile
- `updateUserPassword()`: Changes user password
- `toggleUserStatus()`: Enable/disable user account

### Security
- Service role key required for user creation
- Only admin/owner roles can access user management
- Passwords hashed by Supabase
- RLS policies prevent unauthorized access
- Email conversion happens server-side only

## 🎨 Admin Interface Location

- **URL**: `/en/admin/users` or `/ar/admin/users`
- **Access**: Owner and Admin roles only
- **Features**:
  - Create new users
  - View user list (coming soon)
  - Reset passwords (coming soon)
  - Toggle user status (coming soon)

## 🔒 Important Notes

1. **Never expose service role key**: Only use it server-side
2. **Email is internal only**: Users never interact with emails
3. **Login uses username**: Not email, even though Supabase uses email internally
4. **Admin creates users**: No public registration (school system)
5. **Unique usernames**: System enforces uniqueness

## 🚨 First-Time Setup

### 1. Add Service Role Key to .env.local
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Create First Admin (Bootstrap)

Since you need an admin to create users, create the first one manually:

**A. In Supabase Dashboard → Authentication → Users:**
```
Email: owner@mashaail.school
Password: Owner123!
Auto Confirm: ✓
```

**B. In Supabase SQL Editor:**
```sql
-- Get the user ID from auth.users table first, then:
INSERT INTO profiles (id, username, role, full_name, full_name_ar)
VALUES (
  'PASTE_USER_ID_HERE',
  'owner',
  'owner',
  'System Owner',
  'مالك النظام'
);
```

**C. Login:**
- Username: `owner`
- Password: `Owner123!`

**D. Create other users:**
- Go to `/admin/users`
- Use the web interface (no more manual SQL!)

## ✅ That's It!

No more dealing with emails. Everything is username-based from the user's perspective!
