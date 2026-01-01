
exports.up = function (knex) {
    return knex.schema.table('specialty_absences', table => {
        table.date('report_until_date').nullable();
    });
};

exports.down = function (knex) {
    return knex.schema.table('specialty_absences', table => {
        table.dropColumn('report_until_date');
    });
};
