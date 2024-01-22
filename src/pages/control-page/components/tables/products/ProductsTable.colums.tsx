import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { UI_DATE_FORMAT } from 'constants/app';
import { IProduct } from 'models/api/IProduct';
import moment from 'moment';

const columnHelper = createColumnHelper<IProduct>();

export const productsTableColumns: ColumnDef<IProduct, any>[] = [
  columnHelper.accessor('id', {
    header: '№',
  }),
  columnHelper.accessor('name', {
    header: 'Наименование',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('price', {
    header: 'Цена',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('moyskladSynchronizedAt', {
    header: 'Дата синхронизации',
    cell: ({ getValue }) =>
      getValue() ? moment(getValue()).format(UI_DATE_FORMAT) : 'Не импортировано',
    meta: { className: 'row_full' },
  }),
];
