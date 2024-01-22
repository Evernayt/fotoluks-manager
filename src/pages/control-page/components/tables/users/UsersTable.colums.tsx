import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { UI_DATE_FORMAT } from 'constants/app';
import { IUser } from 'models/api/IUser';
import moment from 'moment';

const columnHelper = createColumnHelper<IUser>();

export const usersTableColumns: ColumnDef<IUser, any>[] = [
  columnHelper.accessor('id', {
    header: '№',
  }),
  columnHelper.accessor('name', {
    header: 'Имя',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('surname', {
    header: 'Фамилия',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('patronymic', {
    header: 'Отчество',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('phone', {
    header: 'Телефон',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('discount', {
    header: 'Процент скидки',
    meta: { className: 'row_nowrap' },
  }),
  columnHelper.accessor('moyskladSynchronizedAt', {
    header: 'Дата синхронизации',
    cell: ({ getValue }) =>
      getValue()
        ? moment(getValue()).format(UI_DATE_FORMAT)
        : 'Не импортировано',
    meta: { className: 'row_full' },
  }),
];
