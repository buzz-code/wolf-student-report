import DashboardIcon from '@material-ui/icons/Dashboard';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PeopleIcon from '@material-ui/icons/People';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import ListIcon from '@material-ui/icons/List';
import GroupIcon from '@material-ui/icons/Group';
import ChatIcon from '@material-ui/icons/Chat';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AssignmentIcon from '@material-ui/icons/Assignment';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import FormatListNumberedRtlIcon from '@material-ui/icons/FormatListNumberedRtl';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import EventNoteIcon from '@material-ui/icons/EventNote';
import MenuIcon from '@material-ui/icons/Menu';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PrintIcon from '@material-ui/icons/Print';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import StorageIcon from '@material-ui/icons/Storage';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import * as entities from './entity';
import * as titles from './entity-title';

import Dashboard from '../containers/dashboard/DashboardContainer';
import Teachers from '../containers/teachers/TeachersContainer';
import Students from '../containers/students/StudentsContainer';
import AttTypes from '../containers/att-types/AttTypesContainer';
import StudentTypes from '../containers/student-types/StudentTypesContainer';
import Prices from '../containers/prices/PricesContainer';
import Texts from '../containers/texts/TextsContainer';
import Questions from '../containers/questions/QuestionsContainer';
import Answers from '../containers/answers/AnswersContainer';
import AttReports from '../containers/att-reports/AttReportsContainer';
import SeminarKitaReport from '../containers/unused/SeminarKitaReportsContainer';
import TrainingReport from '../containers/unused/TrainingReportsContainer';
import ManhaReports from '../containers/unused/ManhaReportsContainer';
import ResponsibleReports from '../containers/unused/ResponsibleReportsContainer';
import PdsReports from '../containers/unused/PdsReportsContainer';
import SpecialEducationReports from '../containers/unused/SpecialEducationReportsContainer';
import KindergartenReports from '../containers/unused/KindergartenReportsContainer';
import ExcelImport from '../containers/excel-import/ExcelImportContainer';
import WorkingDates from '../containers/working-dates/WorkingDatesContainer';
import ReportPeriodsContainer from '../containers/report-periods/ReportPeriodsContainer';
import AttReports1Container from '../containers/att-reports/AttReports1Container';
import AttReports2Container from '../containers/att-reports/AttReports2Container';
import AttReports3Container from '../containers/att-reports/AttReports3Container';
import AttReports4Container from '../containers/att-reports/AttReports4Container';
import AttReports5Container from '../containers/att-reports/AttReports5Container';
import AttReports6Container from '../containers/att-reports/AttReports6Container';
import AttReports7Container from '../containers/att-reports/AttReports7Container';
import AttReports8Container from '../containers/att-reports/AttReports8Container';
import AttReports9Container from '../containers/att-reports/AttReports9Container';
import AttReports10Container from '../containers/att-reports/AttReports10Container';
import AttReports11Container from '../containers/att-reports/AttReports11Container';
import AttReports12Container from '../containers/att-reports/AttReports12Container';
import AttReports13Container from '../containers/att-reports/AttReports13Container';
import AttReports14Container from '../containers/att-reports/AttReports14Container';
import AttReportsPivotContainer from '../containers/att-reports/AttReportsPivotContainer';
import ExcellencyDatesContainer from '../containers/excellency-dates/ExcellencyDatesContainer';
import ExcellencyTotalReportContainer from '../containers/excellency-total-report/ExcellencyTotalReportContainer';

