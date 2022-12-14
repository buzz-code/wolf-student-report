import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ students, studentTypes }) => [
  {
    field: 'student_tz',
    title: 'תז תלמידה',
    editable: 'never',
  },
  {
    field: 'student_id',
    title: 'שם תלמידה',
    ...getPropsForAutoComplete('student_id', students),
    columnOrder: 'students.name',
  },
  {
    field: 'student_type_name',
    title: 'סוג תלמידה',
    columnOrder: 'student_types.name',
    editable: 'never',
  },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  // { field: 'update_date', title: 'תאריך עדכון', type: 'date' },
  { field: 'enterHour', title: 'שעת כניסה' },
  { field: 'exitHour', title: 'שעת יציאה' },
  { field: 'kindergartenActivity', title: 'פעילות בגן' },
  { field: 'kubaseTime', title: 'זמן אימון קיובייס' },
  { field: 'fluteTime', title: 'זמן אימון חלילית' },
  { field: 'exercizeType', title: 'סוג התעמלות' },
  { field: 'exercizeHeart', title: 'אימון לב ריאה' },
  { field: 'exercizeStomach', title: 'אימון שרירי בטן' },
  { field: 'exercizeBreast', title: 'אימון שרירי חזה' },
  { field: 'exercizeLegs', title: 'אימון שרירי רגלים' },
  { field: 'exercizePlank', title: 'אימון פלאנק' },
  { field: 'exercizeLaying', title: 'אימון שכיבות סמיכה' },
  { field: 'exercizeJump', title: 'אימון קפיצות' },
  { field: 'exercizeShortRun', title: 'אימון ריצה' },
  { field: 'trainingType', title: 'סוג תיקוף הוראה מתקנת' },
  { field: 'trainingLessonType', title: 'סוג שיעור עבודה מעשית' },
  { field: 'trainingReadingType', title: 'סוג שיעור קריאה' },
  { field: 'wasLessonTeaching', title: 'האם מסרת שיעור' },
];
const getFilters = ({ students, studentTypes }) => [
  { field: 'students.name', label: 'תלמידה', type: 'text', operator: 'like' },
  {
    field: 'student_types.key',
    label: 'סוג תלמידה',
    type: 'list',
    list: studentTypes,
    operator: 'eq',
    idField: 'key',
  },
  { field: 'report_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'report_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
  // { field: 'update_date', label: 'מתאריך עדכון', type: 'date', operator: 'date-before' },
  // { field: 'update_date', label: 'עד תאריך עדכון', type: 'date', operator: 'date-after' },
];

const AttReportsContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    GET: { 'get-edit-data': editData },
  } = useSelector((state) => state[entity]);

  const columns = useMemo(() => getColumns(editData || {}), [editData]);
  const filters = useMemo(() => getFilters(editData || {}), [editData]);

  const manipulateDataToSave = (dataToSave) => ({
    ...dataToSave,
    report_date: dataToSave.report_date && moment(dataToSave.report_date).format('yyyy-MM-DD'),
    update_date: dataToSave.update_date && moment(dataToSave.update_date).format('yyyy-MM-DD'),
    student_type_name: undefined,
    student_tz: undefined,
  });

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', 'get-edit-data'));
  }, []);

  return (
    <Table
      entity={entity}
      title={title}
      columns={columns}
      filters={filters}
      manipulateDataToSave={manipulateDataToSave}
    />
  );
};

export default AttReportsContainer;
