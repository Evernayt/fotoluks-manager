import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { getEmployeeNameByStatusId } from './OrdersTable.service';
import { IOrder } from 'models/api/IOrder';
import { UI_DATE_FORMAT } from 'constants/app';
import OrderStatusCell from './cells/OrderStatusCell';
import OrderDeadlineCell from './cells/OrderDeadlineCell';
import OrderPhoneCell from './cells/OrderPhoneCell';
import OrderServicesCell from './cells/OrderServicesCell';

const columnHelper = createColumnHelper<IOrder>();

export const ordersTableColumns: ColumnDef<IOrder, any>[] = [
  columnHelper.accessor('id', {
    header: '№',
  }),
  columnHelper.accessor('createdAt', {
    header: 'Дата создания',
    cell: ({ getValue }) => moment(getValue()).format(UI_DATE_FORMAT),
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.display({
    id: 'services',
    header: 'Услуги',
    cell: ({ row }) => <OrderServicesCell row={row} />,
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('sum', {
    header: 'Сумма',
  }),
  columnHelper.accessor('status.id', {
    header: 'Статус',
    cell: ({ row }) => <OrderStatusCell row={row} />,
    id: 'status',
  }),
  columnHelper.accessor('shop.abbreviation', {
    header: 'Филиал',
  }),
  columnHelper.accessor('deadline', {
    header: 'Срок',
    cell: ({ row }) => <OrderDeadlineCell row={row} />,
  }),
  columnHelper.accessor('user.phone', {
    header: 'Телефон клиента',
    cell: ({ row }) => <OrderPhoneCell row={row} />,
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.display({
    id: 'accepted',
    header: 'Принял',
    cell: ({ row }) =>
      getEmployeeNameByStatusId(1, row.original.orderInfos || []),
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.display({
    id: 'gave',
    header: 'Отдал',
    cell: ({ row }) =>
      getEmployeeNameByStatusId(4, row.original.orderInfos || []),
    meta: { className: 'row_nowrap' },
  }),
];
