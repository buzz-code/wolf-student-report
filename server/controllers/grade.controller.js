import { Student } from '../models';
import { getListFromTable } from '../../common-modules/server/utils/common';

/**
 * Get edit data
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function getEditData(req, res) {
    const [students] = await Promise.all([
        getListFromTable(Student, req.currentUser.id, 'tz'),
    ]);
    res.json({
        error: null,
        data: { students }
    });
}
