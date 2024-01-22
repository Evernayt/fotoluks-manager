import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { IAssortmentWithStore } from './StocksTable';
import StockCell from './cells/StockCell';

const columnHelper = createColumnHelper<IAssortmentWithStore>();

export const stocksTableColumns: ColumnDef<IAssortmentWithStore, any>[] = [
  columnHelper.accessor('name', {
    header: 'Наименование',
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('article', {
    header: 'Артикул',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('code', {
    header: 'Код',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('lunaStock', {
    header: 'Луна',
    cell: ({ getValue }) => <StockCell stock={getValue()} />,
  }),
  columnHelper.accessor('michStock', {
    header: 'Мич',
    cell: ({ getValue }) => <StockCell stock={getValue()} />,
  }),
];
