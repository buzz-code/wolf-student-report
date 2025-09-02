import { Student, Specialty } from '../models';
import { getListFromTable } from '../../common-modules/server/utils/common';

/**
 * Get edit data
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function getEditData(req, res) {
    const [students, specialties] = await Promise.all([
        getListFromTable(Student, req.currentUser.id, 'tz'),
        getListFromTable(Specialty, req.currentUser.id, 'key'),
    ]);
    res.json({
        error: null,
        data: { students, specialties }
    });
}
