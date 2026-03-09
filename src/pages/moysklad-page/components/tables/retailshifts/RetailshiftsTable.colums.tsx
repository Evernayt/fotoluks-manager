import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { UI_DATE_FORMAT } from 'constants/app';
import { IRetailshift } from 'models/api/moysklad/IRetailshift';
import moment from 'moment';

const columnHelper = createColumnHelper<IRetailshift>();

export const retailshiftsTableColumns: ColumnDef<IRetailshift, any>[] = [
  columnHelper.accessor('name', {
    header: '№',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('moment', {
    header: 'Дата открытия',
    cell: ({ getValue }) =>
      moment(getValue()).utcOffset('+07:00').format(UI_DATE_FORMAT),
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('closeDate', {
    header: 'Дата закрытия',
    cell: ({ getValue }) =>
      moment(getValue()).utcOffset('+07:00').format(UI_DATE_FORMAT),
    meta: { className: 'row_full' }, // { className: 'row_nowrap' }
  }),
  // columnHelper.accessor('owner.name', {
  //   header: 'Сотрудник',
  //   meta: { className: 'row_nowrap' },
  // }),
  // columnHelper.accessor('owner.group.name', {
  //   header: 'Отдел',
  //   meta: { className: 'row_full' },
  // }),
];
