# 🚀 Multi-Tenancy SaaS Implementation Plan

This document outlines the necessary architectural changes to evolve the current application from a single-tenant structure into a robust, multi-tenant Software as a Service (SaaS) platform. The plan is broken down by technical layer: Database, Authentication, Backend Logic, and Frontend Routing.

## 💾 1. Database Schema Changes (The Foundation)

The most critical step is ensuring every piece of data that belongs to a specific tenant (School/Organization) can be correctly isolated. This requires adding the `school_id` foreign key to all relevant tables.

**Status:** ⚠️ Partially implemented.

*   ✅ **Target Table:** `Users`
    *   ✅ **Requirement:** Add a foreign key, `school_id`, referencing the primary school/tenant ID in your schools table.
    *   ✅ **Files Updated:** `db/migrations/008_add_school_id_to_users.sql` creates a default development tenant, adds `users.school_id`, backfills existing users, and indexes the column.
    *   ⚠️ **Limitation:** SQLite cannot safely add a new non-nullable foreign-key column to an existing populated table with a dynamic tenant ID in a simple additive migration. The application now seeds and backfills `school_id`; a future table rebuild migration should enforce `NOT NULL` at the schema level after all deployments have tenant IDs.
*   ❌ **Remaining:** Add `school_id` to all additional tenant-owned domain tables (`students`, `teachers`, `classes`, attendance, assignments, parent links, etc.) and backfill them from owning users/classes.

## 🛡️ 2. Authentication and Context Management (The Identity)

The application must know *which* tenant the user belongs to at all times, making this context available globally.

**Status:** ✅ Implemented for authenticated user/session context.

*   ✅ `context/AuthContext.tsx`: The auth provider exposes `schoolId` from the authenticated user.
*   ✅ `lib/auth.ts`: `AuthUser` includes `schoolId`.
*   ✅ `lib/server/authService.ts` / `lib/server/authRepository.ts`: Login, session hydration, and password-reset user lookup return the user's associated `school_id` as `schoolId`.
*   ✅ `lib/server/db.ts`: Non-production seed users are assigned to the default development school.

## ⚙️ 3. Backend Logic & Data Isolation (The Enforcement)

This is where "tenant isolation" is enforced—the core principle of multi-tenancy. **Every single database query** must be scoped to the current tenant's ID.

**Status:** ❌ Not yet fully implemented.

*   ❌ `lib/server/studentRepository.ts`: Student data queries still scope primarily by authenticated student ID, not by an explicit tenant filter on every query.
*   ❌ `lib/server/adminRepository.ts`, `lib/server/superAdminRepository.ts`, etc.: Repository-wide tenant filtering remains pending because most tenant-owned tables still need `school_id` columns.
*   ❌ API routes in `app/api/*`: Routes can now receive `user.schoolId` from auth, but tenant IDs are not yet passed through and enforced consistently across every data-access call.

## 🌐 4. Frontend Routing & UI (The Experience)

The application needs a mechanism to detect and enforce the tenant context early in the request lifecycle, especially when handling routing.

**Status:** ⚠️ Partially implemented.

*   ✅ Authenticated client UI can access the current tenant through `AuthContext.schoolId`.
*   ❌ `app/layout.tsx`: Subdomain/path-based tenant detection is not yet implemented.
*   ❌ API routes (`app/api/*`) do not yet detect tenant context from subdomain/path; they currently rely on authenticated session context.

***

## ✅ Summary Checklist & Next Steps

| Component | Gap Description | Files/Areas to Modify | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Database** | Add `school_id` on `users` and seed/backfill development users. | `db/migrations/008_add_school_id_to_users.sql`, `lib/server/db.ts`. | High | ✅ Done |
| **Database** | Add `school_id` on all tenant-owned domain tables and enforce `NOT NULL` where safe. | New migration SQL files (`db/migrations/`). | High | ❌ Pending |
| **Context** | Auth context tracks the tenant ID. | `context/AuthContext.tsx`, `lib/auth.ts`, `lib/server/authService.ts`, `lib/server/authRepository.ts`. | High | ✅ Done |
| **Backend Logic** | Data access layer filters by tenant. | All repository files in `lib/server/`. | Critical | ❌ Pending |
| **Routing** | Detect and enforce tenant context on entry. | `app/layout.tsx`, API route handlers (`app/api/*`). | Medium | ❌ Pending |
