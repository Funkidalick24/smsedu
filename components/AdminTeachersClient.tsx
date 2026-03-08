"use client";

import { FormEvent, useEffect, useState } from "react";
import Table from "./Table";

interface TeacherRow {
  id: number;
  employeeNo: string;
  name: string;
  email: string;
  department: string;
  subjects: string;
  classes: string;
  status: string;
  assignedClasses: number;
}

interface ClassOption {
  id: number;
  name: string;
}

interface SubjectOption {
  id: number;
  name: string;
}

interface TeacherDocument {
  id: number;
  documentType: string;
  fileName: string;
  filePath: string;
  uploadedAt: string;
}

interface TeacherDetail {
  id: number;
  employeeNo: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  nationalIdNumber: string;
  maritalStatus: string;
  phoneNumber: string;
  email: string;
  addressLine: string;
  city: string;
  postalCode: string;
  employmentDate: string;
  employmentType: string;
  jobTitle: string;
  department: string;
  status: string;
  gradeLevelsTaught: string;
  academicDepartment: string;
  homeroomTeacher: boolean;
  highestQualification: string;
  degrees: string;
  teachingCertification: string;
  teacherRegistrationNumber: string;
  teachingCouncilRegistration: string;
  teachingCertificateNumber: string;
  teacherTrainingCollege: string;
  universityQualification: string;
  primarySubject: string;
  secondarySubject: string;
  employmentCategory: string;
  contractType: string;
  yearsOfService: number | null;
  professionalLicenseNumber: string;
  specializations: string;
  yearsExperience: number | null;
  previousSchools: string;
  weeklyTeachingHours: number | null;
  timetableAssignments: string;
  subjectLoad: string;
  salary: number | null;
  paymentMethod: string;
  bankName: string;
  bankAccountNumber: string;
  taxNumber: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactAltPhone: string;
  classIds: number[];
  subjectIds: number[];
}

interface TeachersResponse {
  ok: boolean;
  message?: string;
  teachers?: TeacherRow[];
  classes?: ClassOption[];
  subjects?: SubjectOption[];
}

interface AdminTeachersClientProps {
  initialTeachers: TeacherRow[];
  initialClasses: ClassOption[];
  initialSubjects: SubjectOption[];
}

type TeacherFormTab =
  | "personal"
  | "contact"
  | "employment"
  | "teaching"
  | "qualifications"
  | "payroll"
  | "emergency";

interface TeacherFormState {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  nationalIdNumber: string;
  maritalStatus: string;
  phoneNumber: string;
  email: string;
  addressLine: string;
  city: string;
  postalCode: string;
  employeeNo: string;
  employmentDate: string;
  employmentType: string;
  jobTitle: string;
  department: string;
  status: string;
  gradeLevelsTaught: string;
  academicDepartment: string;
  homeroomTeacher: boolean;
  subjectIds: number[];
  classIds: number[];
  highestQualification: string;
  degrees: string;
  teachingCertification: string;
  teacherRegistrationNumber: string;
  teachingCouncilRegistration: string;
  teachingCertificateNumber: string;
  teacherTrainingCollege: string;
  universityQualification: string;
  primarySubject: string;
  secondarySubject: string;
  employmentCategory: string;
  contractType: string;
  yearsOfService: string;
  professionalLicenseNumber: string;
  specializations: string;
  yearsExperience: string;
  previousSchools: string;
  weeklyTeachingHours: string;
  timetableAssignments: string;
  subjectLoad: string;
  salary: string;
  paymentMethod: string;
  bankName: string;
  bankAccountNumber: string;
  taxNumber: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactAltPhone: string;
}

const tabs: Array<{ key: TeacherFormTab; label: string }> = [
  { key: "personal", label: "Personal" },
  { key: "contact", label: "Contact" },
  { key: "employment", label: "Employment" },
  { key: "teaching", label: "Teaching" },
  { key: "qualifications", label: "Qualifications" },
  { key: "payroll", label: "Payroll" },
  { key: "emergency", label: "Emergency" },
];

