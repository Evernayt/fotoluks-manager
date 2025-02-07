import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { IStore } from 'models/api/moysklad/IStore';

const columnHelper = createColumnHelper<IStore>();

export const supplyProductStocksTableColumns: ColumnDef<IStore, any>[] = [
  columnHelper.accessor('name', {
    header: 'Склад',
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('stock', {
    header: 'Остаток',
  }),
];
