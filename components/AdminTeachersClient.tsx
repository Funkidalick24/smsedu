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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TeacherFormTab>("personal");
  const [form, setForm] = useState<TeacherFormState>(initialForm);
  const [formError, setFormError] = useState("");

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

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveTab("personal");
    setForm(initialForm);
    setFormError("");
  };

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        closeModal();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isModalOpen, isSaving]);

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
    const response = await fetch("/api/admin/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : null,
        weeklyTeachingHours: form.weeklyTeachingHours ? Number(form.weeklyTeachingHours) : null,
        salary: form.salary ? Number(form.salary) : null,
      }),
    });
    const data = (await response.json()) as { ok: boolean; message?: string };
    if (!response.ok || !data.ok) {
      setFormError(data.message ?? "Failed to create teacher.");
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
        <p className="text-sm text-slate-600">Manage teacher profiles, class assignments, and employment records.</p>
        <button
          type="button"
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          onClick={() => {
            setActiveTab("personal");
            setIsModalOpen(true);
          }}
        >
          Add Teacher
        </button>
      </div>

      {error ? <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-600">Loading teachers...</p> : null}

      {!loading ? (
        <Table
          columns={["Employee No", "Name", "Email", "Department", "Subjects", "Classes", "Status"]}
          rows={teachers.map((teacher) => [
            teacher.employeeNo,
            teacher.name,
            teacher.email,
            teacher.department,
            teacher.subjects,
            teacher.classes,
            teacher.status,
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
          <div className="w-full max-w-4xl rounded-xl bg-white shadow-lg">
            <div className="flex items-start justify-between border-b border-blue-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-blue-950">Add Teacher</h2>
                <p className="mt-1 text-sm text-slate-600">Capture personal, HR, teaching, and payroll information.</p>
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
                    <input
                      value={form.firstName}
                      onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                      placeholder="First Name *"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.middleName}
                      onChange={(event) => setForm((prev) => ({ ...prev, middleName: event.target.value }))}
                      placeholder="Middle Name"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.lastName}
                      onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                      placeholder="Last Name *"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(event) => setForm((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <select
                      value={form.gender}
                      onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    >
                      <option value="">Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      value={form.nationality}
                      onChange={(event) => setForm((prev) => ({ ...prev, nationality: event.target.value }))}
                      placeholder="Nationality"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.nationalIdNumber}
                      onChange={(event) => setForm((prev) => ({ ...prev, nationalIdNumber: event.target.value }))}
                      placeholder="National ID / Passport"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.maritalStatus}
                      onChange={(event) => setForm((prev) => ({ ...prev, maritalStatus: event.target.value }))}
                      placeholder="Marital Status"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                  </section>
                ) : null}

                {activeTab === "contact" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <input
                      value={form.phoneNumber}
                      onChange={(event) => setForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                      placeholder="Phone Number *"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      placeholder="Email Address *"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.addressLine}
                      onChange={(event) => setForm((prev) => ({ ...prev, addressLine: event.target.value }))}
                      placeholder="Home Address"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.city}
                      onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
                      placeholder="City / Town"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.postalCode}
                      onChange={(event) => setForm((prev) => ({ ...prev, postalCode: event.target.value }))}
                      placeholder="Postal Code"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                  </section>
                ) : null}

                {activeTab === "employment" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <input
                      value={form.employeeNo}
                      onChange={(event) => setForm((prev) => ({ ...prev, employeeNo: event.target.value }))}
                      placeholder="Employee ID *"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      type="date"
                      value={form.employmentDate}
                      onChange={(event) => setForm((prev) => ({ ...prev, employmentDate: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <select
                      value={form.employmentType}
                      onChange={(event) => setForm((prev) => ({ ...prev, employmentType: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    >
                      <option value="">Employment Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                    <input
                      value={form.jobTitle}
                      onChange={(event) => setForm((prev) => ({ ...prev, jobTitle: event.target.value }))}
                      placeholder="Job Title"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.department}
                      onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
                      placeholder="Department *"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <select
                      value={form.status}
                      onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </section>
                ) : null}

                {activeTab === "teaching" ? (
                  <section className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={form.gradeLevelsTaught}
                        onChange={(event) => setForm((prev) => ({ ...prev, gradeLevelsTaught: event.target.value }))}
                        placeholder="Grade Levels Taught"
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                      <input
                        value={form.academicDepartment}
                        onChange={(event) => setForm((prev) => ({ ...prev, academicDepartment: event.target.value }))}
                        placeholder="Academic Department"
                        className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.homeroomTeacher}
                        onChange={(event) => setForm((prev) => ({ ...prev, homeroomTeacher: event.target.checked }))}
                      />
                      Homeroom / Class Teacher
                    </label>

                    <div>
                      <p className="mb-2 text-sm font-medium text-slate-700">Subjects Assigned</p>
                      <div className="grid gap-2 md:grid-cols-3">
                        {subjects.map((subject) => (
                          <label key={subject.id} className="flex items-center gap-2 rounded border border-blue-100 p-2 text-sm">
                            <input
                              type="checkbox"
                              checked={form.subjectIds.includes(subject.id)}
                              onChange={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  subjectIds: toggleSelection(prev.subjectIds, subject.id),
                                }))
                              }
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
                              onChange={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  classIds: toggleSelection(prev.classIds, classOption.id),
                                }))
                              }
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
                    <input
                      value={form.highestQualification}
                      onChange={(event) => setForm((prev) => ({ ...prev, highestQualification: event.target.value }))}
                      placeholder="Highest Qualification"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.degrees}
                      onChange={(event) => setForm((prev) => ({ ...prev, degrees: event.target.value }))}
                      placeholder="Degree(s)"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.teachingCertification}
                      onChange={(event) => setForm((prev) => ({ ...prev, teachingCertification: event.target.value }))}
                      placeholder="Teaching Certification"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.professionalLicenseNumber}
                      onChange={(event) => setForm((prev) => ({ ...prev, professionalLicenseNumber: event.target.value }))}
                      placeholder="Professional License Number"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.specializations}
                      onChange={(event) => setForm((prev) => ({ ...prev, specializations: event.target.value }))}
                      placeholder="Specializations"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      type="number"
                      value={form.yearsExperience}
                      onChange={(event) => setForm((prev) => ({ ...prev, yearsExperience: event.target.value }))}
                      placeholder="Years of Experience"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.previousSchools}
                      onChange={(event) => setForm((prev) => ({ ...prev, previousSchools: event.target.value }))}
                      placeholder="Previous Schools Worked At"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2 md:col-span-2"
                    />
                  </section>
                ) : null}

                {activeTab === "payroll" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <input
                      type="number"
                      value={form.weeklyTeachingHours}
                      onChange={(event) => setForm((prev) => ({ ...prev, weeklyTeachingHours: event.target.value }))}
                      placeholder="Weekly Teaching Hours"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.timetableAssignments}
                      onChange={(event) => setForm((prev) => ({ ...prev, timetableAssignments: event.target.value }))}
                      placeholder="Timetable Assignments"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.subjectLoad}
                      onChange={(event) => setForm((prev) => ({ ...prev, subjectLoad: event.target.value }))}
                      placeholder="Subject Load"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      type="number"
                      value={form.salary}
                      onChange={(event) => setForm((prev) => ({ ...prev, salary: event.target.value }))}
                      placeholder="Salary"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.paymentMethod}
                      onChange={(event) => setForm((prev) => ({ ...prev, paymentMethod: event.target.value }))}
                      placeholder="Payment Method"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.bankName}
                      onChange={(event) => setForm((prev) => ({ ...prev, bankName: event.target.value }))}
                      placeholder="Bank Name"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.bankAccountNumber}
                      onChange={(event) => setForm((prev) => ({ ...prev, bankAccountNumber: event.target.value }))}
                      placeholder="Bank Account Number"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.taxNumber}
                      onChange={(event) => setForm((prev) => ({ ...prev, taxNumber: event.target.value }))}
                      placeholder="Tax Number"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                  </section>
                ) : null}

                {activeTab === "emergency" ? (
                  <section className="grid gap-4 md:grid-cols-2">
                    <input
                      value={form.emergencyContactName}
                      onChange={(event) => setForm((prev) => ({ ...prev, emergencyContactName: event.target.value }))}
                      placeholder="Emergency Contact Name"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.emergencyContactRelationship}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, emergencyContactRelationship: event.target.value }))
                      }
                      placeholder="Relationship"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.emergencyContactPhone}
                      onChange={(event) => setForm((prev) => ({ ...prev, emergencyContactPhone: event.target.value }))}
                      placeholder="Emergency Phone"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    <input
                      value={form.emergencyContactAltPhone}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, emergencyContactAltPhone: event.target.value }))
                      }
                      placeholder="Alternate Phone"
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
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
                    {isSaving ? "Saving..." : "Save Teacher"}
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
