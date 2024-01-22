import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { UI_DATE_FORMAT } from 'constants/app';
import { ISupply } from 'models/api/moysklad/ISupply';
import moment from 'moment';

const columnHelper = createColumnHelper<ISupply>();

export const updatePricesTableColumns: ColumnDef<ISupply, any>[] = [
  columnHelper.accessor('name', {
    header: '№',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('created', {
    header: 'Дата создания',
    cell: ({ getValue }) => moment(getValue()).format(UI_DATE_FORMAT),
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('incomingNumber', {
    header: 'Входящий номер',
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('sum', {
    header: 'Сумма',
    cell: ({ getValue }) => (getValue() * 0.01).toFixed(2),
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('description', {
    header: 'Описание',
    meta: {
      className: 'row_nowrap',
      style: {
        maxWidth: '300px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
    },
  }),
];
