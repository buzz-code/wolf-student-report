exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('api_key').nullable().unique().index();
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('api_key');
  });
};