const initialForm: TeacherFormState = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  nationalIdNumber: "",
  maritalStatus: "",
  phoneNumber: "",
  email: "",
  addressLine: "",
  city: "",
  postalCode: "",
  employeeNo: "",
  employmentDate: new Date().toISOString().slice(0, 10),
  employmentType: "",
  jobTitle: "",
  department: "",
  status: "Active",
  gradeLevelsTaught: "",
  academicDepartment: "",
  homeroomTeacher: false,
  subjectIds: [],
  classIds: [],
  highestQualification: "",
  degrees: "",
  teachingCertification: "",
  teacherRegistrationNumber: "",
  teachingCouncilRegistration: "",
  teachingCertificateNumber: "",
  teacherTrainingCollege: "",
  universityQualification: "",
  primarySubject: "",
  secondarySubject: "",
  employmentCategory: "",
  contractType: "",
  yearsOfService: "",
  professionalLicenseNumber: "",
  specializations: "",
  yearsExperience: "",
  previousSchools: "",
  weeklyTeachingHours: "",
  timetableAssignments: "",
  subjectLoad: "",
  salary: "",
  paymentMethod: "",
  bankName: "",
  bankAccountNumber: "",
  taxNumber: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  emergencyContactAltPhone: "",
};

function toggleSelection(ids: number[], id: number) {
  return ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id];
}

function toForm(detail: TeacherDetail): TeacherFormState {
  return {
    firstName: detail.firstName,
    middleName: detail.middleName,
    lastName: detail.lastName,
    dateOfBirth: detail.dateOfBirth,
    gender: detail.gender,
    nationality: detail.nationality,
    nationalIdNumber: detail.nationalIdNumber,
    maritalStatus: detail.maritalStatus,
    phoneNumber: detail.phoneNumber,
    email: detail.email,
    addressLine: detail.addressLine,
    city: detail.city,
    postalCode: detail.postalCode,
    employeeNo: detail.employeeNo,
    employmentDate: detail.employmentDate,
    employmentType: detail.employmentType,
    jobTitle: detail.jobTitle,
    department: detail.department,
    status: detail.status,
    gradeLevelsTaught: detail.gradeLevelsTaught,
    academicDepartment: detail.academicDepartment,
    homeroomTeacher: detail.homeroomTeacher,
    subjectIds: detail.subjectIds,
    classIds: detail.classIds,
    highestQualification: detail.highestQualification,
    degrees: detail.degrees,
    teachingCertification: detail.teachingCertification,
    teacherRegistrationNumber: detail.teacherRegistrationNumber,
    teachingCouncilRegistration: detail.teachingCouncilRegistration,
    teachingCertificateNumber: detail.teachingCertificateNumber,
    teacherTrainingCollege: detail.teacherTrainingCollege,
    universityQualification: detail.universityQualification,
    primarySubject: detail.primarySubject,
    secondarySubject: detail.secondarySubject,
    employmentCategory: detail.employmentCategory,
    contractType: detail.contractType,
    yearsOfService: detail.yearsOfService == null ? "" : String(detail.yearsOfService),
    professionalLicenseNumber: detail.professionalLicenseNumber,
    specializations: detail.specializations,
    yearsExperience: detail.yearsExperience == null ? "" : String(detail.yearsExperience),
    previousSchools: detail.previousSchools,
    weeklyTeachingHours: detail.weeklyTeachingHours == null ? "" : String(detail.weeklyTeachingHours),
    timetableAssignments: detail.timetableAssignments,
    subjectLoad: detail.subjectLoad,
    salary: detail.salary == null ? "" : String(detail.salary),
    paymentMethod: detail.paymentMethod,
    bankName: detail.bankName,
    bankAccountNumber: detail.bankAccountNumber,
    taxNumber: detail.taxNumber,
    emergencyContactName: detail.emergencyContactName,
    emergencyContactRelationship: detail.emergencyContactRelationship,
    emergencyContactPhone: detail.emergencyContactPhone,
    emergencyContactAltPhone: detail.emergencyContactAltPhone,
  };
}

