ALTER TABLE subjects ADD COLUMN code TEXT;

ALTER TABLE classes ADD COLUMN section_stream TEXT;
ALTER TABLE classes ADD COLUMN academic_year TEXT;
ALTER TABLE classes ADD COLUMN term_label TEXT;
ALTER TABLE classes ADD COLUMN assistant_teacher_id INTEGER;
ALTER TABLE classes ADD COLUMN grade_level TEXT;
ALTER TABLE classes ADD COLUMN department TEXT;
ALTER TABLE classes ADD COLUMN max_students INTEGER NOT NULL DEFAULT 40;
ALTER TABLE classes ADD COLUMN building TEXT;
ALTER TABLE classes ADD COLUMN room_number TEXT;
ALTER TABLE classes ADD COLUMN floor TEXT;
ALTER TABLE classes ADD COLUMN attendance_mode TEXT NOT NULL DEFAULT 'daily';
ALTER TABLE classes ADD COLUMN attendance_teacher_id INTEGER;
ALTER TABLE classes ADD COLUMN track_late_arrivals INTEGER NOT NULL DEFAULT 1;
ALTER TABLE classes ADD COLUMN grading_system TEXT NOT NULL DEFAULT 'percentage';
ALTER TABLE classes ADD COLUMN assessment_types TEXT;
ALTER TABLE classes ADD COLUMN passing_score REAL NOT NULL DEFAULT 50;
ALTER TABLE classes ADD COLUMN notes TEXT;
ALTER TABLE classes ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE classes ADD COLUMN created_by_user_id INTEGER;
ALTER TABLE classes ADD COLUMN created_at TEXT;
ALTER TABLE classes ADD COLUMN updated_at TEXT;

CREATE TABLE IF NOT EXISTS class_subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  teacher_id INTEGER,
  subject_code TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (class_id, subject_id),
  FOREIGN KEY(class_id) REFERENCES classes(id),
  FOREIGN KEY(subject_id) REFERENCES subjects(id),
  FOREIGN KEY(teacher_id) REFERENCES teachers(id)
);

CREATE TABLE IF NOT EXISTS class_timetable_slots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  day_of_week TEXT NOT NULL,
  period_number INTEGER NOT NULL,
  subject_id INTEGER,
  teacher_id INTEGER,
  room_assignment TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(class_id) REFERENCES classes(id),
  FOREIGN KEY(subject_id) REFERENCES subjects(id),
  FOREIGN KEY(teacher_id) REFERENCES teachers(id)
);

CREATE INDEX IF NOT EXISTS idx_class_subjects_class_id ON class_subjects(class_id);
CREATE INDEX IF NOT EXISTS idx_class_timetable_class_id ON class_timetable_slots(class_id);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);

UPDATE classes
SET
  academic_year = COALESCE(academic_year, '2026'),
  grade_level = COALESCE(grade_level, name),
  term_label = COALESCE(term_label, (SELECT name FROM terms WHERE id = classes.term_id)),
  updated_at = CURRENT_TIMESTAMP
WHERE academic_year IS NULL OR grade_level IS NULL OR term_label IS NULL;

UPDATE classes
SET
  created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
  updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP)
WHERE created_at IS NULL OR updated_at IS NULL;

INSERT OR IGNORE INTO class_subjects (class_id, subject_id, teacher_id, subject_code)
SELECT c.id, ts.subject_id, c.teacher_id, s.code
FROM classes c
JOIN teacher_subjects ts ON ts.teacher_id = c.teacher_id
JOIN subjects s ON s.id = ts.subject_id;
