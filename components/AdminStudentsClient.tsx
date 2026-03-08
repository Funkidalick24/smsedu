"use client";

import { FormEvent, useEffect, useState } from "react";
import Table from "./Table";

interface StudentRow {
  id: number;
  admissionNo: string;
  name: string;
  email: string;
  gradeLevel: string;
  classes: string;
  attendancePct: number;
}

interface ClassOption {
  id: number;
  name: string;
}

interface StudentsResponse {
  ok: boolean;
  message?: string;
  students?: StudentRow[];
  classes?: ClassOption[];
}

interface AdminStudentsClientProps {
  initialStudents: StudentRow[];
  initialClasses: ClassOption[];
}

type StudentFormTab = "personal" | "academic" | "guardian" | "medical";

interface StudentFormState {
  firstName: string;
  middleName: string;
  lastName: string;
  preferredName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  email: string;
  admissionNo: string;
  birthCertificateNumber: string;
  schoolLevel: "Primary" | "Secondary";
  formLevel: string;
  classStream: string;
  admissionDate: string;
  gradeLevel: string;
  sectionStream: string;
  academicYear: string;
  transferStatus: string;
  previousSchool: string;
  previousSchoolAddress: string;
  grade7ExamCentreNumber: string;
  grade7CandidateNumber: string;
  grade7Results: string;
  zimsecIndexNumber: string;
  curriculumType: string;
  houseName: string;
  classId: string;
  guardian1Name: string;
  guardian1Relationship: string;
  guardian1Phone: string;
  guardian1NationalIdNumber: string;
  guardian1Email: string;
  guardian1Occupation: string;
  guardian1Address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  knownConditions: string;
  immunisationRecord: string;
  medicalAidProvider: string;
  allergies: string;
  medications: string;
  bloodType: string;
  specialNeeds: string;
  medicalNotes: string;
}

const initialForm: StudentFormState = {
  firstName: "",
  middleName: "",
  lastName: "",
  preferredName: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  email: "",
  admissionNo: "",
  birthCertificateNumber: "",
  schoolLevel: "Primary",
  formLevel: "",
  classStream: "",
  admissionDate: new Date().toISOString().slice(0, 10),
  gradeLevel: "",
  sectionStream: "",
  academicYear: "",
  transferStatus: "",
  previousSchool: "",
  previousSchoolAddress: "",
  grade7ExamCentreNumber: "",
  grade7CandidateNumber: "",
  grade7Results: "",
  zimsecIndexNumber: "",
  curriculumType: "Heritage-Based Curriculum",
  houseName: "",
  classId: "",
  guardian1Name: "",
  guardian1Relationship: "",
  guardian1Phone: "",
  guardian1NationalIdNumber: "",
  guardian1Email: "",
  guardian1Occupation: "",
  guardian1Address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  knownConditions: "",
  immunisationRecord: "",
  medicalAidProvider: "",
  allergies: "",
  medications: "",
  bloodType: "",
  specialNeeds: "",
  medicalNotes: "",
};

const tabs: Array<{ key: StudentFormTab; label: string }> = [
  { key: "personal", label: "Personal" },
  { key: "academic", label: "Academic" },
  { key: "guardian", label: "Guardian" },
  { key: "medical", label: "Medical" },
];

