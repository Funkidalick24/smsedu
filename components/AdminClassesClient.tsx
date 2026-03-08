"use client";

import { FormEvent, useEffect, useState } from "react";
import Table from "./Table";

interface AdminClassRow {
  id: number;
  className: string;
  sectionStream: string;
  academicYear: string;
  term: string;
  gradeLevel: string;
  teacherName: string;
  maxStudents: number;
  students: number;
  subjects: string;
  attendancePct: number;
  status: string;
}

interface TeacherOption {
  id: number;
  name: string;
}

interface SubjectOption {
  id: number;
  name: string;
  code: string;
}

interface ClassesResponse {
  ok: boolean;
  message?: string;
  classes?: AdminClassRow[];
  teachers?: TeacherOption[];
  subjects?: SubjectOption[];
}

interface AdminClassesClientProps {
  initialClasses: AdminClassRow[];
  initialTeachers: TeacherOption[];
  initialSubjects: SubjectOption[];
}

interface ClassSubjectFormRow {
  subjectId: string;
  teacherId: string;
  subjectCode: string;
}

interface ClassFormState {
  className: string;
  sectionStream: string;
  schoolLevel: "Primary" | "Secondary";
  formLevel: string;
  academicYear: string;
  term: string;
  gradeLevel: string;
  streamLetter: string;
  curriculumType: string;
  classTeacherId: string;
  assistantTeacherId: string;
  department: string;
  maxStudents: string;
  building: string;
  roomNumber: string;
  floor: string;
  attendanceMode: "daily" | "period";
  attendanceTeacherId: string;
  trackLateArrivals: boolean;
  gradingSystem: string;
  assessmentTypes: string;
  passingScore: string;
  notes: string;
  subjects: ClassSubjectFormRow[];
}

const initialForm: ClassFormState = {
  className: "",
  sectionStream: "",
  schoolLevel: "Primary",
  formLevel: "",
  academicYear: new Date().getFullYear().toString(),
  term: "Term 1",
  gradeLevel: "",
  streamLetter: "",
  curriculumType: "Heritage-Based Curriculum",
  classTeacherId: "",
  assistantTeacherId: "",
  department: "",
  maxStudents: "35",
  building: "",
  roomNumber: "",
  floor: "",
  attendanceMode: "daily",
  attendanceTeacherId: "",
  trackLateArrivals: true,
  gradingSystem: "Term Reports",
  assessmentTypes: "Continuous Assessment, End of Term Exam",
  passingScore: "50",
  notes: "",
  subjects: [{ subjectId: "", teacherId: "", subjectCode: "" }],
};

