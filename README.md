# SMSEdu

SMSEdu is a role-based school management web app built with Next.js.

## What was improved

- Auth now uses server-side validation with hashed passwords (`scrypt`) and SQLite persistence.
- Session management now uses secure HTTP-only cookies (no localStorage auth state).
- Role checks are enforced on the server for dashboard routes and admin APIs.
- Login lockout policy is active after repeated failed attempts.
- Forgot/reset password flow is available at `/forgot-password` and `/reset-password`.
- Admin dashboard stats and classroom snapshot now load from DB-backed APIs.
- SQLite schema/migration foundation added for users/roles, students, teachers, classes, terms, attendance, and sessions.
- Zimbabwe-aligned schema expansion added for:
  - Student registration: birth certificate number, Grade 7 exam details, ZIMSEC index, guardian national ID, curriculum type, and house assignment.
  - Teacher records: teacher registration number, teaching council registration, certificate number, training college/university qualification, subject specialization, and employment category.
  - Class setup: primary/secondary level, form level, stream letter, and curriculum type.
  - Student document support and ZIMSEC exam entry tables.
- Admin class module now supports class creation with section, academic year/term, class/assistant teacher, capacity, location, attendance settings, grading settings, notes, and subject-teacher assignments.
- Role-aware dashboards for:
  - Admin
  - Teacher
  - Student
  - Parent
  - Super Admin
- Dashboard layout includes auth-aware UI rendering and role routing.
- Shared production-style UI components (`StatCard`, `Table`, `Sidebar`, `Topbar`) with consistent styling.
- Student dashboard now reflects term-report style metrics (not GPA-centric tracking).

## Default development credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@smsedu.local` | `Admin123!` |
| Teacher | `teacher@smsedu.local` | `Admin123!` |
| Student | `student@smsedu.local` | `Admin123!` |
| Parent | `parent@smsedu.local` | `Admin123!` |
| Super Admin | `super@smsedu.local` | `Admin123!` |

Set `DEFAULT_PASSWORD` in your environment to change seeded password values.

## Getting Started

```bash
npm install
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run build
```
