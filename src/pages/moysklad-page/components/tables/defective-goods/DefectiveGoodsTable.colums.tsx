import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { ISupply } from 'models/api/moysklad/ISupply';
import moment from 'moment';
import DefectiveGoodsAddCell from './cells/DefectiveGoodsAddCell';
import DefectiveGoodsStatusCell from './cells/DefectiveGoodsStatusCell';

const columnHelper = createColumnHelper<ISupply>();

export const defectiveGoodsTableColumns: ColumnDef<ISupply, any>[] = [
  columnHelper.accessor('name', {
    header: '№',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('incomingDate', {
    header: 'Дата',
    cell: ({ getValue }) => moment(getValue()).format('DD.MM.YYYY'),
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('agent.name', {
    header: 'Контрагент',
    meta: {
      className: 'row_nowrap',
      style: {
        maxWidth: '300px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
      },
    },
  }),
  columnHelper.accessor('incomingNumber', {
    header: 'Входящий номер',
    meta: { className: 'row_full' },
  }),
  columnHelper.display({
    id: 'statusText',
    header: 'Возврат',
    cell: ({ row }) => <DefectiveGoodsStatusCell row={row} />,
  }),
  columnHelper.display({
    id: 'addBtn',
    header: '',
    cell: ({ row }) => <DefectiveGoodsAddCell row={row} />,
  }),
];
