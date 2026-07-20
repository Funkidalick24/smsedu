import {
  getStudentDashboard,
  getStudentIdForUser,
  listStudentHomework,
  listStudentResults,
  listStudentSubjects,
  submitStudentHomework,
} from "./studentRepository";

export function resolveStudentId(userId: number, schoolId: number) {
  return getStudentIdForUser(userId, schoolId);
}

export function loadStudentDashboard(studentId: number, schoolId: number) {
  return getStudentDashboard(studentId, schoolId);
}

export function loadStudentSubjects(studentId: number, schoolId: number) {
  return listStudentSubjects(studentId, schoolId);
}

export function loadStudentHomework(studentId: number, schoolId: number, subjectId?: number | null, status?: string | null) {
  return listStudentHomework(studentId, schoolId, subjectId, status);
}

export function createStudentSubmission(
  studentId: number,
  schoolId: number,
  assignmentId: number,
  payload: { submissionText: string; attachmentUrl: string },
) {
  submitStudentHomework(studentId, schoolId, assignmentId, payload);
}

export function loadStudentResults(studentId: number, schoolId: number) {
  return listStudentResults(studentId, schoolId);
}