export default function AdminTeachersClient({
  initialTeachers,
  initialClasses,
  initialSubjects,
}: AdminTeachersClientProps) {
  const [teachers, setTeachers] = useState<TeacherRow[]>(initialTeachers);
  const [classes, setClasses] = useState<ClassOption[]>(initialClasses);
  const [subjects, setSubjects] = useState<SubjectOption[]>(initialSubjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TeacherFormTab>("personal");
  const [form, setForm] = useState<TeacherFormState>(initialForm);
  const [formError, setFormError] = useState("");
  const [editingTeacherId, setEditingTeacherId] = useState<number | null>(null);

  const [viewTeacher, setViewTeacher] = useState<TeacherDetail | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewError, setViewError] = useState("");

  const [docsTeacher, setDocsTeacher] = useState<TeacherRow | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [documents, setDocuments] = useState<TeacherDocument[]>([]);
  const [docsError, setDocsError] = useState("");
  const [uploadType, setUploadType] = useState("Teaching Certificate");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/teachers", { cache: "no-store" });
    const data = (await response.json()) as TeachersResponse;
    if (!response.ok || !data.ok) {
      setError(data.message ?? "Failed to load teachers.");
      setLoading(false);
      return;
    }
    setTeachers(data.teachers ?? []);
    setClasses(data.classes ?? []);
    setSubjects(data.subjects ?? []);
    setLoading(false);
  };

  const getTeacherDetail = async (teacherId: number) => {
    const response = await fetch(`/api/admin/teachers/${teacherId}`, { cache: "no-store" });
    const data = (await response.json()) as { ok: boolean; message?: string; teacher?: TeacherDetail };
    if (!response.ok || !data.ok || !data.teacher) {
      throw new Error(data.message ?? "Failed to load teacher details.");
    }
    return data.teacher;
  };

  const getTeacherDocuments = async (teacherId: number) => {
    const response = await fetch(`/api/admin/teachers/${teacherId}/documents`, { cache: "no-store" });
    const data = (await response.json()) as { ok: boolean; message?: string; documents?: TeacherDocument[] };
    if (!response.ok || !data.ok) {
      throw new Error(data.message ?? "Failed to load documents.");
    }
    return data.documents ?? [];
  };

  const openAddTeacher = () => {
    setEditingTeacherId(null);
    setForm(initialForm);
    setFormError("");
    setActiveTab("personal");
    setIsFormModalOpen(true);
  };

  const openEditTeacher = async (teacherId: number) => {
    setFormError("");
    try {
      const detail = await getTeacherDetail(teacherId);
      setEditingTeacherId(teacherId);
      setForm(toForm(detail));
      setActiveTab("personal");
      setIsFormModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load teacher details.");
    }
  };

  const openViewTeacher = async (teacherId: number) => {
    setViewError("");
    try {
      const detail = await getTeacherDetail(teacherId);
      setViewTeacher(detail);
      setIsViewOpen(true);
    } catch (err) {
      setViewError(err instanceof Error ? err.message : "Failed to load teacher details.");
    }
  };

  const openDocuments = async (teacher: TeacherRow) => {
    setDocsError("");
    setUploadFile(null);
    setUploadType("Teaching Certificate");
    setDocsTeacher(teacher);
    setIsDocsOpen(true);
    try {
      const docs = await getTeacherDocuments(teacher.id);
      setDocuments(docs);
    } catch (err) {
      setDocsError(err instanceof Error ? err.message : "Failed to load documents.");
    }
  };

  const closeFormModal = () => {
    if (isSaving) return;
    setIsFormModalOpen(false);
    setEditingTeacherId(null);
    setForm(initialForm);
    setFormError("");
    setActiveTab("personal");
  };

  useEffect(() => {
    if (!isFormModalOpen) {
      return;
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        setIsFormModalOpen(false);
        setEditingTeacherId(null);
        setForm(initialForm);
        setFormError("");
        setActiveTab("personal");
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isFormModalOpen, isSaving]);

  const validateRequired = () => {
    if (!form.firstName || !form.lastName) {
      setActiveTab("personal");
      return "First name and last name are required.";
    }
    if (!form.phoneNumber || !form.email) {
      setActiveTab("contact");
      return "Phone and email are required.";
    }
    if (!form.employeeNo || !form.employmentDate || !form.department) {
      setActiveTab("employment");
      return "Employee ID, hire date, and department are required.";
    }
    return null;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const validationError = validateRequired();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSaving(true);
    const payload = {
      ...form,
      yearsOfService: form.yearsOfService ? Number(form.yearsOfService) : null,
      yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : null,
      weeklyTeachingHours: form.weeklyTeachingHours ? Number(form.weeklyTeachingHours) : null,
      salary: form.salary ? Number(form.salary) : null,
    };

    const response = await fetch(
      editingTeacherId ? `/api/admin/teachers/${editingTeacherId}` : "/api/admin/teachers",
      {
        method: editingTeacherId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = (await response.json()) as { ok: boolean; message?: string };
    if (!response.ok || !data.ok) {
      setFormError(data.message ?? "Failed to save teacher.");
      setIsSaving(false);
      return;
    }

    await load();
    setIsSaving(false);
    closeFormModal();
  };

  const uploadDocument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!docsTeacher) return;
    if (!uploadFile) {
      setDocsError("Choose a file to upload.");
      return;
    }

    setDocsError("");
    setIsUploading(true);
    const formData = new FormData();
    formData.append("documentType", uploadType);
    formData.append("file", uploadFile);

    const response = await fetch(`/api/admin/teachers/${docsTeacher.id}/documents`, {
      method: "POST",
      body: formData,
    });
    const data = (await response.json()) as { ok: boolean; message?: string; documents?: TeacherDocument[] };

    if (!response.ok || !data.ok) {
      setDocsError(data.message ?? "Failed to upload document.");
      setIsUploading(false);
      return;
    }

    setDocuments(data.documents ?? []);
    setUploadFile(null);
    setIsUploading(false);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">Manage teacher profiles, class assignments, and employment records.</p>
        <button
          type="button"
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          onClick={openAddTeacher}
        >
          Add Teacher
        </button>
      </div>

      {error ? <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-600">Loading teachers...</p> : null}
      {viewError ? <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{viewError}</p> : null}

      {!loading ? (
        <Table
          columns={["Employee No", "Name", "Email", "Department", "Subjects", "Classes", "Status", "Actions"]}
          rows={teachers.map((teacher) => [
            teacher.employeeNo,
            teacher.name,
            teacher.email,
            teacher.department,
            teacher.subjects,
            teacher.classes,
            teacher.status,
            <div key={`actions-${teacher.id}`} className="flex gap-2">
              <button
                type="button"
                className="rounded border border-blue-200 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                onClick={() => void openViewTeacher(teacher.id)}
              >
                View
              </button>
              <button
                type="button"
                className="rounded border border-blue-200 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                onClick={() => void openEditTeacher(teacher.id)}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded border border-blue-200 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                onClick={() => void openDocuments(teacher)}
              >
                Documents
              </button>
            </div>,
          ])}
        />
      ) : null}

      {isFormModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSaving) {
              closeFormModal();
            }
          }}
        >
          <div className="w-full max-w-4xl rounded-xl bg-white shadow-lg">
            <div className="flex items-start justify-between border-b border-blue-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-blue-950">{editingTeacherId ? "Edit Teacher" : "Add Teacher"}</h2>
                <p className="mt-1 text-sm text-slate-600">Capture personal, HR, teaching, and payroll information.</p>
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                onClick={closeFormModal}
                disabled={isSaving}
                aria-label="Close modal"
              >
                X
              </button>
            </div>

            <form onSubmit={submit}>
              <div className="border-b border-blue-100 px-6 pt-4">
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`rounded-t-lg border border-b-0 px-4 py-2 text-sm font-medium ${
                        activeTab === tab.key
                          ? "border-blue-300 bg-blue-50 text-blue-900"
                          : "border-transparent text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-6">
                {activeTab === "personal" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} placeholder="First Name *" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.middleName} onChange={(e) => setForm((p) => ({ ...p, middleName: e.target.value }))} placeholder="Middle Name" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} placeholder="Last Name *" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input type="date" value={form.dateOfBirth} onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))} className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.gender} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))} placeholder="Gender" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.nationality} onChange={(e) => setForm((p) => ({ ...p, nationality: e.target.value }))} placeholder="Nationality" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                  </section>
                ) : null}

                {activeTab === "contact" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <input value={form.phoneNumber} onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))} placeholder="Phone Number *" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email Address *" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.addressLine} onChange={(e) => setForm((p) => ({ ...p, addressLine: e.target.value }))} placeholder="Home Address" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="City / Town" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                  </section>
                ) : null}

                {activeTab === "employment" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <input value={form.employeeNo} onChange={(e) => setForm((p) => ({ ...p, employeeNo: e.target.value }))} placeholder="Employee ID *" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input type="date" value={form.employmentDate} onChange={(e) => setForm((p) => ({ ...p, employmentDate: e.target.value }))} className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} placeholder="Department *" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} placeholder="Status" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.employmentCategory} onChange={(e) => setForm((p) => ({ ...p, employmentCategory: e.target.value }))} placeholder="Government / School-employed" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.contractType} onChange={(e) => setForm((p) => ({ ...p, contractType: e.target.value }))} placeholder="Contract / Permanent" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input type="number" value={form.yearsOfService} onChange={(e) => setForm((p) => ({ ...p, yearsOfService: e.target.value }))} placeholder="Years of Service" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                  </section>
                ) : null}

                {activeTab === "teaching" ? (
                  <section className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <input value={form.primarySubject} onChange={(e) => setForm((p) => ({ ...p, primarySubject: e.target.value }))} placeholder="Primary Subject" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                      <input value={form.secondarySubject} onChange={(e) => setForm((p) => ({ ...p, secondarySubject: e.target.value }))} placeholder="Secondary Subject" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-700">Subjects Assigned</p>
                      <div className="grid gap-2 md:grid-cols-3">
                        {subjects.map((subject) => (
                          <label key={subject.id} className="flex items-center gap-2 rounded border border-blue-100 p-2 text-sm">
                            <input
                              type="checkbox"
                              checked={form.subjectIds.includes(subject.id)}
                              onChange={() => setForm((prev) => ({ ...prev, subjectIds: toggleSelection(prev.subjectIds, subject.id) }))}
                            />
                            {subject.name}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-700">Classes Assigned</p>
                      <div className="grid gap-2 md:grid-cols-3">
                        {classes.map((classOption) => (
                          <label key={classOption.id} className="flex items-center gap-2 rounded border border-blue-100 p-2 text-sm">
                            <input
                              type="checkbox"
                              checked={form.classIds.includes(classOption.id)}
                              onChange={() => setForm((prev) => ({ ...prev, classIds: toggleSelection(prev.classIds, classOption.id) }))}
                            />
                            {classOption.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  </section>
                ) : null}

                {activeTab === "qualifications" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <input value={form.highestQualification} onChange={(e) => setForm((p) => ({ ...p, highestQualification: e.target.value }))} placeholder="Highest Qualification" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.specializations} onChange={(e) => setForm((p) => ({ ...p, specializations: e.target.value }))} placeholder="Specializations" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.teacherRegistrationNumber} onChange={(e) => setForm((p) => ({ ...p, teacherRegistrationNumber: e.target.value }))} placeholder="Teacher Registration Number" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.teachingCouncilRegistration} onChange={(e) => setForm((p) => ({ ...p, teachingCouncilRegistration: e.target.value }))} placeholder="Teaching Council Registration" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.teachingCertificateNumber} onChange={(e) => setForm((p) => ({ ...p, teachingCertificateNumber: e.target.value }))} placeholder="Teaching Certificate Number" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.teacherTrainingCollege} onChange={(e) => setForm((p) => ({ ...p, teacherTrainingCollege: e.target.value }))} placeholder="Teacher Training College" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.universityQualification} onChange={(e) => setForm((p) => ({ ...p, universityQualification: e.target.value }))} placeholder="University Qualification" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                  </section>
                ) : null}

                {activeTab === "payroll" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <input type="number" value={form.salary} onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))} placeholder="Salary" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.paymentMethod} onChange={(e) => setForm((p) => ({ ...p, paymentMethod: e.target.value }))} placeholder="Payment Method" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                  </section>
                ) : null}

                {activeTab === "emergency" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <input value={form.emergencyContactName} onChange={(e) => setForm((p) => ({ ...p, emergencyContactName: e.target.value }))} placeholder="Emergency Contact Name" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                    <input value={form.emergencyContactPhone} onChange={(e) => setForm((p) => ({ ...p, emergencyContactPhone: e.target.value }))} placeholder="Emergency Contact Phone" className="w-full rounded-lg border border-blue-200 px-3 py-2" />
                  </section>
                ) : null}
              </div>

              <div className="flex items-center justify-between border-t border-blue-100 bg-white px-6 py-4">
                {formError ? <p className="text-sm text-red-600">{formError}</p> : <span />}
                <div className="flex gap-3">
                  <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={closeFormModal} disabled={isSaving}>Cancel</button>
                  <button type="submit" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60" disabled={isSaving}>{isSaving ? "Saving..." : "Save Teacher"}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isViewOpen && viewTeacher ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && setIsViewOpen(false)}>
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-blue-950">Teacher Details</h3>
              <button type="button" onClick={() => setIsViewOpen(false)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100">X</button>
            </div>
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <p><strong>Name:</strong> {viewTeacher.firstName} {viewTeacher.lastName}</p>
              <p><strong>Employee ID:</strong> {viewTeacher.employeeNo}</p>
              <p><strong>Email:</strong> {viewTeacher.email}</p>
              <p><strong>Phone:</strong> {viewTeacher.phoneNumber}</p>
              <p><strong>Department:</strong> {viewTeacher.department}</p>
              <p><strong>Status:</strong> {viewTeacher.status}</p>
              <p><strong>Subjects:</strong> {viewTeacher.subjectIds.length}</p>
              <p><strong>Classes:</strong> {viewTeacher.classIds.length}</p>
            </div>
          </div>
        </div>
      ) : null}

      {isDocsOpen && docsTeacher ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && !isUploading && setIsDocsOpen(false)}>
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-blue-950">Documents: {docsTeacher.name}</h3>
              <button type="button" onClick={() => setIsDocsOpen(false)} className="rounded px-2 py-1 text-slate-500 hover:bg-slate-100">X</button>
            </div>

            <form className="mb-4 grid gap-3 md:grid-cols-3" onSubmit={uploadDocument}>
              <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="rounded-lg border border-blue-200 px-3 py-2 text-sm">
                <option>Teaching Certificate</option>
                <option>Degree Certificate</option>
                <option>National ID Copy</option>
                <option>Employment Contract</option>
                <option>Resume / CV</option>
                <option>Background Check</option>
                <option>Other</option>
              </select>
              <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} className="rounded-lg border border-blue-200 px-3 py-2 text-sm" />
              <button type="submit" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60" disabled={isUploading}>{isUploading ? "Uploading..." : "Upload"}</button>
            </form>

            {docsError ? <p className="mb-3 text-sm text-red-600">{docsError}</p> : null}

            <div className="max-h-72 overflow-y-auto rounded-lg border border-blue-100">
              {documents.length === 0 ? (
                <p className="p-3 text-sm text-slate-600">No documents uploaded.</p>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-blue-50 text-slate-700">
                    <tr>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">File</th>
                      <th className="px-3 py-2">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-t border-blue-50">
                        <td className="px-3 py-2">{doc.documentType}</td>
                        <td className="px-3 py-2">
                          <a href={doc.filePath} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                            {doc.fileName}
                          </a>
                        </td>
                        <td className="px-3 py-2">{new Date(doc.uploadedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
