import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  Row,
  SortingState,
  getSortedRowModel,
  RowSelectionState,
  Updater,
  functionalUpdate,
} from '@tanstack/react-table';
import Loader, { LoaderProps } from '../loader/Loader';
import Pagination, { PaginationProps } from '../pagination/Pagination';
import { Divider, Heading, HeadingProps } from '@chakra-ui/react';
import { CSSProperties, MouseEvent, useState } from 'react';
import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { ICON_SIZE, ICON_STROKE } from 'constants/app';
import { IEditor } from 'models/IEditor';
import { EditableTableRow, TableRow } from './row/TableRow';
import styles from './Table.module.scss';
import './Table.scss';

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  notFoundText?: string;
  isLoading?: boolean;
  pagination?: PaginationProps;
  containerStyle?: CSSProperties;
  loaderProps?: LoaderProps;
  notFoundTextProps?: HeadingProps;
  editors?: IEditor[];
  sorting?: SortingState;
  enableRowSelection?: boolean;
  updateData?: (rowIndex: number, columnId: string, value: any) => void;
  autoResetPageIndex?: boolean;
  onSortingChange?: (updater: Updater<SortingState>) => void;
  onRowClick?: (row: Row<TData>) => void;
  onRowSelect?: (rows: RowSelectionState) => void;
  onContextMenu?: (row: Row<TData>, e: MouseEvent<HTMLTableRowElement>) => void;
}

const Table = <TData, TValue>({
  columns,
  data,
  notFoundText = 'Ничего не найдено',
  isLoading = false,
  pagination,
  containerStyle,
  loaderProps,
  notFoundTextProps,
  editors,
  sorting,
  enableRowSelection,
  updateData,
  autoResetPageIndex,
  onSortingChange,
  onRowClick,
  onRowSelect,
  onContextMenu,
}: TableProps<TData, TValue>) => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const isClickable = onRowClick && !enableRowSelection;

  const rowSelectHandler = (updater: Updater<RowSelectionState>) => {
    const select = functionalUpdate(updater, rowSelection);
    setRowSelection(select);
    if (!onRowSelect) return;
    onRowSelect(select);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    //@ts-ignore
    getRowId: enableRowSelection ? (row) => row.id : undefined,
    enableRowSelection,
    onRowSelectionChange: rowSelectHandler,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex,
    meta: { updateData },
  });

  const getEditableRow = (row: Row<TData>) => {
    if (editors && editors.length > 0) {
      //@ts-ignore
      const editor = editors.find((x) => x.targetId === row.original.id);
      if (editor) {
        return { isEditable: true, employee: editor.employee };
      }
    }
    return { isEditable: false, employee: null };
  };

  return (
    <>
      <div className={styles.container} style={containerStyle}>
        {isLoading ? (
          <Loader {...loaderProps} />
        ) : (
          <>
            {data?.length ? (
              <table>
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <th
                            className={styles.column}
                            onClick={header.column.getToggleSortingHandler()}
                            key={header.id}
                          >
                            {header.isPlaceholder ? null : (
                              <div
                                className={
                                  sorting && header.column.getCanSort()
                                    ? styles.sortable_column
                                    : styles.not_sortable_column
                                }
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: (
                                    <IconSortAscending
                                      className="link-icon"
                                      size={ICON_SIZE - 2}
                                      stroke={ICON_STROKE}
                                    />
                                  ),
                                  desc: (
                                    <IconSortDescending
                                      className="link-icon"
                                      size={ICON_SIZE - 2}
                                      stroke={ICON_STROKE}
                                    />
                                  ),
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    const editableRow = getEditableRow(row);
                    return editableRow.isEditable ? (
                      <EditableTableRow
                        row={row}
                        employee={editableRow.employee}
                        key={row.id}
                      />
                    ) : (
                      <TableRow
                        row={row}
                        isClickable={isClickable}
                        onRowClick={onRowClick}
                        onContextMenu={onContextMenu}
                        key={row.id}
                      />
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <Heading
                className={styles.message}
                size="md"
                {...notFoundTextProps}
              >
                {notFoundText}
              </Heading>
            )}
          </>
        )}
      </div>
      {pagination && pagination.pageCount > 1 && (
        <div>
          <Divider />
          <Pagination
            page={pagination.page}
            pageCount={pagination.pageCount}
            isDisabled={isLoading}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </>
  );
};

export default Table;
