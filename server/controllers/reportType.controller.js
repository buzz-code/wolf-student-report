import HttpStatus from 'http-status-codes';
import ReportType from '../models/reportType.model';

/**
 * Find all the report types
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findAll(req, res) {
    new ReportType({ user_id: req.currentUser.id })
        .fetchAll()
        .then(reportType => res.json({
            error: null,
            data: reportType.toJSON()
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 *  Find report type by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function findById(req, res) {
    new ReportType({ id: req.params.id, user_id: req.currentUser.id })
        .fetch()
        .then(reportType => {
            if (!reportType) {
                res.status(HttpStatus.NOT_FOUND).json({
                    error: 'לא נמצא'
                });
            }
            else {
                res.json({
                    error: null,
                    data: reportType.toJSON()
                });
            }
        })
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 * Store new report type
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function store(req, res) {
    const item = req.body;
    new ReportType({ ...item, user_id: req.currentUser.id })
        .save()
        .then(() => res.json({
            error: null,
            data: { message: 'הרשומה נוספה בהצלחה.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}

/**
 * Update report type by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function update(req, res) {
    const item = req.body;
    new ReportType({ id: req.params.id, user_id: req.currentUser.get('id') })
        .fetch({ require: true })
        .then(reportType => reportType.save({
            ...item,
        }))
        .then(() => res.json({
            error: null,
            data: { message: 'הרשומה נשמרה בהצלחה.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message.message
        }));
}

/**
 * Destroy report type by id
 *
 * @param {object} req
 * @param {object} res
 * @returns {*}
 */
export function destroy(req, res) {
    new ReportType({ id: req.params.id, user_id: req.currentUser.id })
        .fetch({ require: true })
        .then(reportType => reportType.destroy())
        .then(() => res.json({
            error: null,
            data: { message: 'הרשומה נמחקה בהצלחה.' }
        }))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: err.message
        }));
}