export default [
  [
    {
      path: '/dashboard',
      component: Dashboard,
      icon: DashboardIcon,
      title: titles.DASHBOARD,
      props: { entity: entities.DASHBOARD, title: titles.DASHBOARD },
    },
    {
      icon: MenuIcon,
      title: 'טבלאות',
      subItems: [
        // {
        //   path: '/teachers',
        //   component: Teachers,
        //   icon: SupervisedUserCircleIcon,
        //   title: titles.TEACHERS,
        //   props: { entity: entities.TEACHERS, title: titles.TEACHERS },
        // },
        {
          path: '/students',
          component: Students,
          icon: PeopleIcon,
          title: titles.STUDENTS,
          props: { entity: entities.STUDENTS, title: titles.STUDENTS },
        },
        // {
        //   path: '/att-types',
        //   component: AttTypes,
        //   icon: MenuIcon,
        //   title: titles.ATT_TYPES,
        //   props: { entity: entities.ATT_TYPES, title: titles.ATT_TYPES },
        // },
        {
          path: '/student-types',
          component: StudentTypes,
          icon: MenuIcon,
          title: titles.STUDENT_TYPES,
          props: { entity: entities.STUDENT_TYPES, title: titles.STUDENT_TYPES },
        },
        // {
        //   path: '/prices',
        //   component: Prices,
        //   icon: MenuIcon,
        //   title: titles.PRICES,
        //   props: { entity: entities.PRICES, title: titles.PRICES },
        // },
        {
          path: '/texts',
          component: Texts,
          icon: ChatIcon,
          title: titles.TEXTS,
          props: { entity: entities.TEXTS, title: titles.TEXTS },
        },
        {
          path: '/excellency-dates',
          component: ExcellencyDatesContainer,
          icon: CalendarTodayIcon,
          title: titles.EXCELLENCY_DATE,
          props: { entity: entities.EXCELLENCY_DATE, title: titles.EXCELLENCY_DATE },
        },
        {
          path: '/report-periods',
          component: ReportPeriodsContainer,
          icon: CalendarTodayIcon,
          title: titles.REPORT_PERIODS,
          props: { entity: entities.REPORT_PERIODS, title: titles.REPORT_PERIODS },
        },
        // {
        //   path: '/questions',
        //   component: Questions,
        //   icon: QuestionAnswerIcon,
        //   title: titles.QUESTIONS,
        //   props: { entity: entities.QUESTIONS, title: titles.QUESTIONS },
        // },
        // {
        //   path: '/working-dates',
        //   component: WorkingDates,
        //   icon: CalendarTodayIcon,
        //   title: titles.WORKING_DATES,
        //   props: { entity: entities.WORKING_DATES, title: titles.WORKING_DATES },
        // },
      ],
    },
  ],
  [{ path: '/excel-import', component: ExcelImport, icon: FileCopyIcon, title: 'העלאת קבצים' }],
  [
    {
      icon: StorageIcon,
      title: 'דוחות',
      subItems: [
        {
          path: '/att-reports',
          component: AttReports,
          icon: StorageIcon,
          title: titles.ATT_REPORTS,
          props: { entity: entities.ATT_REPORTS, title: titles.ATT_REPORTS },
        },
        {
          path: '/att-reports-1',
          component: AttReports1Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_1,
          props: { entity: entities.ATT_REPORTS_1, title: titles.ATT_REPORTS_1 },
        },
        {
          path: '/att-reports-2',
          component: AttReports2Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_2,
          props: { entity: entities.ATT_REPORTS_2, title: titles.ATT_REPORTS_2 },
        },
        {
          path: '/att-reports-3',
          component: AttReports3Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_3,
          props: { entity: entities.ATT_REPORTS_3, title: titles.ATT_REPORTS_3 },
        },
        {
          path: '/att-reports-4',
          component: AttReports4Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_4,
          props: { entity: entities.ATT_REPORTS_4, title: titles.ATT_REPORTS_4 },
        },
        {
          path: '/att-reports-5',
          component: AttReports5Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_5,
          props: { entity: entities.ATT_REPORTS_5, title: titles.ATT_REPORTS_5 },
        },
        {
          path: '/att-reports-6',
          component: AttReports6Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_6,
          props: { entity: entities.ATT_REPORTS_6, title: titles.ATT_REPORTS_6 },
        },
        {
          path: '/att-reports-7',
          component: AttReports7Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_7,
          props: { entity: entities.ATT_REPORTS_7, title: titles.ATT_REPORTS_7 },
        },
        {
          path: '/att-reports-8',
          component: AttReports8Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_8,
          props: { entity: entities.ATT_REPORTS_8, title: titles.ATT_REPORTS_8 },
        },
        {
          path: '/att-reports-9',
          component: AttReports9Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_9,
          props: { entity: entities.ATT_REPORTS_9, title: titles.ATT_REPORTS_9 },
        },
        {
          path: '/att-reports-12',
          component: AttReports12Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_12,
          props: { entity: entities.ATT_REPORTS_12, title: titles.ATT_REPORTS_12 },
        },
        {
          path: '/att-reports-10',
          component: AttReports10Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_10,
          props: { entity: entities.ATT_REPORTS_10, title: titles.ATT_REPORTS_10 },
        },
        {
          path: '/att-reports-11',
          component: AttReports11Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_11,
          props: { entity: entities.ATT_REPORTS_11, title: titles.ATT_REPORTS_11 },
        },
        {
          path: '/att-reports-13',
          component: AttReports13Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_13,
          props: { entity: entities.ATT_REPORTS_13, title: titles.ATT_REPORTS_13 },
        },
        {
          path: '/att-reports-14',
          component: AttReports14Container,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_14,
          props: { entity: entities.ATT_REPORTS_14, title: titles.ATT_REPORTS_14 },
        },
        {
          path: '/att-reports-pivot',
          component: AttReportsPivotContainer,
          icon: StorageIcon,
          title: titles.ATT_REPORTS_PIVOT,
          props: { entity: entities.ATT_REPORTS_PIVOT, title: titles.ATT_REPORTS_PIVOT },
        },
        {
          path: '/excellency-total-report',
          component: ExcellencyTotalReportContainer,
          icon: FormatListNumberedRtlIcon,
          title: titles.EXCELLENCY_TOTAL_REPORT,
          props: { entity: entities.EXCELLENCY_TOTAL_REPORT, title: titles.EXCELLENCY_TOTAL_REPORT },
        },
        // {
        //   path: '/seminar-kita-reports',
        //   component: SeminarKitaReport,
        //   icon: StorageIcon,
        //   title: titles.SEMINAR_KITA_REPORTS,
        //   props: { entity: entities.SEMINAR_KITA_REPORTS, title: titles.SEMINAR_KITA_REPORTS },
        // },
        // {
        //   path: '/training-reports',
        //   component: TrainingReport,
        //   icon: StorageIcon,
        //   title: titles.TRAINING_REPORTS,
        //   props: { entity: entities.TRAINING_REPORTS, title: titles.TRAINING_REPORTS },
        // },
        // {
        //   path: '/manha-reports',
        //   component: ManhaReports,
        //   icon: StorageIcon,
        //   title: titles.MANHA_REPORTS,
        //   props: { entity: entities.MANHA_REPORTS, title: titles.MANHA_REPORTS },
        // },
        // {
        //   path: '/responsible-reports',
        //   component: ResponsibleReports,
        //   icon: StorageIcon,
        //   title: titles.RESPONSIBLE_REPORTS,
        //   props: { entity: entities.RESPONSIBLE_REPORTS, title: titles.RESPONSIBLE_REPORTS },
        // },
        // {
        //   path: '/pds-reports',
        //   component: PdsReports,
        //   icon: StorageIcon,
        //   title: titles.PDS_REPORTS,
        //   props: { entity: entities.PDS_REPORTS, title: titles.PDS_REPORTS },
        // },
        // {
        //   path: '/special-education-reports',
        //   component: SpecialEducationReports,
        //   icon: StorageIcon,
        //   title: titles.SPECIAL_EDUCATION_REPORTS,
        //   props: {
        //     entity: entities.SPECIAL_EDUCATION_REPORTS,
        //     title: titles.SPECIAL_EDUCATION_REPORTS,
        //   },
        // },
        // {
        //   path: '/kindergarten-reports',
        //   component: KindergartenReports,
        //   icon: StorageIcon,
        //   title: titles.KINDERGARTEN_REPORTS,
        //   props: { entity: entities.KINDERGARTEN_REPORTS, title: titles.KINDERGARTEN_REPORTS },
        // },
        // {
        //   path: '/answers',
        //   component: Answers,
        //   icon: QuestionAnswerIcon,
        //   title: titles.ANSWERS,
        //   props: { entity: entities.ANSWERS, title: titles.ANSWERS },
        // },
      ],
    },
  ],
];
