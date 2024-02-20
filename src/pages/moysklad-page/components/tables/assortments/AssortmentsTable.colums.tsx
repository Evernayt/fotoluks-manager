import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { getSellingPrice } from 'helpers/moysklad';
import { IAssortment } from 'models/api/moysklad/IAssortment';

const columnHelper = createColumnHelper<IAssortment>();

export const assortmentsTableColumns: ColumnDef<IAssortment, any>[] = [
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
  columnHelper.accessor('salePrices', {
    header: 'Цена',
    cell: ({ getValue }) =>
      `${((getSellingPrice(getValue()).salePrice?.value || 0) * 0.01).toFixed(2)} руб.`,
    meta: { className: 'row_nowrap' },
  }),
];
