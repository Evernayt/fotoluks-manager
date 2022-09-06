import { Loader } from 'components';
import { useEffect, useMemo, useState } from 'react';
import { Row, useTable } from 'react-table';
import ReactPaginate from 'react-paginate';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ControlPanelTypesToolbar from './ControlPanelTypesToolbar/ControlPanelTypesToolbar';
import { controlPanelSlice } from 'store/reducers/ControlPanelSlice';
import { modalSlice } from 'store/reducers/ModalSlice';
import { IType } from 'models/IType';
import { fetchTypesAPI } from 'http/typeAPI';
import styles from './ControlPanelTypesTable.module.css';
import { Modes } from 'constants/app';
import TypeMenuCell from './TypeMenuCell';

const ControlPanelTypesTable = () => {
  const [types, setTypes] = useState<IType[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [page, setPage] = useState<number>(1);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const typesFilter = useAppSelector((state) => state.controlPanel.typesFilter);
  const forceUpdate = useAppSelector((state) => state.controlPanel.forceUpdate);
  const isLoading = useAppSelector((state) => state.controlPanel.isLoading);
  const foundTypes = useAppSelector((state) => state.controlPanel.foundTypes);

  const dispatch = useAppDispatch();

  const columns = useMemo<any>(
    () => [
      {
        Header: '№',
        accessor: 'id',
      },
      {
        Header: 'Продукт',
        accessor: 'product.name',
        style: { width: '100%' },
      },
      {
        Header: 'Тип',
        accessor: 'name',
      },
      {
        Header: 'Категория',
        accessor: 'product.category.name',
      },
      {
        Header: 'Цена',
        accessor: 'price',
      },
      {
        Header: '',
        accessor: 'menu',
        Cell: TypeMenuCell,
      },
    ],
    []
  );

  useEffect(() => {
    setPage(1);
    if (foundTypes.typeData.rows.length === 0) {
      if (foundTypes.searchText === '') {
        dispatch(controlPanelSlice.actions.setForceUpdate(true));
        setIsNotFound(false);
      } else {
        setPageCount(1);
        setIsNotFound(true);
      }
    } else {
      setTypes(foundTypes.typeData.rows);
      const count = Math.ceil(foundTypes.typeData.count / limit);
      setPageCount(count);
      setIsNotFound(false);
    }
  }, [foundTypes]);

  useEffect(() => {
    if (typesFilter.filter.isActive) {
      fetchWithFilters();
    } else if (typesFilter.filter.isPendingDeactivation) {
      dispatch(controlPanelSlice.actions.deactiveTypesFilter());
      fetchTypes(page);
    } else if (forceUpdate) {
      fetchTypes(page);
    }

    dispatch(controlPanelSlice.actions.setForceUpdate(false));
  }, [forceUpdate]);

  const fetchTypes = (page: number, archive?: boolean) => {
    dispatch(controlPanelSlice.actions.setIsLoading(true));

    fetchTypesAPI(limit, page, archive)
      .then((data) => {
        setTypes(data.rows);
        const count = Math.ceil(data.count / limit);
        setPageCount(count);
      })
      .finally(() => dispatch(controlPanelSlice.actions.setIsLoading(false)));
  };

  const fetchWithFilters = () => {
    const { archive } = typesFilter;

    fetchTypes(page, archive);
  };

  const pageChangeHandler = (page: number) => {
    setPage(page);
    reload(page);
  };

  const reload = (page: number = 1) => {
    if (typesFilter.filter.isActive) {
      fetchWithFilters();
    } else {
      fetchTypes(page);
    }
  };

  const rowClickHandler = (row: Row<IType>) => {
    dispatch(
      modalSlice.actions.openControlPanelEditTypeModal({
        typeId: row.values.id,
        mode: Modes.EDIT_MODE,
      })
    );
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: types });

  return (
    <div style={{ height: '100%' }}>
      <ControlPanelTypesToolbar setLimit={setLimit} reload={() => reload()} />
      {isNotFound ? (
        <div className={[styles.container, styles.message].join(' ')}>
          Ничего не найдено
        </div>
      ) : (
        <div className={styles.container}>
          {isLoading ? (
            <Loader height="calc(100vh - 200px)" />
          ) : (
            <table {...getTableProps()} className={styles.section}>
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
                      className={styles.row}
                      onClick={(e: any) =>
                        e.target.tagName === 'TD' && rowClickHandler(row)
                      }
                    >
                      {row.cells.map((cell: any) => (
                        <td
                          {...cell.getCellProps()}
                          className={styles.cell}
                          style={cell.column.style}
                        >
                          {cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
      <div className={styles.pagination}>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Вперед"
          onPageChange={(e) => pageChangeHandler(e.selected + 1)}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="Назад"
          renderOnZeroPageCount={() => {}}
          containerClassName="pagination-container"
          pageLinkClassName="pagination-page"
          activeLinkClassName="pagination-active"
          previousLinkClassName="pagination-previous-next"
          nextLinkClassName="pagination-previous-next"
          disabledLinkClassName="pagination-disabled"
          breakLinkClassName="pagination-break"
          forcePage={page - 1}
        />
      </div>
    </div>
  );
};

export default ControlPanelTypesTable;
