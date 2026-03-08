# Super Admin Dashboard Production Backlog

## Epic 1: Platform Ops Data Integration (P0)
- Replace static health checks with live platform telemetry and service status APIs.
- Add endpoints for auth health, backup status, email/SMS delivery, and tenant/system metrics.
- Store configuration/state history for operational visibility.
- Done when: super-admin dashboard surfaces real-time or near-real-time operational data.

## Epic 2: Multi-Tenant and Governance Controls (P0)
- Build school/tenant management module (create, suspend, configure).
- Build admin account lifecycle management (invite, role changes, deactivate).
- Build platform-wide policy controls (password policy, session policy, feature flags).
- Done when: super admin can govern tenants and platform admins from dashboard-linked pages.

## Epic 3: Theme and Config Management Hardening (P1)
- Replace client-only theme color mutation with persisted, server-backed theme settings.
- Add validation/preview workflow for branding and global config updates.
- Add rollback/version history for config changes.
- Done when: config/theme changes are persistent, validated, and reversible.

## Epic 4: Security, Audit, and Compliance (P1)
- Enforce high-privilege auth controls (MFA, session constraints, step-up verification).
- Add comprehensive audit logging for all super-admin actions.
- Add immutable audit export and retention policy controls.
- Add RBAC checks for all super-admin APIs and actions.
- Done when: privileged operations are secure, attributable, and compliance-friendly.

## Epic 5: Reliability, Incident, and Reporting (P2)
- Add incident dashboard and alert hooks for critical service degradation.
- Add report exports for usage, uptime, and admin activity.
- Add automated tests for super-admin endpoints and governance flows.
- Add observability dashboards and SLO-based alerts.
- Done when: platform operations are measurable, test-covered, and incident-ready.

## Suggested Sprint Order
1. Sprint 1: Epic 1
2. Sprint 2: Epic 2
3. Sprint 3: Epics 3 and 4
4. Sprint 4: Epic 5
