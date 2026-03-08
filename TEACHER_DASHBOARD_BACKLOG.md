# Teacher Dashboard Production Backlog

## Epic 1: Data and API Integration (P0)
- Replace static teacher stats and task lists with API-backed data.
- Add endpoints for teacher timetable, class load, pending grading, and attendance summaries.
- Persist assignment/task state changes to database.
- Done when: dashboard cards and tables load from live teacher data, not hardcoded arrays.

## Epic 2: Core Teacher Workflows (P0)
- Build class roster views per subject/class period.
- Implement assignment creation/edit/publish workflows.
- Implement grade entry and bulk grading tools.
- Implement attendance capture per class session.
- Done when: a teacher can complete daily teaching operations from dashboard-linked pages.

## Epic 3: Teacher Navigation and UX (P1)
- Convert sidebar items (`My Classes`, `Assignments`, `Grades`) into route-linked pages.
- Add filtering/search for classes, assignments, and student records.
- Add loading, empty, and error states to all teacher views.
- Done when: all teacher navigation paths are actionable and support real task execution.

## Epic 4: Validation and Permissions (P1)
- Enforce teacher-only access to teacher endpoints and resources.
- Restrict data scope so teachers only see assigned classes/students.
- Add validation for grade ranges, attendance inputs, and assignment deadlines.
- Done when: teacher actions are role-safe, scoped, and validated server-side.

## Epic 5: Quality and Observability (P2)
- Add unit tests for grading and attendance business rules.
- Add integration tests for teacher APIs.
- Add E2E tests for assignment creation and grade submission flows.
- Add error logging for failed teacher operations.
- Done when: critical teacher journeys are covered in CI with actionable telemetry.

## Suggested Sprint Order
1. Sprint 1: Epic 1
2. Sprint 2: Epic 2 (Assignments and Grades first)
3. Sprint 3: Epic 2 (Attendance and Rosters) and Epic 3
4. Sprint 4: Epics 4 and 5
