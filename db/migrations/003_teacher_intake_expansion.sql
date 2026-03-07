ALTER TABLE teachers ADD COLUMN first_name TEXT;
ALTER TABLE teachers ADD COLUMN middle_name TEXT;
ALTER TABLE teachers ADD COLUMN last_name TEXT;
ALTER TABLE teachers ADD COLUMN date_of_birth TEXT;
ALTER TABLE teachers ADD COLUMN gender TEXT;
ALTER TABLE teachers ADD COLUMN nationality TEXT;
ALTER TABLE teachers ADD COLUMN national_id_number TEXT;
ALTER TABLE teachers ADD COLUMN marital_status TEXT;
ALTER TABLE teachers ADD COLUMN phone_number TEXT;
ALTER TABLE teachers ADD COLUMN email TEXT;
ALTER TABLE teachers ADD COLUMN address_line TEXT;
ALTER TABLE teachers ADD COLUMN city TEXT;
ALTER TABLE teachers ADD COLUMN postal_code TEXT;
ALTER TABLE teachers ADD COLUMN employment_date TEXT;
ALTER TABLE teachers ADD COLUMN employment_type TEXT;
ALTER TABLE teachers ADD COLUMN job_title TEXT;
ALTER TABLE teachers ADD COLUMN department TEXT;
ALTER TABLE teachers ADD COLUMN status TEXT;
ALTER TABLE teachers ADD COLUMN grade_levels_taught TEXT;
ALTER TABLE teachers ADD COLUMN academic_department TEXT;
ALTER TABLE teachers ADD COLUMN homeroom_teacher INTEGER NOT NULL DEFAULT 0;
ALTER TABLE teachers ADD COLUMN highest_qualification TEXT;
ALTER TABLE teachers ADD COLUMN degrees TEXT;
ALTER TABLE teachers ADD COLUMN teaching_certification TEXT;
ALTER TABLE teachers ADD COLUMN professional_license_number TEXT;
ALTER TABLE teachers ADD COLUMN specializations TEXT;
ALTER TABLE teachers ADD COLUMN years_experience INTEGER;
ALTER TABLE teachers ADD COLUMN previous_schools TEXT;
ALTER TABLE teachers ADD COLUMN weekly_teaching_hours INTEGER;
ALTER TABLE teachers ADD COLUMN timetable_assignments TEXT;
ALTER TABLE teachers ADD COLUMN subject_load TEXT;
ALTER TABLE teachers ADD COLUMN salary REAL;
ALTER TABLE teachers ADD COLUMN payment_method TEXT;
ALTER TABLE teachers ADD COLUMN bank_name TEXT;
ALTER TABLE teachers ADD COLUMN bank_account_number TEXT;
ALTER TABLE teachers ADD COLUMN tax_number TEXT;
ALTER TABLE teachers ADD COLUMN emergency_contact_name TEXT;
ALTER TABLE teachers ADD COLUMN emergency_contact_relationship TEXT;
ALTER TABLE teachers ADD COLUMN emergency_contact_phone TEXT;
ALTER TABLE teachers ADD COLUMN emergency_contact_alt_phone TEXT;
ALTER TABLE teachers ADD COLUMN account_status TEXT NOT NULL DEFAULT 'active';

CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS teacher_subjects (
  teacher_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  PRIMARY KEY (teacher_id, subject_id),
  FOREIGN KEY(teacher_id) REFERENCES teachers(id),
  FOREIGN KEY(subject_id) REFERENCES subjects(id)
);

CREATE TABLE IF NOT EXISTS teacher_classes (
  teacher_id INTEGER NOT NULL,
  class_id INTEGER NOT NULL,
  PRIMARY KEY (teacher_id, class_id),
  FOREIGN KEY(teacher_id) REFERENCES teachers(id),
  FOREIGN KEY(class_id) REFERENCES classes(id)
);

CREATE TABLE IF NOT EXISTS teacher_qualifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL,
  qualification_type TEXT NOT NULL,
  qualification_name TEXT NOT NULL,
  institution TEXT,
  year_awarded TEXT,
  license_number TEXT,
  notes TEXT,
  FOREIGN KEY(teacher_id) REFERENCES teachers(id)
);

CREATE TABLE IF NOT EXISTS teacher_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(teacher_id) REFERENCES teachers(id)
);

INSERT OR IGNORE INTO subjects (name)
VALUES
  ('Mathematics'),
  ('English'),
  ('Biology'),
  ('Physics'),
  ('Chemistry'),
  ('History'),
  ('Geography'),
  ('Computer Science');

INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id)
SELECT teacher_id, id
FROM classes
WHERE teacher_id IS NOT NULL;
