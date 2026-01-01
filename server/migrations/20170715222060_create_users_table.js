/**
 * Create users table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.up = function (knex) {
    return knex.schema.hasTable('users').then(exists => {
        if (!exists) {
            return knex.schema.createTable('users', table => {
                table.increments('id').primary().unsigned();
                table.string('name').notNullable();
                table.string('email').notNullable();
                table.string('password').notNullable();
                table.bool('active').default(false);
                table.timestamp('created_at').defaultTo(knex.fn.now());
                table.timestamp('updated_at').defaultTo(knex.fn.now());
            });
        }
    });
};

/**
 * Drop users table.
 *
 * @param   {object} knex
 * @returns {Promise}
 */
exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
