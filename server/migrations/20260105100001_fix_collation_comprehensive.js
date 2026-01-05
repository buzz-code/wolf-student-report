exports.up = function(knex) {
  const tables = [
    'users',
    'answers',
    'att_reports',
    'att_types',
    'prices',
    'question_types',
    'questions',
    'students',
    'teacher_salary_types',
    'student_types',
    'teachers',
    'texts',
    'working_dates',
    'excellency_dates',
    'report_periods',
    'test_names',
    'specialties',
    'student_specialties',
    'specialty_absences',
    'grades'
  ];

  return knex.transaction(async trx => {
    await trx.raw('SET FOREIGN_KEY_CHECKS = 0');
    
    for (const table of tables) {
      const exists = await trx.schema.hasTable(table);
      if (exists) {
        await trx.raw(`ALTER TABLE ${table} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      }
    }

    await trx.raw('SET FOREIGN_KEY_CHECKS = 1');
  });
};

exports.down = function(knex) {
  return Promise.resolve();
};
