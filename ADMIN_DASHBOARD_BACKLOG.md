# Admin Dashboard Production Backlog

## Epic 1: Auth & Access Control (P0)
- Replace demo credential auth with real auth provider and hashed passwords.
- Move session management to secure HTTP-only cookies.
- Add server-side role checks for admin routes and APIs.
- Add login rate limit and lockout policy.
- Add forgot/reset password flow.
- Done when: only authenticated admin users can access admin pages/data via both UI and direct API calls.

## Epic 2: Admin Data Foundation (P0)
- Design schema for students, teachers, classes, attendance, terms, users/roles.
- Create DB migrations and seed data for non-production.
- Build repository/service layer for admin metrics and class health data.
- Add API endpoints for dashboard stats and classroom snapshot.
- Done when: admin dashboard loads from DB-backed APIs (no hardcoded dashboard data).

## Epic 3: Core Admin Modules (P1)
- Build `Students` module: list, detail, create, update, deactivate.
- Build `Teachers` module: list, detail, create, update, assign classes.
- Build `Classes` module: list, detail, create, roster management.
- Build `Attendance` module: daily view, class view, trend summary.
- Done when: sidebar admin items link to working pages with CRUD and persistence.

## Epic 4: UI Functionality Upgrade (P1)
- Replace static sidebar items with route-linked navigation and active states.
- Upgrade table component to typed rows with sort/filter/pagination.
- Add row actions (view/edit/delete) and confirmation flows.
- Add loading, empty, and error states for all admin data views.
- Done when: admin can navigate and perform common actions without dead ends.

## Epic 5: Validation, Security, and Audit (P1)
- Add request validation on all admin APIs.
- Enforce RBAC per endpoint/action.
- Add CSRF/XSS-safe patterns where applicable.
- Add audit logging for sensitive admin operations.
- Done when: all privileged actions are validated, authorized, and auditable.

## Epic 6: Quality & Test Coverage (P2)
- Unit tests for auth, role guards, and admin service logic.
- Integration tests for admin APIs.
- E2E tests for login, route protection, and admin CRUD happy paths.
- Done when: CI runs tests on every PR and critical admin flows are covered.

## Epic 7: Operations & Readiness (P2)
- Add environment config strategy and secret management.
- Add error tracking and structured logging.
- Add basic dashboards/alerts for auth failures and API errors.
- Resolve Next root warning by setting `turbopack.root` or cleaning extra lockfiles.
- Done when: app is deployable with observability and stable runtime config.

## Suggested Sprint Order
1. Sprint 1: Epic 1 and Epic 2
2. Sprint 2: Epic 3 (Students and Teachers first)
3. Sprint 3: Epic 3 (Classes and Attendance) and Epic 4
4. Sprint 4: Epics 5, 6, and 7
