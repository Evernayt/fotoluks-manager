import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { IOrderFile } from 'models/api/IOrderFile';
import OrderFilesDownloadCell from './cells/OrderFilesDownloadCell';
import OrderFilesExtencionCell from './cells/OrderFilesExtencionCell';
import { formatBytes } from 'helpers';
import OrderFilesDaysLeftCell from './cells/OrderFilesDaysLeftCell';

const columnHelper = createColumnHelper<IOrderFile>();

export const orderFilesTableColumns: ColumnDef<IOrderFile, any>[] = [
  columnHelper.display({
    id: 'extension',
    header: '',
    cell: ({ row }) => <OrderFilesExtencionCell row={row} />,
  }),
  columnHelper.accessor('name', {
    header: 'Файл',
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Дата создания',
    cell: ({ getValue }) => <OrderFilesDaysLeftCell createdAt={getValue()} />,
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('size', {
    header: 'Размер',
    cell: ({ getValue }) => formatBytes(getValue()),
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.display({
    id: 'download',
    header: '',
    cell: ({ row }) => <OrderFilesDownloadCell row={row} />,
  }),
];
