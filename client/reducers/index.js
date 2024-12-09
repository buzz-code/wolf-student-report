import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';

// Import custom components
import authReducer from '../../common-modules/client/reducers/authReducer';
import crudReducer from '../../common-modules/client/reducers/crudReducer';
import {
  TEACHERS,
  STUDENTS,
  ATT_TYPES,
  STUDENT_TYPES,
  PRICES,
  TEXTS,
  ATT_REPORTS,
  SEMINAR_KITA_REPORTS,
  // TRAINING_REPORTS,
  MANHA_REPORTS,
  // RESPONSIBLE_REPORTS,
  PDS_REPORTS,
  DASHBOARD,
  QUESTIONS,
  ANSWERS,
  WORKING_DATES,
  REPORT_PERIODS,
  KINDERGARTEN_REPORTS,
  SPECIAL_EDUCATION_REPORTS,
  ATT_REPORTS_1,
  ATT_REPORTS_2,
  ATT_REPORTS_3,
  ATT_REPORTS_4,
  ATT_REPORTS_5,
  ATT_REPORTS_6,
  ATT_REPORTS_7,
  ATT_REPORTS_8,
  ATT_REPORTS_9,
  ATT_REPORTS_10,
  ATT_REPORTS_11,
  ATT_REPORTS_12,
  ATT_REPORTS_13,
  ATT_REPORTS_14,
  EXCELLENCY_DATE,
  ATT_REPORTS_PIVOT,
  EXCELLENCY_TOTAL_REPORT,
} from '../constants/entity';

const appReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    form: formReducer, // ← redux-form
    auth: authReducer,
    [TEACHERS]: crudReducer(TEACHERS),
    [STUDENTS]: crudReducer(STUDENTS),
    [ATT_TYPES]: crudReducer(ATT_TYPES),
    [STUDENT_TYPES]: crudReducer(STUDENT_TYPES),
    [PRICES]: crudReducer(PRICES),
    [TEXTS]: crudReducer(TEXTS),
    [ATT_REPORTS]: crudReducer(ATT_REPORTS),
    [SEMINAR_KITA_REPORTS]: crudReducer(SEMINAR_KITA_REPORTS),
    // [TRAINING_REPORTS]: crudReducer(TRAINING_REPORTS),
    [MANHA_REPORTS]: crudReducer(MANHA_REPORTS),
    // [RESPONSIBLE_REPORTS]: crudReducer(RESPONSIBLE_REPORTS),
    [PDS_REPORTS]: crudReducer(PDS_REPORTS),
    [SPECIAL_EDUCATION_REPORTS]: crudReducer(SPECIAL_EDUCATION_REPORTS),
    [KINDERGARTEN_REPORTS]: crudReducer(KINDERGARTEN_REPORTS),
    [DASHBOARD]: crudReducer(DASHBOARD),
    [QUESTIONS]: crudReducer(QUESTIONS),
    [ANSWERS]: crudReducer(ANSWERS),
    [WORKING_DATES]: crudReducer(WORKING_DATES),
    [REPORT_PERIODS]: crudReducer(REPORT_PERIODS),
    [ATT_REPORTS_1]: crudReducer(ATT_REPORTS_1),
    [ATT_REPORTS_2]: crudReducer(ATT_REPORTS_2),
    [ATT_REPORTS_3]: crudReducer(ATT_REPORTS_3),
    [ATT_REPORTS_4]: crudReducer(ATT_REPORTS_4),
    [ATT_REPORTS_5]: crudReducer(ATT_REPORTS_5),
    [ATT_REPORTS_6]: crudReducer(ATT_REPORTS_6),
    [ATT_REPORTS_7]: crudReducer(ATT_REPORTS_7),
    [ATT_REPORTS_8]: crudReducer(ATT_REPORTS_8),
    [ATT_REPORTS_9]: crudReducer(ATT_REPORTS_9),
    [ATT_REPORTS_10]: crudReducer(ATT_REPORTS_10),
    [ATT_REPORTS_11]: crudReducer(ATT_REPORTS_11),
    [ATT_REPORTS_12]: crudReducer(ATT_REPORTS_12),
    [ATT_REPORTS_13]: crudReducer(ATT_REPORTS_13),
    [ATT_REPORTS_14]: crudReducer(ATT_REPORTS_14),
    [ATT_REPORTS_PIVOT]: crudReducer(ATT_REPORTS_PIVOT),
    [EXCELLENCY_DATE]: crudReducer(EXCELLENCY_DATE),
    [EXCELLENCY_TOTAL_REPORT]: crudReducer(EXCELLENCY_TOTAL_REPORT),
  });

const rootReducer = (state, action) => {
  if (action === 'LOG_OUT_SUCCESS') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
