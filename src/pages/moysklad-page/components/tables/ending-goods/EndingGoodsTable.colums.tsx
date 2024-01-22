import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { IEndingGood } from './EndingGoodsTable';
import EndingGoodOrderedCell from './cells/EndingGoodOrderedCell';
import EndingGoodNotAvailableCell from './cells/EndingGoodNotAvailableCell';
import EndingGoodNameCell from './cells/EndingGoodNameCell';

const columnHelper = createColumnHelper<IEndingGood>();

export const endingGoodsTableColumns: ColumnDef<IEndingGood, any>[] = [
  columnHelper.accessor('ordered', {
    header: 'Заказано',
    cell: ({ row }) => <EndingGoodOrderedCell row={row} />,
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('notAvailable', {
    header: 'Игнорировать',
    cell: ({ row }) => <EndingGoodNotAvailableCell row={row} />,
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('good', {
    header: 'Наименование',
    cell: ({ row }) => <EndingGoodNameCell row={row} />,
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('actualBalance', {
    header: 'Остаток',
    meta: { className: 'row_nowrap' },
  }),
];
