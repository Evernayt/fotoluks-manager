import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { IShop } from 'models/api/IShop';

const columnHelper = createColumnHelper<IShop>();

export const shopsTableColumns: ColumnDef<IShop, any>[] = [
  columnHelper.accessor('id', {
    header: '№',
  }),
  columnHelper.accessor('name', {
    header: 'Наименование',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('abbreviation', {
    header: 'Аббревиатура',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('description', {
    header: 'Описание',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('address', {
    header: 'Адрес',
    meta: { className: 'row_full' },
  }),
];
