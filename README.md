# Mashaail School Management System

**مدرسة مشاعل مسقط الخاصة**

A comprehensive, bilingual (English/Arabic) school management system built with modern web technologies.

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom Mashaail theme
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **Internationalization**: next-intl with RTL/LTR support

## ✨ Features

### System Overview
- Single-school web application (no multi-branch support)
- 7 role-based access levels: Owner, Admin, Teacher, Class Supervisor, Student, Parent, Accountant
- Fully bilingual (English/Arabic) with RTL/LTR switching
- Sidebar navigation with grouped sections and icons
- Role-specific dashboards (executive vs operational)

### Core Modules
- **Students Management** - List, Add/Edit, Profile with tabs
- **Teachers Management** - Assignments and schedules
- **Classes & Subjects** - Configuration and management
- **Attendance Tracking** - Real-time monitoring and reports
- **Timetable Builder** - Interactive schedule management
- **Exams & Grades** - With revision tracking and audit trails
- **Fees & Finance** - Invoices, payments, reports
- **Parent Portal** - Child profiles and communication
- **Reports & Certificates** - PDF generation
- **Messaging & Announcements** - Internal communication
- **Settings** - Owner/Admin split configuration

### Design System
- **Dreamy Aesthetic** - Soft pastel colors with glassmorphism
- **Animated Backgrounds** - Floating gradient orbs
- **Glass Morphism** - Frosted glass effects throughout
- **Custom Color Palette** - Brand colors + dreamy pastels
- **Typography** - Nunito (Latin) + Noto Kufi Arabic

## 🎨 Brand Colors

- **Deep Teal** `#1B5E6B` - Sidebar, headings
- **Sky Blue** `#6FBDD1` - Active states, links
- **Ice Blue** `#AEDAE5` - Soft fills
- **Orange** `#E8941A` - CTAs, accents
- **Dreamy Palette** - Pink, Lavender, Peach, Mint, Sky, Yellow variants

## 🔐 Roles & Permissions

1. **Owner** - Full system access including user management, security controls, audit logs
2. **Admin** - Full operational control except security/system controls
3. **Teacher** - Subject-based access, grade management with revision logging
4. **Class Supervisor** - Class-wide academic overview, overall remarks
5. **Student** - View grades, attendance, report cards, messaging
6. **Parent** - View children data, fees, messaging
7. **Accountant** - Finance management only (no academic access)

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hamzaconcepts-eng/mmps2.git
cd mmps2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your Supabase credentials in `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The system uses Supabase PostgreSQL with the following key tables:
- `profiles` - User accounts and roles
- `students` - Student records
- `teachers` - Teacher profiles
- `guardians` - Parent/guardian information
- `classes` - Class configuration
- `subjects` - Subject definitions
- `attendance` - Attendance tracking
- `exams` - Exam configuration
- `grades` - Grade entries with revision history
- `fees` - Fee items and invoicing
- `payments` - Payment records
- `messages` - Internal messaging
- `audit_logs` - Sensitive action tracking

## 🌐 Internationalization

The system supports full bilingual operation:
- Language toggle stored in localStorage
- Dynamic RTL/LTR layout switching
- Mirrored navigation for Arabic mode
- All labels, messages, and validations localized

## 📱 Responsive Design

Fully responsive design that works across:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🔒 Security Features

- Grade integrity workflow with locked submissions
- Revision tracking for all grade edits
- Full audit trail for sensitive actions
- Role-based access control (RBAC)
- Secure authentication via Supabase Auth

## 📄 License

Private - All rights reserved

## 👥 Contributors

Built with 🔥 by Hamza Concepts Engineering

---

**مدرسة مشاعل مسقط الخاصة - نظام إدارة مدرسية متكامل**
