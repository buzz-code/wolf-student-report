import * as workingDateCtrl from '../controllers/working-date.controller';
import genericRoute from '../../common-modules/server/routes/generic.route';

const router = genericRoute(workingDateCtrl, router => {
    router.route('/get-edit-data')
        .get((req, res) => {
            workingDateCtrl.getEditData(req, res);
        });
});

export default router;