import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { UI_DATE_FORMAT } from 'constants/app';
import { getEmployeeShortName } from 'helpers/employee';
import { IReport } from 'models/api/IReport';
import moment from 'moment';
import ReportCompletedCell from './cells/ReportCompletedCell';

const columnHelper = createColumnHelper<IReport>();

export const reportsTableColumns: ColumnDef<IReport, any>[] = [
  columnHelper.accessor('id', {
    header: '№',
  }),
  columnHelper.accessor('createdAt', {
    header: 'Дата создания',
    cell: ({ getValue }) => moment(getValue()).format(UI_DATE_FORMAT),
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('description', {
    header: 'Описание',
    meta: { className: 'row_full', style: { whiteSpace: 'pre-line' } },
  }),
  columnHelper.accessor('employee', {
    header: 'Создал',
    cell: ({ getValue }) => getEmployeeShortName(getValue()),
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('completed', {
    header: 'Состояние',
    cell: ({ getValue }) => <ReportCompletedCell completed={getValue()} />,
    meta: { className: 'row_nowrap' },
  }),
];
