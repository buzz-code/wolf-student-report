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

  return knex.transaction(trx => {
    let query = trx.raw('SET FOREIGN_KEY_CHECKS = 0');
    
    tables.forEach(table => {
      query = query.then(() => trx.raw(`ALTER TABLE ${table} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`));
    });

    return query.then(() => trx.raw('SET FOREIGN_KEY_CHECKS = 1'));
  });
};

exports.down = function(knex) {
  return Promise.resolve();
};
