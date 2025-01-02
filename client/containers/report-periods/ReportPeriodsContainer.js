import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const reportTypes = [
  { id: '1', name: 'תפילה' },
  { id: '2', name: 'הרצאות' },
];

const getColumns = ({ studentTypes }) => [
  {
    field: 'student_type_id',
    title: 'סוג התלמידה',
    ...getPropsForAutoComplete('student_type_id', studentTypes, 'key'),
  },
  {
    field: 'report_type',
    title: 'סוג התקופה',
    ...getPropsForAutoComplete('report_type', reportTypes),
  },
  { field: 'period_name', title: 'שם התקופה' },
  { field: 'start_date', title: 'תאריך התחלה', type: 'date' },
  { field: 'end_date', title: 'תאריך סיום', type: 'date' },
  { field: 'start_report_date', title: 'תאריך התחלת הדיווח', type: 'date' },
  { field: 'end_report_date', title: 'תאריך סיום הדיווח', type: 'date' },
];
const getFilters = ({ studentTypes }) => [];

const ReportPeriodsContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    GET: { 'get-edit-data': editData },
  } = useSelector((state) => state[entity]);

  const columns = useMemo(() => editData && getColumns(editData), [editData]);
  const filters = useMemo(() => editData && getFilters(editData), [editData]);

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', 'get-edit-data'));
  }, []);

  const manipulateDataToSave = (dataToSave) => ({
    ...dataToSave,
    start_date: dataToSave.start_date ? moment(dataToSave.start_date).format('yyyy-MM-DD') : null,
    end_date: dataToSave.end_date ? moment(dataToSave.end_date).format('yyyy-MM-DD') : null,
    start_report_date: dataToSave.start_report_date
      ? moment(dataToSave.start_report_date).format('yyyy-MM-DD')
      : null,
    end_report_date: dataToSave.end_report_date
      ? moment(dataToSave.end_report_date).format('yyyy-MM-DD')
      : null,
  });

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

export default ReportPeriodsContainer;
