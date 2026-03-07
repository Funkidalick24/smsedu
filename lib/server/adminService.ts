import { getAdminStats, getClassroomSnapshot } from "./adminRepository";

export function loadAdminDashboard() {
  return {
    stats: getAdminStats(),
    classroomSnapshot: getClassroomSnapshot(),
  };
}
