import Loader from 'components/Loader/Loader';
import { ReactNode, MouseEvent } from 'react';
import { Column, Row, useTable } from 'react-table';
import Pagination, { PaginationProps } from '../Pagination/Pagination';
import styles from './Table.module.scss';
import { ITableCustomCell } from './Table.types';

interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: Row<T>) => void;
  customCells?: ITableCustomCell[];
  isLoading?: boolean;
  notFoundText?: string;
  updateMyData?: (index: number, id: string, value: string) => void;
  skipPageReset?: boolean;
  pagination?: PaginationProps;
  paginationVisibility?: boolean;
  isHaveToolbar?: boolean;
  onContextMenu?: (row: Row<T>, e: MouseEvent<HTMLTableRowElement>) => void;
}

const Table = <T extends object>({
  data,
  columns,
  onRowClick,
  customCells,
  isLoading,
  notFoundText = 'Ничего не найдено',
  updateMyData,
  skipPageReset,
  pagination,
  paginationVisibility = true,
  isHaveToolbar = true,
  onContextMenu,
}: TableProps<T>) => {
  const rowClickHandler = (row: Row<T>) => {
    if (!onRowClick) return;
    onRowClick(row);
  };

  const contextMenuHandler = (
    row: Row<T>,
    e: MouseEvent<HTMLTableRowElement>
  ) => {
    if (!onContextMenu) return;
    onContextMenu(row, e);
  };

  const getCustomCell = (cell: any): ReactNode => {
    const CustomCell = customCells?.find(
      (customCell) => cell.column.id === customCell.accessor
    );

    if (CustomCell) {
      return (
        <td
          {...cell.getCellProps()}
          className={styles.custom_cell}
          style={{ ...cell.column.style }}
        >
          <CustomCell.cell cell={cell} {...CustomCell.props} />
        </td>
      );
    } else {
      return null;
    }
  };

  const tableHeight = (): string => {
    let height = 0;
    if (isHaveToolbar) height += 53;
    if (pagination) height += 53;
    if (pagination?.pageCount === 0) height -= 53;

    if (height === 0) {
      return '100%';
    } else {
      return `calc(100% - ${height}px)`;
    }
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    //@ts-ignore
    useTable({ columns, data, autoResetPage: !skipPageReset, updateMyData });

  return (
    <>
      <div className={styles.container} style={{ height: tableHeight() }}>
        {isLoading ? (
          <Loader height="calc(100vh - 200px)" />
        ) : (
          <>
            {data.length === 0 ? (
              <div className={styles.message}>{notFoundText}</div>
            ) : (
              <table {...getTableProps()} className={styles.table}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column: any) => (
                        <th
                          {...column.getHeaderProps()}
                          className={styles.column}
                          style={column.style}
                        >
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className={onRowClick && styles.row}
                        onClick={(e: any) =>
                          e.target.tagName === 'TD' && rowClickHandler(row)
                        }
                        onContextMenu={(e) => contextMenuHandler(row, e)}
                      >
                        {row.cells.map((cell: any) => {
                          const customCell = getCustomCell(cell);
                          if (customCell) {
                            return customCell;
                          } else {
                            return (
                              <td
                                {...cell.getCellProps()}
                                className={styles.cell}
                                style={
                                  cell.row.original.active
                                    ? { ...cell.column.style, color: '#14a44d' }
                                    : cell.column.style
                                }
                              >
                                {cell.render('Cell')}
                              </td>
                            );
                          }
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
      {pagination && paginationVisibility && pagination.pageCount > 0 && (
        <div className={styles.pagination}>
          <Pagination
            page={pagination.page}
            pageCount={pagination.pageCount}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </>
  );
};

export default Table;
