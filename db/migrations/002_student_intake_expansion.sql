ALTER TABLE students ADD COLUMN first_name TEXT;
ALTER TABLE students ADD COLUMN middle_name TEXT;
ALTER TABLE students ADD COLUMN last_name TEXT;
ALTER TABLE students ADD COLUMN preferred_name TEXT;
ALTER TABLE students ADD COLUMN date_of_birth TEXT;
ALTER TABLE students ADD COLUMN gender TEXT;
ALTER TABLE students ADD COLUMN nationality TEXT;
ALTER TABLE students ADD COLUMN admission_date TEXT;
ALTER TABLE students ADD COLUMN section_stream TEXT;
ALTER TABLE students ADD COLUMN previous_school TEXT;
ALTER TABLE students ADD COLUMN transfer_status TEXT;
ALTER TABLE students ADD COLUMN academic_year TEXT;
ALTER TABLE students ADD COLUMN boarding_status TEXT;
ALTER TABLE students ADD COLUMN transport_method TEXT;
ALTER TABLE students ADD COLUMN bus_route TEXT;
ALTER TABLE students ADD COLUMN house_assignment TEXT;
ALTER TABLE students ADD COLUMN religion TEXT;
ALTER TABLE students ADD COLUMN home_language TEXT;
ALTER TABLE students ADD COLUMN extracurricular_interests TEXT;
ALTER TABLE students ADD COLUMN account_status TEXT NOT NULL DEFAULT 'active';

CREATE TABLE IF NOT EXISTS guardians (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  occupation TEXT,
  address TEXT
);

CREATE TABLE IF NOT EXISTS student_guardians (
  student_id INTEGER NOT NULL,
  guardian_id INTEGER NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0,
  is_emergency_contact INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (student_id, guardian_id),
  FOREIGN KEY(student_id) REFERENCES students(id),
  FOREIGN KEY(guardian_id) REFERENCES guardians(id)
);

CREATE TABLE IF NOT EXISTS medical_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL UNIQUE,
  known_conditions TEXT,
  allergies TEXT,
  medications TEXT,
  blood_type TEXT,
  special_needs TEXT,
  medical_notes TEXT,
  FOREIGN KEY(student_id) REFERENCES students(id)
);
