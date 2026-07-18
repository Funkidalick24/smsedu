# 🚀 Multi-Tenancy SaaS Implementation Plan

This document outlines the necessary architectural changes to evolve the current application from a single-tenant structure into a robust, multi-tenant Software as a Service (SaaS) platform. The plan is broken down by technical layer: Database, Authentication, Backend Logic, and Frontend Routing.

## 💾 1. Database Schema Changes (The Foundation)

The most critical step is ensuring every piece of data that belongs to a specific tenant (School/Organization) can be correctly isolated. This requires adding the `school_id` foreign key to all relevant tables.

**Action Required:** Update the database schema migrations.

*   **Target Table:** `Users`
    *   **Requirement:** Add a non-nullable foreign key, `school_id`, referencing the primary school/tenant ID in your schools table.
    *   **Files to Check:** Review and create new migration files (e.g., `db/migrations/008_add_school_id_to_users.sql`).

## 🛡️ 2. Authentication and Context Management (The Identity)

The application must know *which* tenant the user belongs to at all times, making this context available globally.

**Action Required:** Update the authentication context (`AuthContext`) to store the current `school_id` or `tenantId`.

*   **Files to Check:**
    *   `context/AuthContext.tsx`: Modify this provider to accept and manage the active tenant ID upon successful login.
    *   `lib/authService.ts` / `lib/pageAuth.ts`: Ensure that when a user logs in, the returned session object *must* include the associated `school_id`.

## ⚙️ 3. Backend Logic & Data Isolation (The Enforcement)

This is where "tenant isolation" is enforced—the core principle of multi-tenancy. **Every single database query** must be scoped to the current tenant's ID.

**Action Required:** Implement a `school_id` filter on *every* data access layer call.

*   **Files to Check (Repositories):**
    *   `lib/server/studentRepository.ts`: All methods fetching student data must include `WHERE school_id = ?`.
    *   `lib/server/adminRepository.ts`, `lib/server/superAdminRepository.ts`, etc.: Repeat this pattern for all repositories that interact with tenant-specific data (e.g., classes, assignments). The repository layer is the ideal place to enforce this logic.
*   **Files to Check (Services):**
    *   `lib/server/studentService.ts`: These services should call the repository methods and rely on them enforcing the `school_id` filter automatically.
*   **API Routes:**
    *   All API routes in `app/api/*` must retrieve the current user's `school_id` from the request context (e.g., headers or session) and pass it down to the repository layer for every read/write operation.

## 🌐 4. Frontend Routing & UI (The Experience)

The application needs a mechanism to detect and enforce the tenant context early in the request lifecycle, especially when handling routing.

**Action Required:** Implement logic to determine the current tenant based on the incoming request (e.g., subdomain or path parameter).

*   **Files to Check:**
    *   `app/layout.tsx`: This is the root layout and should be the primary place where you detect the tenant context and initialize the `AuthContext` with that information before rendering any child components.
    *   API routes (`app/api/*`) must also be aware of this context to correctly scope requests.

***

## ✅ Summary Checklist & Next Steps

| Component | Gap Description | Files/Areas to Modify | Priority |
| :--- | :--- | :--- | :--- |
| **Database** | Missing `school_id` on core tables (e.g., Users). | New Migration SQL files (`db/migrations/`). | High |
| **Context** | Auth context doesn't track the tenant ID. | `context/AuthContext.tsx`, `lib/authService.ts`. | High |
| **Backend Logic** | No data access layer filtering by tenant. | All repository files in `lib/server/` (e.g., `studentRepository.ts`). | Critical |
| **Routing** | Needs to detect and enforce the tenant context on entry. | `app/layout.tsx`, API route handlers (`app/api/*`). | Medium |