export default function AdminStudentsClient({ initialStudents, initialClasses }: AdminStudentsClientProps) {
  const [students, setStudents] = useState<StudentRow[]>(initialStudents);
  const [classes, setClasses] = useState<ClassOption[]>(initialClasses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<StudentFormTab>("personal");
  const [form, setForm] = useState<StudentFormState>(initialForm);
  const [formError, setFormError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/students", { cache: "no-store" });
    const data = (await response.json()) as StudentsResponse;
    if (!response.ok || !data.ok) {
      setError(data.message ?? "Failed to load students.");
      setLoading(false);
      return;
    }
    setStudents(data.students ?? []);
    setClasses(data.classes ?? []);
    setLoading(false);
  };

  const resetForm = () => {
    setForm(initialForm);
    setFormError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveTab("personal");
    resetForm();
  };

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setActiveTab("personal");
        resetForm();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  const validateRequired = () => {
    if (!form.firstName || !form.lastName || !form.dateOfBirth || !form.gender || !form.email) {
      setActiveTab("personal");
      return "Complete required fields in Personal Information.";
    }
    if (!form.admissionNo || !form.admissionDate || !form.gradeLevel || !form.birthCertificateNumber) {
      setActiveTab("academic");
      return "Complete required fields in Academic Information.";
    }
    if (form.schoolLevel === "Secondary" && !form.formLevel) {
      setActiveTab("academic");
      return "Form level is required for secondary students.";
    }
    if (!form.guardian1Name || !form.guardian1Relationship || !form.guardian1Phone) {
      setActiveTab("guardian");
      return "Complete required fields in Parent / Guardian Information.";
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

    const response = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        classId: form.classId ? Number(form.classId) : null,
      }),
    });
    const data = (await response.json()) as { ok: boolean; message?: string };
    if (!response.ok || !data.ok) {
      setFormError(data.message ?? "Failed to create student.");
      setIsSaving(false);
      return;
    }

    await load();
    setIsSaving(false);
    closeModal();
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">Manage student records and class assignments.</p>
        <button
          type="button"
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          onClick={() => {
            setActiveTab("personal");
            setIsModalOpen(true);
          }}
        >
          Add Student
        </button>
      </div>

      {error ? <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-600">Loading students...</p> : null}

      {!loading ? (
        <Table
          columns={["Admission No", "Name", "Email", "Grade", "Class", "Attendance (30 days)"]}
          rows={students.map((student) => [
            student.admissionNo,
            student.name,
            student.email,
            student.gradeLevel,
            student.classes,
            `${student.attendancePct}%`,
          ])}
        />
      ) : null}

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSaving) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-lg">
            <div className="flex items-start justify-between border-b border-blue-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-blue-950">Add Student</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Capture student profile, guardian contact, medical info, and class assignment.
                </p>
              </div>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                onClick={closeModal}
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
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">First Name</label>
                      <input
                        value={form.firstName}
                        onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Middle Name</label>
                      <input
                        value={form.middleName}
                        onChange={(event) => setForm((prev) => ({ ...prev, middleName: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Last Name</label>
                      <input
                        value={form.lastName}
                        onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Preferred Name</label>
                      <input
                        value={form.preferredName}
                        onChange={(event) => setForm((prev) => ({ ...prev, preferredName: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Date of Birth</label>
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(event) => setForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Gender</label>
                      <select
                        value={form.gender}
                        onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      >
                        <option value="">Select gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Nationality</label>
                      <input
                        value={form.nationality}
                        onChange={(event) => setForm((prev) => ({ ...prev, nationality: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Student Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                  </section>
                ) : null}

                {activeTab === "academic" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Admission Number</label>
                      <input
                        value={form.admissionNo}
                        onChange={(event) => setForm((prev) => ({ ...prev, admissionNo: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Birth Certificate Number</label>
                      <input
                        value={form.birthCertificateNumber}
                        onChange={(event) => setForm((prev) => ({ ...prev, birthCertificateNumber: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Admission Date</label>
                      <input
                        type="date"
                        value={form.admissionDate}
                        onChange={(event) => setForm((prev) => ({ ...prev, admissionDate: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">School Level</label>
                      <select
                        value={form.schoolLevel}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, schoolLevel: event.target.value as "Primary" | "Secondary" }))
                        }
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      >
                        <option value="Primary">Primary</option>
                        <option value="Secondary">Secondary</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Grade Level</label>
                      <input
                        value={form.gradeLevel}
                        onChange={(event) => setForm((prev) => ({ ...prev, gradeLevel: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Form Level (Secondary)</label>
                      <input
                        value={form.formLevel}
                        onChange={(event) => setForm((prev) => ({ ...prev, formLevel: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Class Stream</label>
                      <input
                        value={form.classStream}
                        onChange={(event) => setForm((prev) => ({ ...prev, classStream: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Section / Stream</label>
                      <input
                        value={form.sectionStream}
                        onChange={(event) => setForm((prev) => ({ ...prev, sectionStream: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Academic Year</label>
                      <input
                        value={form.academicYear}
                        onChange={(event) => setForm((prev) => ({ ...prev, academicYear: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Assign Class</label>
                      <select
                        value={form.classId}
                        onChange={(event) => setForm((prev) => ({ ...prev, classId: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      >
                        <option value="">Unassigned</option>
                        {classes.map((classOption) => (
                          <option key={classOption.id} value={classOption.id}>
                            {classOption.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Transfer Status</label>
                      <input
                        value={form.transferStatus}
                        onChange={(event) => setForm((prev) => ({ ...prev, transferStatus: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Previous School</label>
                      <input
                        value={form.previousSchool}
                        onChange={(event) => setForm((prev) => ({ ...prev, previousSchool: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Previous School Address</label>
                      <input
                        value={form.previousSchoolAddress}
                        onChange={(event) => setForm((prev) => ({ ...prev, previousSchoolAddress: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Grade 7 Centre Number</label>
                      <input
                        value={form.grade7ExamCentreNumber}
                        onChange={(event) => setForm((prev) => ({ ...prev, grade7ExamCentreNumber: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Grade 7 Candidate Number</label>
                      <input
                        value={form.grade7CandidateNumber}
                        onChange={(event) => setForm((prev) => ({ ...prev, grade7CandidateNumber: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Grade 7 Results</label>
                      <input
                        value={form.grade7Results}
                        onChange={(event) => setForm((prev) => ({ ...prev, grade7Results: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">ZIMSEC Index Number</label>
                      <input
                        value={form.zimsecIndexNumber}
                        onChange={(event) => setForm((prev) => ({ ...prev, zimsecIndexNumber: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Curriculum Type</label>
                      <select
                        value={form.curriculumType}
                        onChange={(event) => setForm((prev) => ({ ...prev, curriculumType: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      >
                        <option value="Heritage-Based Curriculum">Heritage-Based Curriculum</option>
                        <option value="Cambridge">Cambridge</option>
                        <option value="International Baccalaureate">International Baccalaureate</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">House Name</label>
                      <input
                        value={form.houseName}
                        onChange={(event) => setForm((prev) => ({ ...prev, houseName: event.target.value }))}
                        placeholder="Mhofu, Shumba, Nzou..."
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                  </section>
                ) : null}

                {activeTab === "guardian" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Guardian Name</label>
                      <input
                        value={form.guardian1Name}
                        onChange={(event) => setForm((prev) => ({ ...prev, guardian1Name: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Relationship</label>
                      <input
                        value={form.guardian1Relationship}
                        onChange={(event) => setForm((prev) => ({ ...prev, guardian1Relationship: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Guardian Phone</label>
                      <input
                        value={form.guardian1Phone}
                        onChange={(event) => setForm((prev) => ({ ...prev, guardian1Phone: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Guardian National ID</label>
                      <input
                        value={form.guardian1NationalIdNumber}
                        onChange={(event) => setForm((prev) => ({ ...prev, guardian1NationalIdNumber: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Guardian Email</label>
                      <input
                        type="email"
                        value={form.guardian1Email}
                        onChange={(event) => setForm((prev) => ({ ...prev, guardian1Email: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Guardian Occupation</label>
                      <input
                        value={form.guardian1Occupation}
                        onChange={(event) => setForm((prev) => ({ ...prev, guardian1Occupation: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Guardian Address</label>
                      <input
                        value={form.guardian1Address}
                        onChange={(event) => setForm((prev) => ({ ...prev, guardian1Address: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Emergency Contact Name</label>
                      <input
                        value={form.emergencyContactName}
                        onChange={(event) => setForm((prev) => ({ ...prev, emergencyContactName: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Emergency Contact Phone</label>
                      <input
                        value={form.emergencyContactPhone}
                        onChange={(event) => setForm((prev) => ({ ...prev, emergencyContactPhone: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                  </section>
                ) : null}

                {activeTab === "medical" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Known Medical Conditions</label>
                      <input
                        value={form.knownConditions}
                        onChange={(event) => setForm((prev) => ({ ...prev, knownConditions: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Immunisation Record</label>
                      <input
                        value={form.immunisationRecord}
                        onChange={(event) => setForm((prev) => ({ ...prev, immunisationRecord: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Medical Aid Provider</label>
                      <input
                        value={form.medicalAidProvider}
                        onChange={(event) => setForm((prev) => ({ ...prev, medicalAidProvider: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Allergies</label>
                      <input
                        value={form.allergies}
                        onChange={(event) => setForm((prev) => ({ ...prev, allergies: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Medications</label>
                      <input
                        value={form.medications}
                        onChange={(event) => setForm((prev) => ({ ...prev, medications: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Blood Type</label>
                      <input
                        value={form.bloodType}
                        onChange={(event) => setForm((prev) => ({ ...prev, bloodType: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Special Needs</label>
                      <input
                        value={form.specialNeeds}
                        onChange={(event) => setForm((prev) => ({ ...prev, specialNeeds: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">Medical Notes</label>
                      <textarea
                        value={form.medicalNotes}
                        onChange={(event) => setForm((prev) => ({ ...prev, medicalNotes: event.target.value }))}
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                        rows={3}
                      />
                    </div>
                  </section>
                ) : null}
              </div>

              <div className="flex items-center justify-between border-t border-blue-100 bg-white px-6 py-4">
                {formError ? <p className="text-sm text-red-600">{formError}</p> : <span />}
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={closeModal}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Student"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
