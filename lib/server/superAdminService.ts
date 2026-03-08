import { createSchoolWithLeader, CreateSchoolInput, listSchools } from "./superAdminRepository";

export function loadSchools() {
  return listSchools();
}

export function provisionSchool(input: CreateSchoolInput) {
  return createSchoolWithLeader(input);
}
