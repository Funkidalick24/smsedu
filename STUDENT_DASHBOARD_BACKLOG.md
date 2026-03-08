# Student Dashboard Production Backlog

## Epic 1: Student Data Integration (P0)
- Replace static student cards and assignments with API-backed student-specific data.
- Add endpoints for enrolled subjects, assignment timelines, grades, attendance, and announcements.
- Ensure assignment status updates are persisted.
- Done when: student dashboard reflects real account data and current academic records.

## Epic 2: Core Student Workflows (P0)
- Build subject detail pages with learning materials and teacher posts.
- Implement assignment submission flow (file/text submission + resubmission rules).
- Add results/progress view by term and subject.
- Add timetable and upcoming deadline calendar view.
- Done when: students can track learning, submit work, and view outcomes end-to-end.

## Epic 3: Student UX and Engagement (P1)
- Convert sidebar items (`Subjects`, `Homework`, `Results`) into real route-linked pages.
- Add filtering by subject/status for assignments.
- Add clear overdue/upcoming indicators and notification surfaces.
- Add loading, empty, and error states for all student modules.
- Done when: student UX supports daily academic workflow without dead links.

## Epic 4: Security and Data Boundaries (P1)
- Enforce that students can only access their own records and submissions.
- Validate submission payloads and attachment constraints.
- Prevent grade/result mutation from student-facing endpoints.
- Done when: student access is strictly scoped and write operations are policy-compliant.

## Epic 5: Quality and Reliability (P2)
- Add unit tests for submission state transitions and deadline logic.
- Add integration tests for student APIs.
- Add E2E tests for assignment submission and results viewing.
- Add monitoring for submission failures and API errors.
- Done when: critical student flows are test-covered and operationally observable.

## Suggested Sprint Order
1. Sprint 1: Epic 1
2. Sprint 2: Epic 2 (Submissions and Results first)
3. Sprint 3: Epic 2 (Timetable) and Epic 3
4. Sprint 4: Epics 4 and 5
