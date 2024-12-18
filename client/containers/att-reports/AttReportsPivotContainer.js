import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import {
  getColumnsForPivot,
  getPropsForAutoComplete,
} from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ students, studentTypes }, data) => [
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
  ...getColumnsForPivot(data),
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
  {
    field: 'pivotGropuBy',
    label: 'קיבוץ לפי',
    type: 'list',
    list: [
      { key: 'day', name: 'יום' },
      { key: 'week', name: 'שבוע' },
    ],
    defaultValue: 'week',
    operator: 'eq',
    idField: 'key',
  },
];

const AttReportsPivotContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    data,
    GET: { '../get-edit-data': editData },
  } = useSelector((state) => state[entity]);

  const columns = useMemo(() => getColumns(editData || {}, data || []), [editData, data]);
  const filters = useMemo(() => getFilters(editData || {}), [editData]);

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', '../get-edit-data'));
  }, []);

  const getExportColumns = useCallback((data) => getColumns(editData || {}, data || []), [
    editData,
  ]);

  return (
    <Table
      entity={entity}
      title={title}
      columns={columns}
      filters={filters}
      disableAdd={true}
      disableUpdate={true}
      disableDelete={true}
      getExportColumns={getExportColumns}
    />
  );
};

export default AttReportsPivotContainer;
