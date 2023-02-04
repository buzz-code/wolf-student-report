import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ studentTypes }) => [
  { field: 'tz', title: 'תעודת זהות' },
  { field: 'name', title: 'שם', columnOrder: 'students.name' },
  { field: 'phone', title: 'טלפון' },
  { field: 'klass', title: 'כיתה' },
  {
    field: 'student_type_id',
    title: 'סוג התלמידה',
    ...getPropsForAutoComplete('student_type_id', studentTypes, 'key'),
  },
];
const getFilters = () => [
  { field: 'tz', label: 'תעודת זהות', type: 'text', operator: 'like' },
  { field: 'students.name', label: 'שם', type: 'text', operator: 'like' },
  { field: 'phone', label: 'טלפון', type: 'text', operator: 'like' },
  { field: 'klass', label: 'כיתה', type: 'text', operator: 'like' },
  { field: 'student_types.name', label: 'סוג התלמידה', type: 'text', operator: 'like' },
];

const StudentsContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    GET: { 'get-edit-data': editData },
  } = useSelector((state) => state[entity]);

  const columns = useMemo(() => editData && getColumns(editData), [editData]);
  const filters = useMemo(() => getFilters(), []);

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', 'get-edit-data'));
  }, []);

  return <Table entity={entity} title={title} columns={columns} filters={filters} />;
};

export default StudentsContainer;
