import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { IChangelog } from 'models/api/IChangelog';

const columnHelper = createColumnHelper<IChangelog>();

export const changelogsTableColumns: ColumnDef<IChangelog, any>[] = [
  columnHelper.accessor('version', {
    header: 'Версия',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('description', {
    header: 'Что нового',
    meta: { className: 'row_full', style: { whiteSpace: 'pre-line' } },
  }),
];
