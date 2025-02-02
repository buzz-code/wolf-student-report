import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getJewishDate, formatJewishDateHebrew } from 'jewish-dates-core';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const reportTypeList = [
  { key: '1', value: 'תפילה' },
  { key: '2', value: 'הרצאה' },
  { key: '3', value: 'מבחן' },
];

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
    field: 'student_klass_name',
    title: 'כיתה',
    columnOrder: 'students.klass',
    editable: 'never',
  },
  {
    field: 'student_type_name',
    title: 'סוג תלמידה',
    columnOrder: 'student_types.name',
    editable: 'never',
  },
  { field: 'report_date', title: 'תאריך הדיווח', type: 'date' },
  {
    field: 'report_date',
    title: 'תאריך עברי',
    render: ({ report_date }) =>
      report_date && formatJewishDateHebrew(getJewishDate(new Date(report_date))),
    isHebrewDate: true,
  },
  // { field: 'update_date', title: 'תאריך עדכון', type: 'date' },
  { field: 'prayerOrLecture', title: 'סוג דיווח' },
  // { field: 'prayer0', title: 'תפילה 0' },
  // { field: 'prayer1', title: 'תפילה 1' },
  // { field: 'prayer2', title: 'תפילה 2' },
  // { field: 'prayer3', title: 'תפילה 3' },
  // { field: 'prayer4', title: 'תפילה 4' },
  // { field: 'prayer5', title: 'תפילה 5' },
  { field: 'lecture1', title: 'הרצאה 1' },
  { field: 'lecture2', title: 'הרצאה 2' },
  { field: 'lecture3', title: 'הרצאה 3' },
  { field: 'testGeneral', title: 'מבחן כללי' },
  { field: 'test1', title: 'מבחן 1' },
  { field: 'test2', title: 'מבחן 2' },
  { field: 'testCombined', title: 'מבחן משולב' },
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
    defaultValue: 14,
    disabled: true,
  },
  {
    field: 'prayerOrLecture',
    label: 'סוג דיווח',
    type: 'list',
    list: reportTypeList,
    operator: 'eq',
    idField: 'key',
  },
  { field: 'report_date', label: 'מתאריך', type: 'date', operator: 'date-before' },
  { field: 'report_date', label: 'עד תאריך', type: 'date', operator: 'date-after' },
  // { field: 'update_date', label: 'מתאריך עדכון', type: 'date', operator: 'date-before' },
  // { field: 'update_date', label: 'עד תאריך עדכון', type: 'date', operator: 'date-after' },
];

const AttReports14Container = ({ entity, title }) => {
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
    student_klass_name: undefined,
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

export default AttReports14Container;
