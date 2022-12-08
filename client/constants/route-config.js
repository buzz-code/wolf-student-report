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
import SeminarKitaReport from '../containers/att-reports/SeminarKitaReportsContainer';
import TrainingReport from '../containers/att-reports/TrainingReportsContainer';
import ManhaReports from '../containers/att-reports/ManhaReportsContainer';
import ResponsibleReports from '../containers/att-reports/ResponsibleReportsContainer';
import PdsReports from '../containers/att-reports/PdsReportsContainer';
import SpecialEducationReports from '../containers/att-reports/SpecialEducationReportsContainer';
import KindergartenReports from '../containers/att-reports/KindergartenReportsContainer';
import ExcelImport from '../containers/excel-import/ExcelImportContainer';
import WorkingDates from '../containers/working-dates/WorkingDatesContainer';

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
