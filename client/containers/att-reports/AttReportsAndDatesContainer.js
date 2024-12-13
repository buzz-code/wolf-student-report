import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getJewishDate, formatJewishDateHebrew } from 'jewish-dates-core';

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
  { field: 'excellency_date', title: 'תאריך לתיקוף', type: 'date' },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  {
    field: 'report_date',
    title: 'תאריך עברי',
    render: ({ report_date }) =>
      report_date && formatJewishDateHebrew(getJewishDate(new Date(report_date))),
    isHebrewDate: true,
  },
  { field: 'excellencyAtt', title: 'מצוינות - נוכחות' },
  { field: 'excellencyHomework', title: 'מצוינות - ש"ב' },
  { field: 'excellencyExtra1', title: 'מרצה 1' },
  { field: 'excellencyExtra2', title: 'מרצה 2' },
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
    defaultValue: 8,
  },
  { field: 'report_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'report_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
];

const AttReportsAndDatesContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    GET: { 'get-edit-data': editData },
  } = useSelector((state) => state[entity]);

  const columns = useMemo(() => getColumns(editData || {}), [editData]);
  const filters = useMemo(() => getFilters(editData || {}), [editData]);

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', 'get-edit-data'));
  }, []);

  return (
    <Table
      entity={entity}
      title={title}
      columns={columns}
      filters={filters}
      disableAdd={true}
      disableEdit={true}
      disableDelete={true}
    />
  );
};

export default AttReportsAndDatesContainer;
