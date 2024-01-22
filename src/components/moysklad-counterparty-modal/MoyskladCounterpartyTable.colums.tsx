import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { getAccumulationDiscount } from 'helpers/moysklad';
import { ICounterparty } from 'models/api/moysklad/ICounterparty';
import { IDiscount } from 'models/api/moysklad/IDiscount';

const columnHelper = createColumnHelper<ICounterparty>();

export const counterpartyTableColumns: ColumnDef<ICounterparty, any>[] = [
  columnHelper.accessor('name', {
    header: 'ФИО',
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('phone', {
    header: 'Телефон',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('discounts', {
    header: 'Процент скидки',
    cell: ({ getValue }) => getAccumulationDiscount(getValue<IDiscount[]>()),
    meta: { className: 'row_nowrap' },
  }),
];
