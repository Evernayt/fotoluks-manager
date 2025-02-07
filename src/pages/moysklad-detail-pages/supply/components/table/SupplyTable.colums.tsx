import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { IPosition } from 'models/api/moysklad/IPosition';
import SupplyQuantityCell from './cells/SupplyQuantityCell';
import SupplyNameCell from './cells/SupplyNameCell';
import SupplyPriceCell from './cells/SupplyPriceCell';
import SupplyPriceSumCell from './cells/SupplyPriceSumCell';
import SupplyGTDCell from './cells/SupplyGTDCell';

const columnHelper = createColumnHelper<IPosition>();

export const supplyTableColumns: ColumnDef<IPosition, any>[] = [
  columnHelper.display({
    id: 'num',
    header: '№',
    cell: ({ row, table }) => table.getRowModel().rows.length - row.index,
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.display({
    id: 'name',
    header: 'Наименование',
    cell: SupplyNameCell,
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('stock.quantity', {
    header: 'Остаток',
  }),
  columnHelper.accessor('quantity', {
    header: 'Количество',
    cell: SupplyQuantityCell,
  }),
  columnHelper.accessor('price', {
    header: 'Цена',
    cell: SupplyPriceCell,
  }),
  columnHelper.display({
    id: 'priceSum',
    header: 'Сумма',
    cell: SupplyPriceSumCell,
  }),
  columnHelper.display({
    id: 'gtd.name',
    header: 'ГТД',
    cell: SupplyGTDCell,
  }),
];