export default function AdminClassesClient({
  initialClasses,
  initialTeachers,
  initialSubjects,
}: AdminClassesClientProps) {
  const [classes, setClasses] = useState<AdminClassRow[]>(initialClasses);
  const [teachers, setTeachers] = useState<TeacherOption[]>(initialTeachers);
  const [subjects, setSubjects] = useState<SubjectOption[]>(initialSubjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<ClassFormState>(initialForm);
  const [formError, setFormError] = useState("");
  const [showRequiredHighlights, setShowRequiredHighlights] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/classes", { cache: "no-store" });
    const data = (await response.json()) as ClassesResponse;
    if (!response.ok || !data.ok) {
      setError(data.message ?? "Failed to load classes.");
      setLoading(false);
      return;
    }
    setClasses(data.classes ?? []);
    setTeachers(data.teachers ?? []);
    setSubjects(data.subjects ?? []);
    setLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(initialForm);
    setFormError("");
    setShowRequiredHighlights(false);
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
    if (!form.className || !form.sectionStream || !form.academicYear || !form.term || !form.gradeLevel) {
      return "Class name, section, academic year, term, and grade level are required.";
    }
    if (form.schoolLevel === "Secondary" && !form.formLevel) {
      return "Form level is required for secondary classes.";
    }

    const maxStudents = Number(form.maxStudents);
    if (!Number.isFinite(maxStudents) || maxStudents < 1 || maxStudents > 120) {
      return "Maximum students must be a number between 1 and 120.";
    }

    const selectedSubjects = form.subjects.filter((subject) => subject.subjectId);
    if (selectedSubjects.length === 0) {
      return "Add at least one subject for this class.";
    }

    return null;
  };

  const addSubjectRow = () => {
    setForm((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { subjectId: "", teacherId: "", subjectCode: "" }],
    }));
  };

  const removeSubjectRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const updateSubjectRow = (index: number, patch: Partial<ClassSubjectFormRow>) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)),
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setShowRequiredHighlights(true);

    const validationError = validateRequired();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setShowRequiredHighlights(false);
    setIsSaving(true);

    const response = await fetch("/api/admin/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        classTeacherId: form.classTeacherId ? Number(form.classTeacherId) : null,
        assistantTeacherId: form.assistantTeacherId ? Number(form.assistantTeacherId) : null,
        attendanceTeacherId: form.attendanceTeacherId ? Number(form.attendanceTeacherId) : null,
        maxStudents: Number(form.maxStudents),
        passingScore: form.passingScore ? Number(form.passingScore) : undefined,
        subjects: form.subjects
          .filter((subject) => subject.subjectId)
          .map((subject) => ({
            subjectId: Number(subject.subjectId),
            teacherId: subject.teacherId ? Number(subject.teacherId) : null,
            subjectCode: subject.subjectCode,
          })),
      }),
    });

    const data = (await response.json()) as { ok: boolean; message?: string };
    if (!response.ok || !data.ok) {
      setFormError(data.message ?? "Failed to create class.");
      setIsSaving(false);
      return;
    }

    await load();
    setIsSaving(false);
    closeModal();
  };

  const requiredInputClass = (missing: boolean) =>
    `w-full rounded-lg border px-3 py-2 ${
      showRequiredHighlights && missing ? "border-red-500 bg-red-50" : "border-blue-200"
    }`;

  const hasSelectedSubject = form.subjects.some((subject) => subject.subjectId);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Configure class structure, teachers, capacity, academic settings, and subject assignments.
        </p>
        <button
          type="button"
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          onClick={() => setIsModalOpen(true)}
        >
          Add Class
        </button>
      </div>

      {error ? <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-600">Loading classes...</p> : null}

      {!loading ? (
        <Table
          columns={[
            "Class",
            "Year / Term",
            "Class Teacher",
            "Subjects",
            "Capacity",
            "Students",
            "Attendance (30 days)",
          ]}
          rows={classes.map((classItem) => [
            `${classItem.className}`,
            `${classItem.academicYear} - ${classItem.term}`,
            classItem.teacherName,
            classItem.subjects,
            String(classItem.maxStudents),
            String(classItem.students),
            `${classItem.attendancePct}%`,
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
          <div className="w-full max-w-5xl rounded-xl bg-white shadow-lg">
            <div className="flex items-start justify-between border-b border-blue-100 p-6">
              <div>
                <h2 className="text-xl font-bold text-blue-950">Create Class</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Capture class details, assignments, capacity, location, attendance, and academic setup.
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
              <div className="max-h-[70vh] overflow-y-auto p-6">
                <section className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Class Details</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Class Name *</label>
                      <input
                        value={form.className}
                        onChange={(event) => setForm((prev) => ({ ...prev, className: event.target.value }))}
                        className={requiredInputClass(!form.className.trim())}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Section / Stream *</label>
                    <input
                      value={form.sectionStream}
                      onChange={(event) => setForm((prev) => ({ ...prev, sectionStream: event.target.value }))}
                      className={requiredInputClass(!form.sectionStream.trim())}
                      required
                    />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Stream Letter</label>
                    <input
                      value={form.streamLetter}
                      onChange={(event) => setForm((prev) => ({ ...prev, streamLetter: event.target.value }))}
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
                      <option value="Primary">Primary School</option>
                      <option value="Secondary">Secondary School</option>
                    </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Form Level * (Secondary only)</label>
                    <input
                      value={form.formLevel}
                      onChange={(event) => setForm((prev) => ({ ...prev, formLevel: event.target.value }))}
                      className={requiredInputClass(form.schoolLevel === "Secondary" && !form.formLevel.trim())}
                      required={form.schoolLevel === "Secondary"}
                    />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Grade Level *</label>
                    <input
                      value={form.gradeLevel}
                      onChange={(event) => setForm((prev) => ({ ...prev, gradeLevel: event.target.value }))}
                      className={requiredInputClass(!form.gradeLevel.trim())}
                      required
                    />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Academic Year *</label>
                    <input
                      value={form.academicYear}
                      onChange={(event) => setForm((prev) => ({ ...prev, academicYear: event.target.value }))}
                      className={requiredInputClass(!form.academicYear.trim())}
                      required
                    />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Term *</label>
                    <input
                      value={form.term}
                      onChange={(event) => setForm((prev) => ({ ...prev, term: event.target.value }))}
                      className={requiredInputClass(!form.term.trim())}
                      required
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
                      <label className="mb-1 block text-sm font-medium text-slate-700">Maximum Students *</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={form.maxStudents}
                      onChange={(event) => setForm((prev) => ({ ...prev, maxStudents: event.target.value }))}
                      className={requiredInputClass(!form.maxStudents.trim())}
                      required
                    />
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Administration</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Class Teacher</label>
                    <select
                      value={form.classTeacherId}
                      onChange={(event) => setForm((prev) => ({ ...prev, classTeacherId: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    >
                      <option value="">Class Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Assistant Teacher</label>
                    <select
                      value={form.assistantTeacherId}
                      onChange={(event) => setForm((prev) => ({ ...prev, assistantTeacherId: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    >
                      <option value="">Assistant Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Department</label>
                    <input
                      value={form.department}
                      onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Subjects</h3>
                  <div className="space-y-3">
                    {form.subjects.map((subjectRow, index) => (
                      <div key={`subject-row-${index}`} className="grid gap-3 rounded-lg border border-blue-100 p-3 md:grid-cols-4">
                        <div>
                          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">Subject</label>
                        <select
                          value={subjectRow.subjectId}
                          onChange={(event) => {
                            const selected = subjects.find((subject) => subject.id === Number(event.target.value));
                            updateSubjectRow(index, {
                              subjectId: event.target.value,
                              subjectCode: selected?.code ?? "",
                            });
                          }}
                          className={`rounded-lg border px-3 py-2 ${showRequiredHighlights && !hasSelectedSubject ? "border-red-500 bg-red-50" : "border-blue-200"}`}
                        >
                          <option value="">Subject *</option>
                          {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.name}
                            </option>
                          ))}
                        </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">Assigned Teacher</label>
                        <select
                          value={subjectRow.teacherId}
                          onChange={(event) => updateSubjectRow(index, { teacherId: event.target.value })}
                          className="rounded-lg border border-blue-200 px-3 py-2"
                        >
                          <option value="">Assigned Teacher</option>
                          {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </option>
                          ))}
                        </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-600">Subject Code</label>
                        <input
                          value={subjectRow.subjectCode}
                          onChange={(event) => updateSubjectRow(index, { subjectCode: event.target.value })}
                          className="rounded-lg border border-blue-200 px-3 py-2"
                        />
                        </div>
                        <button
                          type="button"
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => removeSubjectRow(index)}
                          disabled={form.subjects.length <= 1}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mt-3 rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-800 hover:bg-blue-50"
                    onClick={addSubjectRow}
                  >
                    Add Subject
                  </button>
                </section>

                <section className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Location & Attendance</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Building</label>
                    <input
                      value={form.building}
                      onChange={(event) => setForm((prev) => ({ ...prev, building: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Room Number</label>
                    <input
                      value={form.roomNumber}
                      onChange={(event) => setForm((prev) => ({ ...prev, roomNumber: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Floor</label>
                    <input
                      value={form.floor}
                      onChange={(event) => setForm((prev) => ({ ...prev, floor: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Attendance Mode</label>
                    <select
                      value={form.attendanceMode}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, attendanceMode: event.target.value as "daily" | "period" }))
                      }
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    >
                      <option value="daily">Attendance: Daily</option>
                      <option value="period">Attendance: Per Period</option>
                    </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Attendance Teacher</label>
                    <select
                      value={form.attendanceTeacherId}
                      onChange={(event) => setForm((prev) => ({ ...prev, attendanceTeacherId: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    >
                      <option value="">Attendance Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                    </div>
                    <label className="flex items-center gap-2 rounded-lg border border-blue-100 px-3 py-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.trackLateArrivals}
                        onChange={(event) => setForm((prev) => ({ ...prev, trackLateArrivals: event.target.checked }))}
                      />
                      Track late arrivals
                    </label>
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Academic Settings</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Grading System</label>
                    <input
                      value={form.gradingSystem}
                      onChange={(event) => setForm((prev) => ({ ...prev, gradingSystem: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Assessment Types</label>
                    <input
                      value={form.assessmentTypes}
                      onChange={(event) => setForm((prev) => ({ ...prev, assessmentTypes: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Pass Mark</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.passingScore}
                      onChange={(event) => setForm((prev) => ({ ...prev, passingScore: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                    />
                    </div>
                    <div className="md:col-span-3">
                      <label className="mb-1 block text-sm font-medium text-slate-700">Class Notes</label>
                    <textarea
                      value={form.notes}
                      onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                      className="w-full rounded-lg border border-blue-200 px-3 py-2"
                      rows={3}
                    />
                    </div>
                  </div>
                </section>
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
                    {isSaving ? "Saving..." : "Save Class"}
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
