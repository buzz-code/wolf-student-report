import React, { useMemo } from 'react';

import Table from '../../../common-modules/client/components/table/Table';

const getColumns = () => [
  { field: 'key', title: 'קוד', type: 'numeric' },
  { field: 'name', title: 'שם התמחות' },
];
const getFilters = () => [
  { field: 'key', label: 'קוד', type: 'text', operator: 'like' },
  { field: 'name', label: 'שם התמחות', type: 'text', operator: 'like' },
];

const SpecialtiesContainer = ({ entity, title }) => {
  const columns = useMemo(() => getColumns(), []);
  const filters = useMemo(() => getFilters(), []);

  return <Table entity={entity} title={title} columns={columns} filters={filters} />;
};

export default SpecialtiesContainer;
