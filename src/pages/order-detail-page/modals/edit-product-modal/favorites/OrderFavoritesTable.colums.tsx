import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { IFavorite } from 'models/api/IFavorite';

const columnHelper = createColumnHelper<IFavorite>();

export const orderFavoritesTableColumns: ColumnDef<IFavorite, any>[] = [
  columnHelper.accessor('product.name', {
    header: 'Наименование',
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('product.price', {
    header: 'Цена',
    meta: { className: 'row_nowrap' },
  }),
];
