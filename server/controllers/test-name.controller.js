import { StudentType, TestName } from '../models';
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
    const dbQuery = new TestName().where({ 'test_names.user_id': req.currentUser.id })
        .query(qb => {
            qb.leftJoin('student_types', 'student_types.key', 'test_names.student_type_id')
            qb.select('test_names.*')
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
