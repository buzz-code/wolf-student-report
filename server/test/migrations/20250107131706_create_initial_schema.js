exports.up = async function (knex) {
  console.log('Creating initial schema');

  await knex.raw('PRAGMA foreign_keys = ON;');

  // Create 'users' table with STRICT mode
  await knex.raw(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone_number TEXT,
      role TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    ) STRICT;
  `);

  // Create 'student_types' table with STRICT mode
  await knex.raw(`
    CREATE TABLE student_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      key TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    ) STRICT;
  `);

  // Create 'students' table with STRICT mode
  await knex.raw(`
    CREATE TABLE students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      phone TEXT NOT NULL,
      name TEXT NOT NULL,
      student_type_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (student_type_id) REFERENCES student_types(id)
    ) STRICT;
  `);

  // Create 'att_reports' table with STRICT mode
  await knex.raw(`
    CREATE TABLE att_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      student_id INTEGER,
      report_date TEXT,
      enterHour TEXT,
      exitHour TEXT,
      kindergartenType INTEGER,
      kindergartenActivity INTEGER,
      kindergartenActivity1 INTEGER,
      kindergartenActivity2 INTEGER,
      kindergartenActivity3 INTEGER,
      kindergartenNumber INTEGER,
      kubaseTime INTEGER,
      fluteTime INTEGER,
      exercizeTime INTEGER,
      exercize1 INTEGER,
      exercize2 INTEGER,
      exercize3 INTEGER,
      exercize4 INTEGER,
      exercize5 INTEGER,
      trainingType INTEGER,
      trainingLessonType INTEGER,
      trainingReadingType INTEGER,
      wasLessonTeaching INTEGER,
      phoneDiscussing INTEGER,
      specialEdicationType INTEGER,
      snoozlenDay INTEGER,
      excellencyAtt INTEGER,
      excellencyHomework INTEGER,
      lessonLengthHavana INTEGER,
      lessonLengthKtiv INTEGER,
      haknayaLessons INTEGER,
      tikunLessons INTEGER,
      mathLessons INTEGER,
      openQuestion INTEGER,
      prayerOrLecture INTEGER,
      prayer0 INTEGER,
      prayer1 INTEGER,
      prayer2 INTEGER,
      prayer3 INTEGER,
      prayer4 INTEGER,
      prayer5 INTEGER,
      lecture1 INTEGER,
      lecture2 INTEGER,
      lecture3 INTEGER,
      excellencyExtra1 TEXT,
      excellencyExtra2 TEXT,
      report_period_id INTEGER,
      created_at TEXT DEFAULT (datetime('now')),
      update_date TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (student_id) REFERENCES students(id)
    ) STRICT;
  `);

  // Create 'texts' table with STRICT mode
  await knex.raw(`
    CREATE TABLE texts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      value TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    ) STRICT;
  `);
};

exports.down = async function (knex) {
  await knex.raw('PRAGMA foreign_keys = OFF;');

  await knex.schema
    .dropTableIfExists('att_reports')
    .dropTableIfExists('students')
    .dropTableIfExists('student_types')
    .dropTableIfExists('texts')
    .dropTableIfExists('users');

  await knex.raw('PRAGMA foreign_keys = ON;');
};
