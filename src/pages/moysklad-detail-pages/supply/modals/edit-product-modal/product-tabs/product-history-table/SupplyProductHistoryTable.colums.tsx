import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { UI_DATE_FORMAT } from 'constants/app';
import { ISupply } from 'models/api/moysklad/ISupply';
import moment from 'moment';
import SupplyProductQuantity from './cells/SupplyProductQuantityCell';
import SupplyProductPrice from './cells/SupplyProductPriceCell';

const columnHelper = createColumnHelper<ISupply>();

export const supplyProductHistoryTableColumns: ColumnDef<ISupply, any>[] = [
  columnHelper.accessor('name', {
    header: '№',
  }),
  columnHelper.accessor('moment', {
    header: 'Дата',
    cell: ({ getValue }) => moment(getValue()).format('DD.MM.YYYY'),
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('agent.name', {
    header: 'Контрагент',
    meta: { className: 'row_full' },
  }),
  columnHelper.display({
    id: 'quantity',
    header: 'Количество',
    cell: SupplyProductQuantity,
  }),
  columnHelper.display({
    id: 'price',
    header: 'Цена',
    cell: SupplyProductPrice,
  }),
];
