ALTER TABLE students ADD COLUMN birth_certificate_number TEXT;
ALTER TABLE students ADD COLUMN birth_certificate_file_path TEXT;
ALTER TABLE students ADD COLUMN student_photo_file_path TEXT;
ALTER TABLE students ADD COLUMN previous_school_address TEXT;
ALTER TABLE students ADD COLUMN transfer_letter_file_path TEXT;
ALTER TABLE students ADD COLUMN previous_school_reports_file_path TEXT;
ALTER TABLE students ADD COLUMN grade7_exam_centre_number TEXT;
ALTER TABLE students ADD COLUMN grade7_candidate_number TEXT;
ALTER TABLE students ADD COLUMN grade7_results TEXT;
ALTER TABLE students ADD COLUMN zimsec_index_number TEXT;
ALTER TABLE students ADD COLUMN immunisation_record TEXT;
ALTER TABLE students ADD COLUMN medical_aid_provider TEXT;
ALTER TABLE students ADD COLUMN curriculum_type TEXT NOT NULL DEFAULT 'Heritage-Based Curriculum';
ALTER TABLE students ADD COLUMN school_level TEXT NOT NULL DEFAULT 'Primary';
ALTER TABLE students ADD COLUMN form_level TEXT;
ALTER TABLE students ADD COLUMN class_stream TEXT;
ALTER TABLE students ADD COLUMN house_name TEXT;

ALTER TABLE guardians ADD COLUMN national_id_number TEXT;
ALTER TABLE guardians ADD COLUMN id_copy_file_path TEXT;
ALTER TABLE guardians ADD COLUMN proof_of_residence_file_path TEXT;

ALTER TABLE medical_records ADD COLUMN immunisation_record TEXT;
ALTER TABLE medical_records ADD COLUMN medical_aid_provider TEXT;

ALTER TABLE teachers ADD COLUMN teacher_registration_number TEXT;
ALTER TABLE teachers ADD COLUMN teaching_council_registration TEXT;
ALTER TABLE teachers ADD COLUMN teaching_certificate_number TEXT;
ALTER TABLE teachers ADD COLUMN teacher_training_college TEXT;
ALTER TABLE teachers ADD COLUMN university_qualification TEXT;
ALTER TABLE teachers ADD COLUMN primary_subject TEXT;
ALTER TABLE teachers ADD COLUMN secondary_subject TEXT;
ALTER TABLE teachers ADD COLUMN employment_category TEXT;
ALTER TABLE teachers ADD COLUMN contract_type TEXT;
ALTER TABLE teachers ADD COLUMN years_of_service INTEGER;

ALTER TABLE classes ADD COLUMN school_level TEXT NOT NULL DEFAULT 'Primary';
ALTER TABLE classes ADD COLUMN form_level TEXT;
ALTER TABLE classes ADD COLUMN stream_letter TEXT;
ALTER TABLE classes ADD COLUMN curriculum_type TEXT NOT NULL DEFAULT 'Heritage-Based Curriculum';

CREATE TABLE IF NOT EXISTS student_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS school_houses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  house_teacher_id INTEGER,
  points INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(house_teacher_id) REFERENCES teachers(id)
);

CREATE TABLE IF NOT EXISTS zimsec_exam_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  exam_level TEXT NOT NULL CHECK(exam_level IN ('Grade 7', 'O-Level', 'A-Level')),
  exam_year TEXT,
  exam_centre_number TEXT,
  candidate_number TEXT,
  index_number TEXT,
  subjects_json TEXT,
  status TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(student_id) REFERENCES students(id)
);

CREATE INDEX IF NOT EXISTS idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_zimsec_exam_entries_student_id ON zimsec_exam_entries(student_id);

INSERT OR IGNORE INTO school_houses (name) VALUES ('Mhofu'), ('Shumba'), ('Nzou'), ('Sable');

INSERT OR IGNORE INTO subjects (name, code)
VALUES
  ('Shona', 'SHN'),
  ('Ndebele', 'NDE'),
  ('Agriculture', 'AGR'),
  ('Social Studies', 'SST'),
  ('Science', 'SCI'),
  ('ICT', 'ICT'),
  ('Physical Education', 'PE'),
  ('Food & Nutrition', 'FN'),
  ('Woodwork', 'WW');
