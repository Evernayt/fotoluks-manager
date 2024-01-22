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
import styles from './Table.module.scss';
import './Table.scss';

interface IMeta {
  className?: string;
  style?: CSSProperties;
}

interface TableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  notFoundText?: string;
  isLoading?: boolean;
  pagination?: PaginationProps;
  containerStyle?: CSSProperties;
  loaderProps?: LoaderProps;
  notFoundTextProps?: HeadingProps;
  sorting?: SortingState;
  enableRowSelection?: boolean;
  updateData?: (rowIndex: number, columnId: string, value: any) => void;
  autoResetPageIndex?: boolean;
  onSortingChange?: (updater: Updater<SortingState>) => void;
  onRowClick?: (row: Row<TData>) => void;
  onRowSelect?: (rows: RowSelectionState) => void;
  onContextMenu?: (row: Row<TData>, e: MouseEvent<HTMLTableRowElement>) => void;
}

const CLICKABLE_TAGES = ['TD', 'SPAN'];

const Table = <TData, TValue>({
  columns,
  data,
  notFoundText = 'Ничего не найдено',
  isLoading = false,
  pagination,
  containerStyle,
  loaderProps,
  notFoundTextProps,
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

  const rowClickHandler = (e: any, row: Row<TData>) => {
    if (
      CLICKABLE_TAGES.includes(e.target.tagName) ||
      e.target.getAttribute('data-clickable')
    ) {
      if (isClickable) {
        onRowClick(row);
      }
    }
  };

  const contextMenuHandler = (
    row: Row<TData>,
    e: MouseEvent<HTMLTableRowElement>
  ) => {
    if (!onContextMenu) return;
    onContextMenu(row, e);
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
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      className={[
                        styles.row,
                        isClickable && styles.clickable_row,
                      ].join(' ')}
                      onClick={(e: any) => rowClickHandler(e, row)}
                      onContextMenu={(e) => contextMenuHandler(row, e)}
                      key={row.id}
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
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
