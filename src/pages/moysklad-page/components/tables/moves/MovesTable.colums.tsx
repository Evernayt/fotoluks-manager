import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { UI_DATE_FORMAT } from 'constants/app';
import { IMove } from 'models/api/moysklad/IMove';
import moment from 'moment';

const columnHelper = createColumnHelper<IMove>();

export const movesTableColumns: ColumnDef<IMove, any>[] = [
  columnHelper.accessor('name', {
    header: '№',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('created', {
    header: 'Дата создания',
    cell: ({ getValue }) => moment(getValue()).format(UI_DATE_FORMAT),
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('description', {
    header: 'Описание',
    meta: { className: 'row_full' },
  }),
];
