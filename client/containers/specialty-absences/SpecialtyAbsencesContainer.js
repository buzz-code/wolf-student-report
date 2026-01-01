import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Table from '../../../common-modules/client/components/table/Table';
import * as crudAction from '../../../common-modules/client/actions/crudAction';
import { getPropsForAutoComplete } from '../../../common-modules/client/utils/formUtil';

const getColumns = ({ specialties }) => [
  { field: 'absence_date', title: 'תאריך היעדרות', type: 'date' },
  { field: 'report_until_date', title: 'תאריך אחרון לדיווח', type: 'date' },
  {
    field: 'specialty_key',
    title: 'התמחות',
    ...getPropsForAutoComplete('specialty_key', specialties, 'key', 'name'),
  },
  { field: 'is_confirmed', title: 'מאושר', type: 'boolean' },
];

const getFilters = ({ specialties }) => [
  { field: 'absence_date', label: 'תאריך היעדרות', type: 'date', operator: 'eq' },
  {
    field: 'specialty_key',
    label: 'התמחות',
    type: 'list',
    list: specialties,
    operator: 'eq',
    idField: 'key',
  },
  { field: 'is_confirmed', label: 'מאושר', type: 'boolean', operator: 'eq' },
];

const SpecialtyAbsencesContainer = ({ entity, title }) => {
  const dispatch = useDispatch();
  const {
    GET: { 'get-edit-data': editData },
  } = useSelector((state) => state[entity]);

  const columns = useMemo(() => editData && getColumns(editData), [editData]);
  const filters = useMemo(() => editData && getFilters(editData), [editData]);

  useEffect(() => {
    dispatch(crudAction.customHttpRequest(entity, 'GET', 'get-edit-data'));
  }, []);

  const manipulateDataToSave = useCallback(
    (dataToSave) => ({
      ...dataToSave,
      absence_date: dataToSave.absence_date && moment(dataToSave.absence_date).format('yyyy-MM-DD'),
      report_until_date:
        dataToSave.report_until_date && moment(dataToSave.report_until_date).format('yyyy-MM-DD'),
    }),
    []
  );

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

export default SpecialtyAbsencesContainer;
