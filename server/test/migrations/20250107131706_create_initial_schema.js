exports.up = function(knex) {
  return knex.schema
    .createTable('calls', table => {
      table.string('call_id').primary();
      table.string('phone', 20);
      table.string('status', 20);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('flow_states', table => {
      table.increments('id').primary();
      table.string('call_id').references('call_id').inTable('calls').onDelete('CASCADE');
      table.string('current_node_id');
      table.json('variables');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('responses', table => {
      table.increments('id').primary();
      table.string('call_id').references('call_id').inTable('calls').onDelete('CASCADE');
      table.string('node_id');
      table.string('response');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('responses')
    .dropTableIfExists('flow_states')
    .dropTableIfExists('calls');
};