import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { UI_DATE_FORMAT } from 'constants/app';
import { IOrderInfo } from 'models/api/IOrderInfo';
import { getEmployeeFullName } from 'helpers/employee';
import OrderInfoReasonCell from './cells/OrderInfoReasonCell';

const columnHelper = createColumnHelper<IOrderInfo>();

export const orderInfoTableColumns: ColumnDef<IOrderInfo, any>[] = [
  columnHelper.accessor('createdAt', {
    header: 'Дата изменения',
    cell: ({ getValue }) => moment(getValue()).format(UI_DATE_FORMAT),
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('status.name', {
    header: 'Статус',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('employee', {
    header: 'Сотрудник',
    cell: ({ getValue }) => getEmployeeFullName(getValue()),
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('description', {
    header: '',
    cell: ({ getValue }) => <OrderInfoReasonCell description={getValue()} />,
  }),
];
