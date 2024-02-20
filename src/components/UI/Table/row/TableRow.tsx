import { CSSProperties, MouseEvent } from 'react';
import { Row, flexRender } from '@tanstack/react-table';
import { IEmployee } from 'models/api/IEmployee';
import { Avatar, Text } from '@chakra-ui/react';
import { getEmployeeFullName } from 'helpers/employee';
import styles from './TableRow.module.scss';

interface IMeta {
  className?: string;
  style?: CSSProperties;
}

interface TableRowProps<TData> {
  row: Row<TData>;
  isClickable?: boolean;
  lastActiveRowId?: number | string;
  onRowClick?: (row: Row<TData>) => void;
  onContextMenu?: (row: Row<TData>, e: MouseEvent<HTMLTableRowElement>) => void;
}

interface EditableTableRowProps<TData> {
  row: Row<TData>;
  employee: IEmployee | null;
}

const CLICKABLE_TAGES = ['TD', 'SPAN'];

const TableRow = <TData, _TValue>({
  row,
  isClickable,
  lastActiveRowId,
  onRowClick,
  onContextMenu,
}: TableRowProps<TData>) => {
  //@ts-ignore
  const isLastActiveRow = lastActiveRowId === row.original.id;

  const rowClickHandler = (e: any) => {
    if (
      CLICKABLE_TAGES.includes(e.target.tagName) ||
      e.target.getAttribute('data-clickable')
    ) {
      if (isClickable && onRowClick) {
        onRowClick(row);
      }
    }
  };

  const contextMenuHandler = (e: MouseEvent<HTMLTableRowElement>) => {
    if (!onContextMenu) return;
    onContextMenu(row, e);
  };

  return (
    <tr
      className={[
        styles.row,
        isClickable && styles.clickable_row,
        isLastActiveRow && styles.active_row,
      ].join(' ')}
      onClick={rowClickHandler}
      onContextMenu={contextMenuHandler}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          className={[
            styles.cell,
            (cell.column.columnDef.meta as IMeta)?.className,
          ].join(' ')}
          style={(cell.column.columnDef.meta as IMeta)?.style}
          key={cell.id}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

const EditableTableRow = <TData, _TValue>({
  row,
  employee,
}: EditableTableRowProps<TData>) => {
  return (
    <tr className={styles.row} style={{ transform: 'scale(1)' }}>
      {row.getVisibleCells().map((cell) => (
        <td
          className={[
            styles.cell,
            (cell.column.columnDef.meta as IMeta)?.className,
          ].join(' ')}
          style={(cell.column.columnDef.meta as IMeta)?.style}
          key={cell.id}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
      <td className={styles.editor_row}>
        <Text className={styles.editor_text} as="b">
          Редактирует ➛
        </Text>
        <Avatar
          src={employee?.avatar || undefined}
          name={getEmployeeFullName(employee)}
          size="sm"
        />
        <Text className={styles.editor_text} as="b">
          {getEmployeeFullName(employee)}
        </Text>
      </td>
    </tr>
  );
};

export { TableRow, EditableTableRow };
