INSERT OR IGNORE INTO schools (name, code, level, district, province, status)
VALUES ('SMSEdu Demonstration School', 'SMSDEMO', 'Combined', 'Demo District', 'Demo Province', 'active');

ALTER TABLE users ADD COLUMN school_id INTEGER REFERENCES schools(id);

UPDATE users
SET school_id = (SELECT id FROM schools WHERE code = 'SMSDEMO')
WHERE school_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
