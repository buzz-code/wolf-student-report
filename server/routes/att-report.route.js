import { exportPdf } from '../../common-modules/server/utils/template';
import { genericRouteWithController } from '../../common-modules/server/controllers/loader';

const router = genericRouteWithController('att-report', 'AttReport', (router, ctrl) => {
    router.route('/get-edit-data')
        .get((req, res) => {
            ctrl.getEditData(req, res);
        });

    router.route('/get-pivot-data')
        .get(async (req, res) => {
            await ctrl.getPivotData(req, res);
        });

    router.route('/getSeminarKitaReport')
        .get((req, res) => {
            ctrl.getSeminarKitaReport(req, res);
        });

    router.route('/getTrainingReport')
        .get((req, res) => {
            ctrl.getTrainingReport(req, res);
        });

    router.route('/getManhaReport')
        .get((req, res) => {
            ctrl.getManhaReport(req, res);
        });

    router.route('/getResponsibleReport')
        .get((req, res) => {
            ctrl.getResponsibleReport(req, res);
        });

    router.route('/getPdsReport')
        .get((req, res) => {
            ctrl.getPdsReport(req, res);
        });

    router.route('/getSpecialEducationReport')
        .get((req, res) => {
            ctrl.getSpecialEducationReport(req, res);
        });

    router.route('/getKindergartenReport')
        .get((req, res) => {
            ctrl.getKindergartenReport(req, res);
        });

    router.route('/getExcellencyTotalReport')
        .get((req, res) => {
            ctrl.getExcellencyTotalReport(req, res);
        });

    router.route('/getAttReportsAndDates')
        .get((req, res) => {
            ctrl.getAttReportsAndDates(req, res);
        });

    router.route('/:report/export-pdf')
        .post((req, res) => {
            exportPdf(req, res);
        });

    router.route('/updateSalaryMonth')
        .post((req, res) => {
            ctrl.updateSalaryMonth(req, res);
        });

    router.route('/updateSalaryComment')
        .post((req, res) => {
            ctrl.updateSalaryComment(req, res);
        });

});

export default router;