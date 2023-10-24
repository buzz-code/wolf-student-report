import { ExcellencyDate, TeacherType } from '../models';
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
    const dbQuery = new ExcellencyDate().where({ 'excellency_dates.user_id': req.currentUser.id })
        .query(qb => {
            // qb.leftJoin('teacher_types', { 'teacher_types.key': 'excellency_dates.teacher_type_id', 'teacher_types.user_id': 'excellency_dates.user_id' })
            qb.select('excellency_dates.*')
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
    const [teacherTypes] = await Promise.all([
        // getListFromTable(TeacherType, req.currentUser.id, 'key'),
    ]);
    res.json({
        error: null,
        data: { teacherTypes }
    });
}
