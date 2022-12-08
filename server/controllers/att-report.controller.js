import { AttReport, Student, StudentType } from '../models';
import { applyFilters, fetchPage } from '../../common-modules/server/controllers/generic.controller';
import { getListFromTable } from '../../common-modules/server/utils/common';

/**
 * Find all the items
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function findAll(req, res) {
    const dbQuery = new AttReport().where({ 'att_reports.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('students', 'students.id', 'att_reports.student_id')
            qb.leftJoin('student_types', { 'student_types.key': 'students.student_type_id', 'student_types.user_id': 'students.user_id' })
            qb.select('att_reports.*')
            qb.select({ student_tz: 'students.tz', student_type_name: 'student_types.name' })
        });
    applyFilters(dbQuery, req.query.filters);
    fetchPage({ dbQuery }, req.query, res);
}

/**
 * Get edit data
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function getEditData(req, res) {
    const [students, studentTypes] = await Promise.all([
        getListFromTable(Student, req.currentUser.id),
        getListFromTable(StudentType, req.currentUser.id, 'key'),
    ]);
    res.json({
        error: null,
        data: { students, studentTypes }
    });
}
