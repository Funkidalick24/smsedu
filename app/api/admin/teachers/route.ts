import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import {
  createTeacher,
  listClassOptions,
  listSubjectOptions,
  listTeachers,
} from "@/lib/server/adminRepository";

interface CreateTeacherBody {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  nationalIdNumber?: string;
  maritalStatus?: string;
  phoneNumber?: string;
  email?: string;
  addressLine?: string;
  city?: string;
  postalCode?: string;
  employeeNo?: string;
  employmentDate?: string;
  employmentType?: string;
  jobTitle?: string;
  department?: string;
  status?: string;
  gradeLevelsTaught?: string;
  academicDepartment?: string;
  homeroomTeacher?: boolean;
  highestQualification?: string;
  degrees?: string;
  teachingCertification?: string;
  teacherRegistrationNumber?: string;
  teachingCouncilRegistration?: string;
  teachingCertificateNumber?: string;
  teacherTrainingCollege?: string;
  universityQualification?: string;
  primarySubject?: string;
  secondarySubject?: string;
  employmentCategory?: string;
  contractType?: string;
  yearsOfService?: number | null;
  professionalLicenseNumber?: string;
  specializations?: string;
  yearsExperience?: number | null;
  previousSchools?: string;
  weeklyTeachingHours?: number | null;
  timetableAssignments?: string;
  subjectLoad?: string;
  salary?: number | null;
  paymentMethod?: string;
  bankName?: string;
  bankAccountNumber?: string;
  taxNumber?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  emergencyContactAltPhone?: string;
  classIds?: number[];
  subjectIds?: number[];
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toNumberOrNull(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  return null;
}

export async function GET() {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    teachers: listTeachers(),
    classes: listClassOptions(),
    subjects: listSubjectOptions(),
  });
}

export async function POST(request: Request) {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as CreateTeacherBody;
  const firstName = body.firstName?.trim() ?? "";
  const middleName = body.middleName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const phoneNumber = body.phoneNumber?.trim() ?? "";
  const employeeNo = body.employeeNo?.trim() ?? "";
  const employmentDate = body.employmentDate?.trim() ?? "";
  const department = body.department?.trim() ?? "";
  const classIds = Array.isArray(body.classIds) ? body.classIds.filter((value) => Number.isInteger(value)) : [];
  const subjectIds = Array.isArray(body.subjectIds)
    ? body.subjectIds.filter((value) => Number.isInteger(value))
    : [];

  if (!firstName || !lastName || !email || !phoneNumber || !employeeNo || !employmentDate || !department) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "First name, last name, email, phone number, employee ID, employment date, and department are required.",
      },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const created = createTeacher({
      firstName,
      middleName,
      lastName,
      dateOfBirth: body.dateOfBirth?.trim(),
      gender: body.gender?.trim(),
      nationality: body.nationality?.trim(),
      nationalIdNumber: body.nationalIdNumber?.trim(),
      maritalStatus: body.maritalStatus?.trim(),
      phoneNumber,
      email,
      addressLine: body.addressLine?.trim(),
      city: body.city?.trim(),
      postalCode: body.postalCode?.trim(),
      employeeNo,
      employmentDate,
      employmentType: body.employmentType?.trim(),
      jobTitle: body.jobTitle?.trim(),
      department,
      status: body.status?.trim(),
      gradeLevelsTaught: body.gradeLevelsTaught?.trim(),
      academicDepartment: body.academicDepartment?.trim(),
      homeroomTeacher: body.homeroomTeacher ?? false,
      highestQualification: body.highestQualification?.trim(),
      degrees: body.degrees?.trim(),
      teachingCertification: body.teachingCertification?.trim(),
      teacherRegistrationNumber: body.teacherRegistrationNumber?.trim(),
      teachingCouncilRegistration: body.teachingCouncilRegistration?.trim(),
      teachingCertificateNumber: body.teachingCertificateNumber?.trim(),
      teacherTrainingCollege: body.teacherTrainingCollege?.trim(),
      universityQualification: body.universityQualification?.trim(),
      primarySubject: body.primarySubject?.trim(),
      secondarySubject: body.secondarySubject?.trim(),
      employmentCategory: body.employmentCategory?.trim(),
      contractType: body.contractType?.trim(),
      yearsOfService: toNumberOrNull(body.yearsOfService),
      professionalLicenseNumber: body.professionalLicenseNumber?.trim(),
      specializations: body.specializations?.trim(),
      yearsExperience: toNumberOrNull(body.yearsExperience),
      previousSchools: body.previousSchools?.trim(),
      weeklyTeachingHours: toNumberOrNull(body.weeklyTeachingHours),
      timetableAssignments: body.timetableAssignments?.trim(),
      subjectLoad: body.subjectLoad?.trim(),
      salary: toNumberOrNull(body.salary),
      paymentMethod: body.paymentMethod?.trim(),
      bankName: body.bankName?.trim(),
      bankAccountNumber: body.bankAccountNumber?.trim(),
      taxNumber: body.taxNumber?.trim(),
      emergencyContactName: body.emergencyContactName?.trim(),
      emergencyContactRelationship: body.emergencyContactRelationship?.trim(),
      emergencyContactPhone: body.emergencyContactPhone?.trim(),
      emergencyContactAltPhone: body.emergencyContactAltPhone?.trim(),
      classIds,
      subjectIds,
    });

    return NextResponse.json({ ok: true, teacher: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create teacher.";
    if (message.includes("UNIQUE")) {
      return NextResponse.json(
        { ok: false, message: "Email or employee ID already exists." },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
