CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  teacher_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  due_date TEXT NOT NULL,
  max_score REAL NOT NULL DEFAULT 100,
  allow_resubmission INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('draft', 'published', 'closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(class_id) REFERENCES classes(id),
  FOREIGN KEY(subject_id) REFERENCES subjects(id),
  FOREIGN KEY(teacher_id) REFERENCES teachers(id)
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assignment_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  submission_text TEXT,
  attachment_url TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted', 'resubmitted', 'graded', 'late')),
  score REAL,
  feedback TEXT,
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (assignment_id, student_id),
  FOREIGN KEY(assignment_id) REFERENCES assignments(id),
  FOREIGN KEY(student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  assessment_type TEXT NOT NULL CHECK(assessment_type IN ('quiz', 'test', 'exam', 'project', 'practical')),
  term_id INTEGER,
  max_score REAL NOT NULL DEFAULT 100,
  assessment_date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(class_id) REFERENCES classes(id),
  FOREIGN KEY(subject_id) REFERENCES subjects(id),
  FOREIGN KEY(term_id) REFERENCES terms(id)
);

CREATE TABLE IF NOT EXISTS assessment_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assessment_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  score REAL NOT NULL,
  grade_letter TEXT,
  remarks TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (assessment_id, student_id),
  FOREIGN KEY(assessment_id) REFERENCES assessments(id),
  FOREIGN KEY(student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  target_role TEXT NOT NULL DEFAULT 'student' CHECK(target_role IN ('student', 'teacher', 'parent', 'admin', 'all')),
  class_id INTEGER,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
  published_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT,
  FOREIGN KEY(class_id) REFERENCES classes(id)
);

CREATE TABLE IF NOT EXISTS subject_resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  subject_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK(resource_type IN ('notes', 'video', 'worksheet', 'link')),
  resource_url TEXT,
  description TEXT,
  posted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(class_id) REFERENCES classes(id),
  FOREIGN KEY(subject_id) REFERENCES subjects(id)
);

CREATE INDEX IF NOT EXISTS idx_assignments_class_due_date ON assignments(class_id, due_date);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student_id ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_assessment_scores_student_id ON assessment_scores(student_id);
CREATE INDEX IF NOT EXISTS idx_announcements_target_role ON announcements(target_role, published_at);
CREATE INDEX IF NOT EXISTS idx_subject_resources_class_subject ON subject_resources(class_id, subject_id);
