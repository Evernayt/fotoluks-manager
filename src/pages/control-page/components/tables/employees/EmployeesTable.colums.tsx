import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { IEmployeeWithConnection } from './EmployeesTable.types';
import EmployeeConnectionState from './cells/EmployeeConnectionState';
import EmployeeRolesCell from './cells/EmployeeRolesCell';

const columnHelper = createColumnHelper<IEmployeeWithConnection>();

export const employeesTableColumns: ColumnDef<IEmployeeWithConnection, any>[] =
  [
    columnHelper.accessor('id', {
      header: '№',
    }),
    columnHelper.accessor('name', {
      header: 'Имя',
      meta: { className: 'row_nowrap' },
    }),
    columnHelper.accessor('surname', {
      header: 'Фамилия',
      meta: { className: 'row_nowrap' },
    }),
    columnHelper.accessor('login', {
      header: 'Логин',
      meta: { className: 'row_nowrap' },
    }),
    columnHelper.accessor('roles', {
      header: 'Роли',
      cell: ({ getValue }) => <EmployeeRolesCell roles={getValue()} />,
      meta: { className: 'row_full' },
    }),
    columnHelper.accessor('connectionStatus', {
      header: '',
      cell: ({ getValue }) => (
        <EmployeeConnectionState connectionState={getValue()} />
      ),
    }),
  ];
