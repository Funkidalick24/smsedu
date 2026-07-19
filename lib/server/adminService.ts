import { getAdminStats, getClassroomSnapshot } from "./adminRepository";

export function loadAdminDashboard(schoolId: number) {
  return {
    stats: getAdminStats(schoolId),
    classroomSnapshot: getClassroomSnapshot(schoolId),
  };
}
