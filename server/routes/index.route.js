import express from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import yemotRoutes from './yemot.route';
import teacherRoutes from './teacher.route';
import studentRoutes from './student.route';
import attTypeRoutes from './att-type.route';
import studentTypeRoutes from './student-type.route';
import priceRoutes from './price.route';
import textRoutes from './text.route';
import attReportRoutes from './att-report.route';
import dashboardRoutes from './dashboard.route';
import questionRoutes from './question.route';
import answerRoutes from './answer.route';
import workingDateRoutes from './working-date.route';
import excellencyDateRoutes from './excellency-date.route';

const router = express.Router();

router.use('/auth', require('./auth.route').default);
router.use('/users', require('./user.route').default);
router.use('/yemot', require('./yemot.route').default);
router.use('/teachers', require('./teacher.route').default);
router.use('/students', require('./student.route').default);
router.use('/att-types', require('./att-type.route').default);
router.use('/student-types', require('./student-type.route').default);
router.use('/test-names', require('./test-name.route').default);
router.use('/prices', require('./price.route').default);
router.use('/texts', require('./text.route').default);
router.use('/att-reports', require('./att-report.route').default);
router.use('/dashboard', require('./dashboard.route').default);
router.use('/questions', require('./question.route').default);
router.use('/answers', require('./answer.route').default);
router.use('/working-dates', require('./working-date.route').default);
router.use('/excellency-dates', require('./excellency-date.route').default);
router.use('/report-periods', require('./report-period.route').default);

export default router;