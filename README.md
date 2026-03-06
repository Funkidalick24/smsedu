# SMSEdu

SMSEdu is a role-based school management web app built with Next.js.

## What was improved

- A full blue-centered visual theme across landing, login, and dashboards.
- Auth flow upgraded with validation, demo credential handling, and local session persistence.
- Role-aware dashboards for:
  - Admin
  - Teacher
  - Student
  - Parent
  - Super Admin
- Dashboard layout now includes auth guarding and role redirection.
- Shared production-style UI components (`StatCard`, `Table`, `Sidebar`, `Topbar`) with consistent styling.

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@test.com` | `admin123` |
| Teacher | `teacher@test.com` | `teacher123` |
| Student | `student@test.com` | `student123` |
| Parent | `parent@test.com` | `parent123` |
| Super Admin | `super@test.com` | `super123` |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run build
```
