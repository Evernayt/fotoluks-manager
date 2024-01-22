import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { IPosition } from 'models/api/moysklad/IPosition';
import MoveQuantityCell from './cells/MoveQuantityCell';

const columnHelper = createColumnHelper<IPosition>();

export const moveTableColumns: ColumnDef<IPosition, any>[] = [
  columnHelper.display({
    id: 'num',
    header: '№',
    cell: ({ row }) => row.index + 1,
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.display({
    id: 'article',
    header: 'Артикул',
    cell: ({ row }) => row.original.assortment?.article,
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.display({
    id: 'code',
    header: 'Код',
    cell: ({ row }) => row.original.assortment?.code,
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.display({
    id: 'name',
    header: 'Наименование',
    cell: ({ row }) => row.original.assortment?.name,
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('quantity', {
    header: 'Количество',
    cell: MoveQuantityCell,
  }),
];
