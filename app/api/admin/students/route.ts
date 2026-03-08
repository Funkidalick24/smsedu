import { NextResponse } from "next/server";
import { requireRole } from "@/lib/server/authService";
import { createStudent, listClassOptions, listStudents } from "@/lib/server/adminRepository";

interface CreateStudentBody {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  preferredName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  admissionDate?: string;
  email?: string;
  admissionNo?: string;
  birthCertificateNumber?: string;
  schoolLevel?: "Primary" | "Secondary";
  formLevel?: string;
  classStream?: string;
  gradeLevel?: string;
  sectionStream?: string;
  academicYear?: string;
  transferStatus?: string;
  previousSchool?: string;
  previousSchoolAddress?: string;
  grade7ExamCentreNumber?: string;
  grade7CandidateNumber?: string;
  grade7Results?: string;
  zimsecIndexNumber?: string;
  curriculumType?: string;
  houseName?: string;
  boardingStatus?: string;
  transportMethod?: string;
  busRoute?: string;
  religion?: string;
  homeLanguage?: string;
  extracurricularInterests?: string;
  guardian1Name?: string;
  guardian1Relationship?: string;
  guardian1Phone?: string;
  guardian1NationalIdNumber?: string;
  guardian1Email?: string;
  guardian1Occupation?: string;
  guardian1Address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  allergies?: string;
  medicalNotes?: string;
  knownConditions?: string;
  immunisationRecord?: string;
  medicalAidProvider?: string;
  medications?: string;
  bloodType?: string;
  specialNeeds?: string;
  classId?: number | null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    students: listStudents(),
    classes: listClassOptions(),
  });
}

export async function POST(request: Request) {
  const user = await requireRole(["admin", "superadmin"]);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as CreateStudentBody;
  const firstName = body.firstName?.trim() ?? "";
  const middleName = body.middleName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const preferredName = body.preferredName?.trim() ?? "";
  const dateOfBirth = body.dateOfBirth?.trim() ?? "";
  const gender = body.gender?.trim() ?? "";
  const nationality = body.nationality?.trim() ?? "";
  const admissionDate = body.admissionDate?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const admissionNo = body.admissionNo?.trim() ?? "";
  const birthCertificateNumber = body.birthCertificateNumber?.trim() ?? "";
  const schoolLevel = body.schoolLevel === "Secondary" ? "Secondary" : "Primary";
  const formLevel = body.formLevel?.trim() ?? "";
  const classStream = body.classStream?.trim() ?? "";
  const gradeLevel = body.gradeLevel?.trim() ?? "";
  const sectionStream = body.sectionStream?.trim() ?? "";
  const academicYear = body.academicYear?.trim() ?? "";
  const transferStatus = body.transferStatus?.trim() ?? "";
  const previousSchool = body.previousSchool?.trim() ?? "";
  const previousSchoolAddress = body.previousSchoolAddress?.trim() ?? "";
  const grade7ExamCentreNumber = body.grade7ExamCentreNumber?.trim() ?? "";
  const grade7CandidateNumber = body.grade7CandidateNumber?.trim() ?? "";
  const grade7Results = body.grade7Results?.trim() ?? "";
  const zimsecIndexNumber = body.zimsecIndexNumber?.trim() ?? "";
  const curriculumType = body.curriculumType?.trim() ?? "";
  const houseName = body.houseName?.trim() ?? "";
  const boardingStatus = body.boardingStatus?.trim() ?? "";
  const transportMethod = body.transportMethod?.trim() ?? "";
  const busRoute = body.busRoute?.trim() ?? "";
  const religion = body.religion?.trim() ?? "";
  const homeLanguage = body.homeLanguage?.trim() ?? "";
  const extracurricularInterests = body.extracurricularInterests?.trim() ?? "";
  const guardian1Name = body.guardian1Name?.trim() ?? "";
  const guardian1Relationship = body.guardian1Relationship?.trim() ?? "";
  const guardian1Phone = body.guardian1Phone?.trim() ?? "";
  const guardian1NationalIdNumber = body.guardian1NationalIdNumber?.trim() ?? "";
  const guardian1Email = body.guardian1Email?.trim() ?? "";
  const guardian1Occupation = body.guardian1Occupation?.trim() ?? "";
  const guardian1Address = body.guardian1Address?.trim() ?? "";
  const emergencyContactName = body.emergencyContactName?.trim() ?? "";
  const emergencyContactPhone = body.emergencyContactPhone?.trim() ?? "";
  const emergencyContactRelationship = body.emergencyContactRelationship?.trim() ?? "";
  const allergies = body.allergies?.trim() ?? "";
  const medicalNotes = body.medicalNotes?.trim() ?? "";
  const knownConditions = body.knownConditions?.trim() ?? "";
  const immunisationRecord = body.immunisationRecord?.trim() ?? "";
  const medicalAidProvider = body.medicalAidProvider?.trim() ?? "";
  const medications = body.medications?.trim() ?? "";
  const bloodType = body.bloodType?.trim() ?? "";
  const specialNeeds = body.specialNeeds?.trim() ?? "";
  const classId = typeof body.classId === "number" ? body.classId : null;

  if (
    !firstName ||
    !lastName ||
    !dateOfBirth ||
    !gender ||
    !admissionDate ||
    !email ||
    !admissionNo ||
    !gradeLevel ||
    !birthCertificateNumber ||
    !guardian1Name ||
    !guardian1Relationship ||
    !guardian1Phone
  ) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "First name, last name, DOB, gender, admission date, email, admission number, grade, and primary guardian fields are required.",
      },
      { status: 400 },
    );
  }

  if (schoolLevel === "Secondary" && !formLevel) {
    return NextResponse.json(
      { ok: false, message: "Form level is required for secondary students." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const created = createStudent({
      firstName,
      middleName,
      lastName,
      preferredName,
      dateOfBirth,
      gender,
      nationality,
      admissionDate,
      email,
      admissionNo,
      birthCertificateNumber,
      gradeLevel,
      schoolLevel,
      formLevel,
      classStream,
      sectionStream,
      academicYear,
      transferStatus,
      previousSchool,
      previousSchoolAddress,
      grade7ExamCentreNumber,
      grade7CandidateNumber,
      grade7Results,
      zimsecIndexNumber,
      curriculumType,
      houseName,
      boardingStatus,
      transportMethod,
      busRoute,
      religion,
      homeLanguage,
      extracurricularInterests,
      guardian1Name,
      guardian1Relationship,
      guardian1Phone,
      guardian1NationalIdNumber,
      guardian1Email,
      guardian1Occupation,
      guardian1Address,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      allergies,
      medicalNotes,
      knownConditions,
      immunisationRecord,
      medicalAidProvider,
      medications,
      bloodType,
      specialNeeds,
      classId,
    });
    return NextResponse.json({ ok: true, student: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create student.";
    if (message.includes("UNIQUE")) {
      return NextResponse.json(
        { ok: false, message: "Email or admission number already exists." },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
