import { StudentType, Student } from '../models';
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
    const dbQuery = new Student().where({ 'students.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('student_types', { 'student_types.key': 'students.student_type_id', 'student_types.user_id': 'students.user_id' })
            qb.select('students.*')
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
    const [studentTypes] = await Promise.all([
        getListFromTable(StudentType, req.currentUser.id, 'key'),
    ]);
    res.json({
        error: null,
        data: { studentTypes }
    });
}
