# Parent Dashboard Production Backlog

## Epic 1: Parent Data Integration (P0)
- Replace static parent cards and child overview table with API-backed family data.
- Add endpoints for linked children, attendance trends, performance summaries, and school notices.
- Persist message read/unread status and parent acknowledgements.
- Done when: parent dashboard is driven by real linked-student data.

## Epic 2: Core Parent Workflows (P0)
- Build child profile pages with attendance, grades, and behavior summaries.
- Implement parent-teacher messaging/inbox flow.
- Implement leave request/permission submission for children.
- Add event/calendar view for meetings, exams, and school activities.
- Done when: parents can monitor child progress and complete standard communication tasks.

## Epic 3: Parent Navigation and UX (P1)
- Convert sidebar items (`Children`, `Attendance`, `Messages`) into working pages.
- Add child switcher for multi-child households with persisted selection.
- Add loading, empty, and error states for parent modules.
- Add notification indicators for urgent school or teacher messages.
- Done when: parent users can navigate and act across all core modules smoothly.

## Epic 4: Access Control and Privacy (P1)
- Enforce parent access to only their linked children.
- Add server-side authorization checks for messaging and leave workflows.
- Validate all parent-submitted form inputs and attachments.
- Add audit trail for parent-facing approvals and communication.
- Done when: family data access is private, scoped, and auditable.

## Epic 5: Quality and Operations (P2)
- Add unit tests for child linkage, notification, and leave request rules.
- Add integration tests for parent APIs.
- Add E2E tests for messaging and child progress tracking flows.
- Add logging and alerting for failed parent communications.
- Done when: parent critical paths are test-covered and production observable.

## Suggested Sprint Order
1. Sprint 1: Epic 1
2. Sprint 2: Epic 2 (Child profiles and messaging first)
3. Sprint 3: Epic 2 (Leave/calendar) and Epic 3
4. Sprint 4: Epics 4 and 5
