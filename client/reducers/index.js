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
  TEACHER_TYPES,
  PRICES,
  TEXTS,
  ATT_REPORTS,
  SEMINAR_KITA_REPORTS,
  TRAINING_REPORTS,
  MANHA_REPORTS,
  RESPONSIBLE_REPORTS,
  PDS_REPORTS,
  DASHBOARD,
  QUESTIONS,
} from '../constants/entity';

const appReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    form: formReducer, // ← redux-form
    auth: authReducer,
    [TEACHERS]: crudReducer(TEACHERS),
    [STUDENTS]: crudReducer(STUDENTS),
    [ATT_TYPES]: crudReducer(ATT_TYPES),
    [TEACHER_TYPES]: crudReducer(TEACHER_TYPES),
    [PRICES]: crudReducer(PRICES),
    [TEXTS]: crudReducer(TEXTS),
    [ATT_REPORTS]: crudReducer(ATT_REPORTS),
    [SEMINAR_KITA_REPORTS]: crudReducer(SEMINAR_KITA_REPORTS),
    [TRAINING_REPORTS]: crudReducer(TRAINING_REPORTS),
    [MANHA_REPORTS]: crudReducer(MANHA_REPORTS),
    [RESPONSIBLE_REPORTS]: crudReducer(RESPONSIBLE_REPORTS),
    [PDS_REPORTS]: crudReducer(PDS_REPORTS),
    [DASHBOARD]: crudReducer(DASHBOARD),
    [QUESTIONS]: crudReducer(QUESTIONS),
  });

const rootReducer = (state, action) => {
  if (action === 'LOG_OUT_SUCCESS') {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
