import { Checkbox } from '@chakra-ui/react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { getSellingPrice } from 'helpers/moysklad';
import { IAssortment } from 'models/api/moysklad/IAssortment';
import { ISalePrice } from 'models/api/moysklad/ISalePrice';

const columnHelper = createColumnHelper<IAssortment>();

export const assortmentsTableColumns: ColumnDef<IAssortment, any>[] = [
  columnHelper.accessor('article', {
    header: 'Артикул',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('code', {
    header: 'Код',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('name', {
    header: 'Наименование',
    meta: { className: 'row_full' },
  }),
  columnHelper.accessor('salePrices', {
    header: 'Цена продажи',
    cell: ({ getValue }) =>
      (getSellingPrice(getValue<ISalePrice[]>()).salePrice?.value || 0) * 0.01,
    meta: { className: 'row_nowrap' },
  }),
];

export const assortmentsTableColumnsWithSelect: ColumnDef<IAssortment, any>[] =
  [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          isChecked={table.getIsAllRowsSelected()}
          isIndeterminate={table.getIsSomeRowsSelected()}
          colorScheme="yellow"
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          isChecked={row.getIsSelected()}
          isDisabled={!row.getCanSelect()}
          isIndeterminate={row.getIsSomeSelected()}
          colorScheme="yellow"
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    ...assortmentsTableColumns,
  ];
