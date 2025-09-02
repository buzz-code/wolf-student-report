import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ students, specialties }) => [
  {
    field: 'student_tz',
    title: 'תלמידה',
    ...getPropsForAutoComplete('student_tz', students, 'tz', 'name'),
  },
  {
    field: 'specialty_key',
    title: 'התמחות',
    ...getPropsForAutoComplete('specialty_key', specialties, 'key', 'name'),
  },
];

const getFilters = ({ students, specialties }) => [
  {
    field: 'students.tz',
    label: 'תלמידה',
    type: 'list',
    list: students,
    operator: 'eq',
    idField: 'tz',
  },
  {
    field: 'specialties.key',
    label: 'התמחות',
    type: 'list',
    list: specialties,
    operator: 'eq',
    idField: 'key',
  },
];

const StudentSpecialtiesContainer = ({ entity, title }) => {
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

export default StudentSpecialtiesContainer;
