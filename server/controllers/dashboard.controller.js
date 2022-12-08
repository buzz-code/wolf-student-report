import { Student, AttReport } from '../models';

import { getCountFromTable } from '../../common-modules/server/utils/query';

/**
 * Get stats
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export async function getStats(req, res) {
    const [students, reports] = await Promise.all([
        getCountFromTable(Student, req.currentUser.id),
        getCountFromTable(AttReport, req.currentUser.id),
    ]);
    res.json({
        error: null,
        data: { students, reports }
    });
}
