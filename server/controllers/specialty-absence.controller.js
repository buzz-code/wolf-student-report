import { Specialty } from '../models';
import { getListFromTable } from '../../common-modules/server/utils/common';

/**
 * Get edit data
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function getEditData(req, res) {
    const [specialties] = await Promise.all([
        getListFromTable(Specialty, req.currentUser.id, 'key', 'name'),
    ]);
    res.json({
        error: null,
        data: { specialties }
    });
}
