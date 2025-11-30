import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ students }) => [
  {
    field: 'student_tz',
    title: 'תלמידה',
    ...getPropsForAutoComplete('student_tz', students, 'tz', 'name'),
  },
  { field: 'grade', title: 'ציון', type: 'numeric' },
];

const getFilters = ({ students }) => [
  {
    field: 'student_tz',
    label: 'תלמידה',
    type: 'list',
    list: students,
    operator: 'eq',
    idField: 'tz',
  },
  { field: 'grade', label: 'ציון', type: 'text', operator: 'like' },
];

const GradesContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    GET: { 'get-edit-data': editData },
  } = useSelector((state) => state[entity]);

  const columns = useMemo(() => editData && getColumns(editData), [editData]);
  const filters = useMemo(() => editData && getFilters(editData), [editData]);

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', 'get-edit-data'));
  }, []);

  return <Table entity={entity} title={title} columns={columns} filters={filters} />;
};

export default GradesContainer;
