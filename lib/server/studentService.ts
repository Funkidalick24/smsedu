import {
  getStudentDashboard,
  getStudentIdForUser,
  listStudentHomework,
  listStudentResults,
  listStudentSubjects,
  submitStudentHomework,
} from "./studentRepository";

export function resolveStudentId(userId: number) {
  return getStudentIdForUser(userId);
}

export function loadStudentDashboard(studentId: number) {
  return getStudentDashboard(studentId);
}

export function loadStudentSubjects(studentId: number) {
  return listStudentSubjects(studentId);
}

export function loadStudentHomework(studentId: number, subjectId?: number | null, status?: string | null) {
  return listStudentHomework(studentId, subjectId, status);
}

export function createStudentSubmission(
  studentId: number,
  assignmentId: number,
  payload: { submissionText: string; attachmentUrl: string },
) {
  submitStudentHomework(studentId, assignmentId, payload);
}

export function loadStudentResults(studentId: number) {
  return listStudentResults(studentId);
}
